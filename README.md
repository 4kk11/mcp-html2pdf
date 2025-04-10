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
    "html-templates": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v", // optional
        "YOUR_TEMPLATES_DIR:/app/resources", // optional
        "-e", // 
        "READ_ONLY",
        "4kk11/mcp-html2pdf"
      ],
      "env": {
        "READ_ONLY": "false"
      }
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
        "READ_ONLY": "false",
        "TEMPLATES_DIR": "YOUR_TEMPLATES_DIR"
      }
    }
}
```