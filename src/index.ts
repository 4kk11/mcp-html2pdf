#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ツール名の定義
enum ToolName {
  CONVERT_TO_PDF = "convert_to_pdf",
}

// PDF生成オプションのスキーマ定義
const PdfOptionSchema = z.object({
  format: z
    .enum(["A4", "A3", "Letter", "Legal"])
    .default("A4")
    .describe("PDF出力時の用紙フォーマット"),
  margin: z
    .object({
      top: z.string().default("1cm").describe("上マージン"),
      right: z.string().default("1cm").describe("右マージン"),
      bottom: z.string().default("1cm").describe("下マージン"),
      left: z.string().default("1cm").describe("左マージン"),
    })
    .default({
      top: "1cm",
      right: "1cm",
      bottom: "1cm",
      left: "1cm",
    })
    .describe("PDFのマージン設定"),
});

// HTML to PDF変換の入力スキーマ
const ConvertToPdfSchema = z.object({
  html: z.string().describe("変換対象のHTML内容"),
  options: PdfOptionSchema.optional().describe("PDF生成オプション"),
});

const createServer = () => {
  const server = new Server(
    {
      name: "mcp-html2pdf",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // PDF出力先ディレクトリの設定
  const OUTPUT_DIR = path.join(__dirname, "../output");

  // ツール一覧の取得ハンドラー
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools: Tool[] = [
      {
        name: ToolName.CONVERT_TO_PDF,
        description: "HTMLをPDFに変換してoutputディレクトリに保存します",
        inputSchema: zodToJsonSchema(ConvertToPdfSchema) as Tool["inputSchema"],
      },
    ];

    return { tools };
  });

  // ツールの実行ハンドラー
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === ToolName.CONVERT_TO_PDF) {
      const validatedArgs = ConvertToPdfSchema.parse(args);
      const { html, options } = validatedArgs;
      const defaultOptions = {
        format: "A4" as const,
        margin: {
          top: "1cm",
          right: "1cm",
          bottom: "1cm",
          left: "1cm",
        },
      };
      const pdfOptions = {
        format: options?.format || defaultOptions.format,
        margin: options?.margin || defaultOptions.margin,
      };

      try {
        const browser = await puppeteer.launch({
          headless: true,
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        // ファイル名に現在時刻を含める
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `pdf-${timestamp}.pdf`;
        const outputPath = path.join(OUTPUT_DIR, filename);

        // PDFバッファを生成
        const pdfBuffer = await page.pdf(pdfOptions);

        await browser.close();

        // PDFファイルを保存
        await fs.writeFile(outputPath, pdfBuffer);

        return {
          content: [
            {
              type: "text",
              text: outputPath,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(
          ErrorCode.InternalError,
          `PDF generation failed: ${errorMessage}`
        );
      }
    }

    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  });

  // エラーハンドリング
  server.onerror = (error) => console.error("[MCP Error]", error);

  return server;
};

const server = createServer();
const transport = new StdioServerTransport();

server.connect(transport).catch(console.error);