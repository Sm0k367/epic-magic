from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from xai_sdk import Client
from xai_sdk.chat import user, system, assistant
import uvicorn

app = FastAPI(title="Grok Magic")

client = Client()

SYSTEM_PROMPT = "You are Grok Magic, a helpful, witty, and engaging AI companion."

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grok Magic</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: linear-gradient(to bottom, #0f172a, #1e2937); font-family: system-ui; }
        .message { max-width: 80%; padding: 14px 18px; border-radius: 20px; margin-bottom: 12px; }
        .user { background: #4f46e5; color: white; border-bottom-right-radius: 4px; margin-left: auto; }
        .ai { background: #334155; color: white; border-bottom-left-radius: 4px; }
        #chat { scrollbar-width: thin; scrollbar-color: #64748b #1e2937; }
    </style>
</head>
<body class="min-h-screen text-slate-200 p-6">
    <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
            <h1 class="text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">🌟 Grok Magic</h1>
            <p class="text-slate-400 mt-2">Real Grok-4 • Simple Web Chat</p>
        </div>
        
        <div id="chat" class="bg-slate-900 rounded-3xl p-6 h-[65vh] overflow-y-auto border border-slate-700 mb-6"></div>
        
        <div class="flex gap-3">
            <input id="input" 
                   class="flex-1 bg-slate-800 border border-slate-600 focus:border-violet-500 rounded-2xl px-6 py-4 text-lg outline-none"
                   placeholder="Ask anything..." 
                   onkeypress="if(event.key === 'Enter') send()">
            <button onclick="send()" 
                    class="bg-violet-600 hover:bg-violet-700 px-10 rounded-2xl font-semibold text-lg transition-colors">
                Send
            </button>
        </div>
        
        <div class="text-center text-xs text-slate-500 mt-6">
            Running on real xAI API key from Secrets Manager
        </div>
    </div>

    <script>
        let history = [];
        
        function addMessage(role, content) {
            const chat = document.getElementById('chat');
            const div = document.createElement('div');
            div.className = `message ${role === 'user' ? 'user' : 'ai'}`;
            div.innerHTML = content;
            chat.appendChild(div);
            chat.scrollTop = chat.scrollHeight;
        }
        
        async function send() {
            const input = document.getElementById('input');
            const text = input.value.trim();
            if (!text) return;
            
            addMessage('user', text);
            input.value = '';
            
            try {
                const res = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({message: text, history: history})
                });
                
                const data = await res.json();
                console.log("Server response:", data); // for debugging
                
                const reply = data.reply || data.message || "Sorry, I didn't get a response.";
                addMessage('ai', reply);
                history = data.history || history;
            } catch (err) {
                console.error("Fetch error:", err);
                addMessage('ai', "Sorry, there was a connection error. Please try again.");
            }
        }
        
        // Welcome
        window.onload = () => {
            addMessage('ai', "Hello! I'm Grok Magic. What would you like to talk about? ✨");
        };
    </script>
</body>
</html>"""


@app.get("/", response_class=HTMLResponse)
async def home():
    return HTML


@app.post("/chat")
async def chat_endpoint(payload: dict):
    try:
        messages = [system(SYSTEM_PROMPT)]
        for item in payload.get("history", []):
            messages.append(user(item.get("user", "")))
            messages.append(assistant(item.get("ai", "")))
        messages.append(user(payload["message"]))

        response = client.chat.create(model="grok-4", messages=messages).sample()
        reply = getattr(response, "text", str(response))

        payload["history"].append({"user": payload["message"], "ai": reply})
        return {"reply": reply, "history": payload["history"]}
    except Exception as e:
        return {"reply": f"Error: {str(e)}", "history": payload.get("history", [])}


if __name__ == "__main__":
    uvicorn.run("grok_web:app", host="0.0.0.0", port=7860, reload=False)
