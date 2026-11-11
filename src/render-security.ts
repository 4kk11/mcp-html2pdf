import type { Page } from "puppeteer";

// Self-contained HTML only: no network or host filesystem resource loads.
export function isAllowedResource(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "data:" || parsed.protocol === "blob:" ||
      parsed.href === "about:blank";
  } catch {
    return false;
  }
}

export async function securePage(page: Page): Promise<void> {
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    void (isAllowedResource(request.url()) ? request.continue() : request.abort())
      .catch(() => { /* The page may have closed while the request was pending. */ });
  });
}
