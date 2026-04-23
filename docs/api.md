# API Documentation

## POST /api/chat

Chat endpoint powered by Grok 4 via xAI API.

### Request

```json
{
  "message": "string"
}
```

### Response

```json
{
  "reply": "string"
}
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `XAI_API_KEY` | xAI API key for Grok 4 | Yes |

### Example

```bash
curl -X POST https://epic-magic.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Who are you?"}'
```

### Error Handling

- If `XAI_API_KEY` is missing, returns a fallback message
- Network errors return a graceful fallback
- All errors return HTTP 200 with a `reply` field

### Model

The endpoint uses `grok-4` model with:
- `temperature: 0.85`
- `max_tokens: 300`
- Anti-hero system prompt: DJ Smoke Stream persona
