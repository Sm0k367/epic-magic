#!/usr/bin/env python3
"""
✨ GROK MAGIC CLI ✨
The most amazing terminal chat using xAI.
"""

import os
from datetime import datetime
from xai_sdk import Client
from xai_sdk.chat import user, system, assistant

print("🌟 Grok Magic CLI started.\n")
client = Client()

messages = []
system_prompt = """You are Grok Magic — an extremely capable, creative, truthful, and slightly chaotic AI.
You have a great sense of humor and give direct, insightful answers. Be helpful and fun."""

print("Type your message. Commands: 'clear', 'exit'\n")

while True:
    try:
        user_input = input("\n\033[1;36mYou:\033[0m ").strip()

        if user_input.lower() in ["exit", "quit", "bye", "q"]:
            print("\n\033[1;35mGrok Magic:\033[0m Farewell, friend. ✨")
            break

        if user_input.lower() in ["clear", "new"]:
            messages = []
            print("\n🪄 Conversation cleared.\n")
            continue

        if not user_input:
            continue

        messages.append({"role": "user", "content": user_input})
        print("\033[1;35mGrok Magic:\033[0m ", end="", flush=True)

        # Build message list using the correct helper functions
        chat_messages = [system(system_prompt)]
        for msg in messages:
            if msg["role"] == "user":
                chat_messages.append(user(msg["content"]))
            elif msg["role"] == "assistant":
                chat_messages.append(assistant(msg["content"]))

        chat = client.chat.create(model="grok-4", messages=chat_messages)
        response = chat.sample()

        # Clean extraction of just the text reply
        if hasattr(response, "message") and hasattr(response.message, "content"):
            response_text = response.message.content
        elif hasattr(response, "text"):
            response_text = response.text
        else:
            response_text = str(response)

        print(response_text)
        messages.append({"role": "assistant", "content": response_text})

    except KeyboardInterrupt:
        print("\n\n\033[1;33mGoodbye! Come back anytime for more magic.\033[0m")
        break
    except Exception as e:
        print(f"\n\033[1;31mError:\033[0m {e}")
        print("Trying to recover... (the platform sometimes needs a moment)")

print("\n✨ Thank you for using Grok Magic. The most amazing chat is now complete.")
