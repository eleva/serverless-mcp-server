# 🧠 serverless-mcp-server
A super simple Model Context Protocol (MCP) server deployed on AWS Lambda and exposed via Amazon API Gateway, deployed with Serverless Framework.
This skeleton is based on the awesome work of [Frédéric Barthelet](https://github.com/fredericbarthelet): which has developed a middy middleware for Model Context Protocol (MCP) server integration with AWS Lambda functions in [this repo](https://github.com/fredericbarthelet/middy-mcp)

## 🛠 Features
- 🪄 Minimal MCP server setup using @modelcontextprotocol/sdk
- 🚀 Deployed as a single AWS Lambda function
- 🌐 HTTP POST endpoint exposed via API Gateway at /mcp
- 🔄 Supports local development via serverless-offline
- 🧪 Includes a simple example tool (add) with JSON-RPC interaction

## 📦 Project Structure
```
serverless-mcp-server/
├── src/                    # Source code
│   └── index.js                # MCP server handler
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
├── package-lock.json       # Project lock file
├── README.md               # This documentation file
└── serverless.yml          # Serverless Framework config
```

## 🛠 Prerequisites
- Node.js v22+ 
- [Open Source Serverless](https://github.com/oss-serverless/serverless) or Serverless Framework v3+
- Serverless Offline

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Install open source severless globally (if not already installed):
```bash
npm install -g osls
```

3. Run Locally with serverless-offline
```bash
npm sls offline
```

Local endpoint will be available at:
POST `http://localhost:3000/dev/mcp`

Note that the `/dev/` stage is added by default when using serverless-offline, reflecting Api Gateway V1 (REST API) behavior.

## Switch to Api Gateway V2 (HTTP API)
If you want to use API Gateway V2, you can change the `serverless.yml` file to use `httpApi` instead of `http` in the `events` section. This will allow you to use HTTP APIs instead of REST APIs.
This will allow you to use HTTP APIs instead of REST APIs.

```yaml
functions:
  mcpServer:
    handler: src/index.handler
    events:
      - httpApi:
          path: mcp
          method: post
```

Local endpoint will be available at:
POST `http://localhost:3000/mcp`

Note that the `/dev/` stage is not needed when using API Gateway V2.
Note you should change test curl and postman requests accordingly.

## 🧪 Test with curl requests

### List tools
```bash
curl --location 'http://localhost:3000/dev/mcp' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--header 'jsonrpc: 2.0' \
--data '{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}'
```

### ➕ Use the add Tool
```bash
curl --location 'http://localhost:3000/dev/mcp' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--header 'jsonrpc: 2.0' \
--data '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "add",
    "arguments": {
      "a": 5,
      "b": 3
    }
  }
}'
```

## 🧪 Test with jest

There are some basic tests included in the `__tests__` folder. You can run them with:

```bash
npm run test
```

## 🧬 Code Breakdown
This code is based on the awesome work of [Frédéric Barthelet](https://github.com/fredericbarthelet): which has developed a middy middleware for Model Context Protocol (MCP) server integration with AWS Lambda functions in [this repo](https://github.com/fredericbarthelet/middy-mcp)

### src/index.js
```javascript
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import mcpMiddleware from "middy-mcp";

const server = new McpServer({
  name: "Lambda hosted MCP Server",
  version: "1.0.0",
});

server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));

export const handler = middy()
  .use(mcpMiddleware({ server }))
  .use(httpErrorHandler());
```

## 📡 Deploy to AWS

Just run:

```bash
sls deploy
```
After deployment, the MCP server will be live at the URL output by the command.

## 📘 License
MIT — feel free to fork, tweak, and deploy your own version!

