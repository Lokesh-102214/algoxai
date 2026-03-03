# AlgoX.ai — AWS Backend Deployment Guide

## Prerequisites

1. **AWS SAM CLI** — [Install guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
2. **AWS CLI configured** with your `algoxai-dev` IAM user credentials
3. **Node.js 20+** installed locally
4. **esbuild** (SAM downloads it automatically during `sam build`)

---

## Step 1 — Configure AWS credentials

```powershell
aws configure
# AWS Access Key ID:     <your AKID>
# AWS Secret Access Key: <your secret>
# Default region name:   us-east-1
# Default output format: json
```

---

## Step 2 — Build & Deploy

```powershell
cd aws

# Install dependencies for each Lambda
cd lambdas/orchestrator   ; npm install ; cd ../..
cd lambdas/chat-history   ; npm install ; cd ../..
cd lambdas/agent-concept-breaker  ; npm install ; cd ../..
cd lambdas/agent-refactorer       ; npm install ; cd ../..
cd lambdas/agent-trouble-shooter  ; npm install ; cd ../..

# Build all Lambdas (esbuild bundles ../shared/ imports automatically)
sam build --parallel

# Deploy to AWS (first time — creates samconfig.toml locally)
sam deploy --guided
```

When prompted by `--guided`:
| Prompt | Value |
|---|---|
| Stack Name | `algoxai-chat` |
| AWS Region | `us-east-1` |
| Parameter Stage | `prod` |
| Confirm changes | `Y` |
| Allow SAM IAM role creation | `Y` |
| Save to samconfig.toml | `Y` |

---

## Step 3 — Copy outputs to `.env`

After deploy completes, note the **Outputs** section:

```
WsApiUrl  = wss://xxxx.execute-api.us-east-1.amazonaws.com/prod
HttpApiUrl = https://xxxx.execute-api.us-east-1.amazonaws.com/prod
```

Open `.env` in the project root and uncomment + fill:

```env
VITE_AWS_API_WS_URL=wss://xxxx.execute-api.us-east-1.amazonaws.com/prod
VITE_AWS_API_HTTP_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/prod
```

Restart the dev server: `bun run dev`

---

## Step 4 — Verify

1. Open `http://localhost:8081/ai`
2. Send a message — the status bar should show the detected agent name
3. Tokens should stream in real-time
4. Refresh the page — chat history should reload from DynamoDB

---

## Re-deploy after code changes

```powershell
cd aws
sam build --parallel
sam deploy   # uses samconfig.toml (no --guided needed)
```

---

## Architecture

```
Browser (React)
  │
  │  WebSocket (wss://)
  ▼
API Gateway WebSocket
  │  $connect / $disconnect / $default
  ▼
OrchestratorFunction (Lambda)
  │  classifyAgent() → picks system prompt
  │  InvokeModelWithResponseStreamCommand
  ▼
AWS Bedrock (Claude 3.5 Sonnet)
  │  streaming chunks
  ▼
PostToConnectionCommand   →  Browser: {type:'token', content:'...'}
DynamoDB UpdateItem       →  Persists conversation
```

---

## Costs (estimated for usage)

| Service | Cost |
|---|---|
| Bedrock Claude 3.5 Sonnet | ~$3/1M input tokens, $15/1M output tokens |
| Lambda | Free tier: 1M req/month |
| DynamoDB | Free tier: 25 GB / 25 WCU / 25 RCU |
| API Gateway WebSocket | $1.14/million messages |
