import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { RequestHandler } from "express";

dotenv.config();

import express from "express";

export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token", token);

  if (!token) {
    res.sendStatus(401);
    console.log("Unauthorized");
    return; // important
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    console.log("Decoded", decoded);

    req.user = decoded as JwtPayload;

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.sendStatus(403);
    console.log("Forbidden");
    return; // important
  }
};

const app = express();

app.use((req, res, next) => {
  console.log("Request received", req.method, req.url);
  next();
});

let servers: any[] = [];

app.get("/", (req, res) => {
  console.log("Hello World");
  res.send("Hello World");
});

app.get("/sse", authenticateToken, async (req, res) => {
  console.log("SSE requested");
  const transport = new SSEServerTransport("/message", res);
  const server = new McpServer({
    name: "bsc-mcp",
    version: "1.0.0",
  });

  // Define the test tool with a properly structured response
  server.tool("test", "Test description", async () => {
    console.log("Test tool called");
    return {
      content: [
        {
          type: "text",
          text: "Security check successful",
        },
      ],
    };
  });

  // Tool 1: Echo Tool
  server.tool(
    "echo",
    "Echo back a message",
    {
      message: z.string().describe("Message to echo back"),
    },
    async ({ message }) => {
      return {
        content: [
          {
            type: "text",
            text: `Echo: ${message}`,
          },
        ],
      };
    }
  );

  // Tool 2: Get Time Tool
  server.tool("get-time", "Get current server time", {}, async () => {
    const currentTime = new Date().toISOString();
    return {
      content: [
        {
          type: "text",
          text: `Current server time is: ${currentTime}`,
        },
      ],
    };
  });

  // Tool 3: Random Number Generator
  server.tool(
    "random-number",
    "Generate a random number",
    {
      min: z.number().optional().default(0).describe("Minimum value"),
      max: z.number().optional().default(100).describe("Maximum value"),
    },
    async ({ min, max }) => {
      const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
      return {
        content: [
          {
            type: "text",
            text: `Random number between ${min} and ${max}: ${randomValue}`,
          },
        ],
      };
    }
  );

  server.connect(transport);

  req.on("close", () => {
    console.log("Client closed connection");
  });

  server.server.onclose = () => {
    console.log("SSE connection closed");
    servers = servers.filter((s) => s !== server);
  };

  servers.push(server);
});

app.get("/auth/token", (req, res) => {
  console.log("Auth token requested");
  const username = req.query.username || "aniket";
  const scope = req.query.scope || "mcp:access";

  const token = jwt.sign(
    { username, scope },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h", issuer: "SSE MCP SERVER" }
  );

  res.json({ token });
});

app.post("/message", authenticateToken, async (req, res) => {
  console.log("Received message");

  const sessionId = req.query.sessionId;
  const transport = servers
    .map((s) => s.server.transport)
    .find((t) => t.sessionId === sessionId);

  if (!transport) {
    res.status(404).send("Session not found");
    return;
  }

  await transport.handlePostMessage(req, res);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/sse`);
});
