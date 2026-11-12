import test from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedResource, securePage } from '../build/render-security.js';

test('blocks network, metadata, local files, scripts, and malformed URLs', () => {
  for (const url of ['http://127.0.0.1:8000/secret', 'http://169.254.169.254/', 'https://example.com/image.png', 'file:///etc/passwd', 'ftp://localhost/', 'javascript:alert(1)', '/relative', 'not a url']) {
    assert.equal(isAllowedResource(url), false, url);
  }
});
test('allows only embedded resources and blank documents', () => {
  for (const url of ['data:image/png;base64,AA==', 'blob:null/test', 'about:blank']) {
    assert.equal(isAllowedResource(url), true, url);
  }
});
test('disables JS and installs a fail-closed resource policy before content', async () => {
  const calls = [];
  let handler;
  await securePage({
    async setJavaScriptEnabled(value) { calls.push(['js', value]); },
    async setRequestInterception(value) { calls.push(['intercept', value]); },
    on(event, fn) { calls.push(['on', event]); handler = fn; },
  });
  assert.deepEqual(calls, [['js', false], ['intercept', true], ['on', 'request']]);
  const outcomes = [];
  for (const url of ['http://localhost/', 'file:///tmp/secret', 'data:image/png;base64,AA==']) {
    handler({ url: () => url, continue: async () => outcomes.push('allow'), abort: async () => outcomes.push('block') });
  }
  assert.deepEqual(outcomes, ['block', 'block', 'allow']);
});
