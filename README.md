# mcp-html2pdf

[![npm version](https://badge.fury.io/js/mcp-html2pdf.svg)](https://www.npmjs.com/package/mcp-html2pdf)
[![Docker Image](https://img.shields.io/docker/v/4kk11/mcp-html2pdf?logo=docker)](https://hub.docker.com/r/4kk11/mcp-html2pdf)

HTMLをPDFに変換するためのMCPサーバーです。  
Webページやテンプレートから高品質なPDFを生成することができます。

## 主な機能

### HTMLからPDFへの変換
HTMLコンテンツをPDFに変換します。CSSを含む完全なレイアウトとスタイルをサポートしています。


https://github.com/user-attachments/assets/09e53345-614c-4179-80b3-834787d4bdfc



## インストール方法

### Dockerを使用する場合

1. Dockerイメージをプル
```bash
docker pull 4kk11/mcp-html2pdf
```

2. 設定例（claude_desktop_config.json）
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
    }
  }
}
```

### npxを使用する場合

設定例（claude_desktop_config.json）:
```json
{
  "mcpServers": {
    "html2pdf": {
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
}
```

## 環境変数

> **注意**: Dockerを使用する場合、PDF出力ディレクトリの指定は環境変数ではなく、Dockerのボリュームマウント（`-v YOUR_PDF_OUTPUT_DIR:/app/outputs`）で行う必要があります。

| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| PDF_OUTPUT_DIR | 生成したPDFを保存するディレクトリのパス | - |

## 開発者向け

### Dockerイメージのビルドと管理

```bash
# Dockerイメージをビルド
make docker-build

# Dockerイメージを削除
make docker-clean
```

開発時の設定例（claude_desktop_config.json）:
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
    }
  }
}
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。
