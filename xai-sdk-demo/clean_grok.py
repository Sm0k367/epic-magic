#!/usr/bin/env python3
from xai_sdk import Client
from xai_sdk.chat import user, system, assistant

client = Client()
messages = []
system_prompt = "You are Grok Magic, a helpful and fun AI."

print("Grok Magic ready. Type 'exit' to quit.\n")

while True:
    try:
        user_input = input("You: ").strip()
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("Grok Magic: Goodbye! ✨")
            break
        if not user_input:
            continue

        messages.append({"role": "user", "content": user_input})

        chat_messages = [system(system_prompt)]
        for m in messages:
            if m["role"] == "user":
                chat_messages.append(user(m["content"]))
            else:
                chat_messages.append(assistant(m["content"]))

        response = client.chat.create(model="grok-4", messages=chat_messages).sample()

        if hasattr(response, "message") and hasattr(response.message, "content"):
            reply = response.message.content
        elif hasattr(response, "text"):
            reply = response.text
        else:
            reply = str(response)

        print("Grok:", reply)
        messages.append({"role": "assistant", "content": reply})

    except KeyboardInterrupt:
        print("\nGoodbye! ✨")
        break
    except Exception as e:
        print("Error:", e)
