#!/usr/bin/env python3
from xai_sdk import Client
from xai_sdk.chat import user, system, assistant

client = Client()
messages = []
system_prompt = "You are Grok Magic, a helpful, witty, and engaging AI."

print("Grok Magic is ready.")
print("Type your message below. Type 'exit' to quit.\n")

while True:
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

    # Extract the actual text reply from the response object
    reply = str(response)
    try:
        response_str = str(response)
        # Look for the content field in the protobuf output
        if 'content: "' in response_str:
            start = response_str.find('content: "') + 10
            end = response_str.find('"', start)
            if end > start:
                reply = response_str[start:end]
        elif hasattr(response, "text"):
            reply = response.text
        elif hasattr(response, "message") and hasattr(response.message, "content"):
            reply = response.message.content
    except:
        pass  # Fall back to full string if parsing fails

    print("Grok Magic:", reply)
    messages.append({"role": "assistant", "content": reply})
    print()
