# mcp-html2pdf

HTMLをPDFに変換するMCP

# 使い方

## 開発
```bash
# Dockerイメージをビルド
make docker-build

# Dockerイメージを削除
make docker-clean
```

```json
{
  "mcpServers": {
    "html2pdf": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--shm-size",
        "2G",
        "--rm",
        "-v",
        "YOUR_PDF_OUTPUT_DIR:/app/outputs",
        "mcp-html2pdf"
      ]
    },
  }
}
```

## 本番

### Docker

```bash
docker pull 4kk11/mcp-html2pdf
```

```json
{
  "mcpServers": {
    "html2pdf": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--shm-size",
        "2G",
        "--rm",
        "-v",
        "YOUR_PDF_OUTPUT_DIR:/app/outputs",
        "4kk11/mcp-html2pdf"
      ]
    },
  }
}
```


### npx

```json
"mcpServers": {
    "html-templates": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-html2pdf"
      ],
      "env": {
        "PDF_OUTPUT_DIR": "YOUR_PDF_OUTPUT_DIR"
      }
    }
}
```