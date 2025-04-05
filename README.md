# 🔐 SSE MCP Server with JWT Authentication

This is a **Model Context Protocol (MCP)** SSE server with JWT-based authentication.  
It allows you to expose multiple AI tools over an SSE transport, protected via secure Bearer Token flow.

Built with:
- 🚀 Node.js + Express
- 🧩 @modelcontextprotocol/sdk
- 🔒 JSON Web Tokens (JWT) for authentication
- ⚙️ Zod for input validation

> ✅ Fully tested with [`@modelcontextprotocol/inspector`](https://modelcontextprotocol.github.io/inspector)

## 📂 Project Structure

```
server/
├── index.ts          # Main Express + MCP server
├── .env              # Environment variables
├── package.json      # Project metadata & scripts
├── tsconfig.json     # TypeScript config
└── README.md         # You are here!
```

## ✨ Features

- ✅ Secure SSE connection using Bearer JWT token
- ✅ Dynamic Tool registration (echo, time, random number, etc.)
- ✅ Tested with MCP Inspector
- ✅ Logs all request lifecycle events
- ✅ Session management for /message endpoint
- 🚀 Ready to extend for production use

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/anisirji/mcp-server-remote-setup-with-jwt-auth.git
cd mcp-server-remote-setup-with-jwt-auth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
echo "JWT_SECRET=your-secret-key" > .env
```

### 4. Run the server

```bash
npm run dev
```

✅ Server will run on:  
```
http://localhost:3001/sse
```

## 🧪 Testing the server with MCP Inspector

### Step 1 — Install MCP Inspector

> 📖 Official Docs: [MCP Inspector](https://modelcontextprotocol.github.io/inspector)

```bash
npx @modelcontextprotocol/inspector
```

### Step 2 — Generate a token

Use cURL to get your JWT token:

```bash
curl "http://localhost:3001/auth/token?username=aniket&scope=mcp:access"
```

✅ Example response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 3 — Connect MCP Inspector

1. Open Inspector UI
2. Set Transport Type: **SSE**
3. URL:  
   ```
   http://localhost:3001/sse
   ```
4. Add Authorization Header:
   ```
   Authorization: Bearer <your-token>
   ```
5. Click **Connect**

🎉 Success! Your server is now connected.

### Step 4 — Test tools

Go to **Tools** tab in Inspector and click **List Tools**.

You will see:
- ✅ `test`
- ✅ `echo`
- ✅ `get-time`
- ✅ `random-number`

Test them and enjoy!

## 📖 API Reference

### 🔑 Generate Token
```
GET /auth/token?username=<username>&scope=mcp:access
```

### 🔌 SSE Endpoint (requires token)
```
GET /sse
Authorization: Bearer <token>
```

### 📩 Send Message to active session
```
POST /message?sessionId=<sessionId>
Authorization: Bearer <token>
```

## 🧩 Tools Reference

| Tool Name         | Description                    |
| ---------------- | ------------------------------ |
| `test`            | Test connection (security check) |
| `echo`            | Echo back provided message      |
| `get-time`        | Returns current server time     |
| `random-number`   | Returns random number (min/max) |

## 🗓️ Upcoming Changes

- [ ] Token revocation list (blacklist)
- [ ] Role-based tool access (scope checks)
- [ ] Session heartbeat / keep-alive
- [ ] Rate limiting & logging
- [ ] Dockerization for deployment

## 📚 Useful Resources

- [Model Context Protocol Introduction](https://modelcontextprotocol.github.io/specification)
- [MCP Inspector Docs](https://modelcontextprotocol.github.io/inspector)
- [JWT.io Debugger](https://jwt.io/)
- [Zod Validation Docs](https://zod.dev/)

## 👨‍💻 Maintainer

> **Aniket**

## 📄 License

This project is open-source and free to use.

# 🚀 Build. Secure. Empower.
