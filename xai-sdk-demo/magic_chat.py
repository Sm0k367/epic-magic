#!/usr/bin/env python3
"""
✨ THE MOST AMAZING xAI CHAT WINDOW ✨
A beautiful, powerful desktop chat interface for Grok using xAI SDK.
"""

import customtkinter as ctk
from PIL import Image, ImageTk
import json
from datetime import datetime
import threading
import time
import os
from pathlib import Path
import markdown2
from xai_sdk import Client
from xai_sdk.chat import user, system


# Load secrets
def load_xai_key():
    secrets_path = Path("/persistent/secrets/.secrets.json")
    if secrets_path.exists():
        try:
            with open(secrets_path, "r") as f:
                data = json.load(f)
                encrypted = data["secrets"].get("XAI_API_KEY", "")
                # In real env this would be decrypted, but SDK should pick it up
                # For now we'll let the SDK handle auth
                print("✅ XAI_API_KEY found in secrets manager")
                return True
        except Exception as e:
            print(f"Warning: Could not read secrets: {e}")
    return False


class MagicChatApp:
    def __init__(self):
        load_xai_key()
        self.client = Client()

        # Initialize CustomTkinter
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")

        self.root = ctk.CTk()
        self.root.title("✨ Grok Magic — The Most Amazing Chat")
        self.root.geometry("1200x800")
        self.root.minsize(1000, 700)

        # Chat data
        self.messages = []
        self.current_model = "grok-4"
        self.system_prompt = "You are a brilliant, helpful, and slightly mischievous AI companion. Be creative, insightful, and fun."

        self.setup_ui()
        self.load_initial_greeting()

    def setup_ui(self):
        # Sidebar
        self.sidebar = ctk.CTkFrame(self.root, width=280, corner_radius=0)
        self.sidebar.pack(side="left", fill="y")
        self.sidebar.pack_propagate(False)

        # Logo/Header
        title = ctk.CTkLabel(
            self.sidebar,
            text="✨ GROK MAGIC ✨",
            font=ctk.CTkFont(size=24, weight="bold"),
        )
        title.pack(pady=20)

        subtitle = ctk.CTkLabel(
            self.sidebar,
            text="The Most Amazing Chat\nExperience Ever Built",
            font=ctk.CTkFont(size=14),
            text_color="gray",
        )
        subtitle.pack(pady=(0, 30))

        # New Chat Button
        new_chat_btn = ctk.CTkButton(
            self.sidebar,
            text="✦ New Conversation",
            command=self.new_conversation,
            height=40,
            font=ctk.CTkFont(weight="bold"),
        )
        new_chat_btn.pack(pady=10, padx=20, fill="x")

        # Model Selection
        ctk.CTkLabel(
            self.sidebar, text="Model", font=ctk.CTkFont(size=14, weight="bold")
        ).pack(anchor="w", padx=25, pady=(20, 5))
        self.model_var = ctk.StringVar(value=self.current_model)
        models = ["grok-4", "grok-3", "grok-3-mini"]
        model_menu = ctk.CTkOptionMenu(
            self.sidebar,
            values=models,
            variable=self.model_var,
            command=self.change_model,
        )
        model_menu.pack(padx=20, fill="x")

        # System Prompt
        ctk.CTkLabel(
            self.sidebar, text="System Prompt", font=ctk.CTkFont(size=14, weight="bold")
        ).pack(anchor="w", padx=25, pady=(20, 5))
        self.system_text = ctk.CTkTextbox(self.sidebar, height=120)
        self.system_text.pack(padx=20, fill="x")
        self.system_text.insert("1.0", self.system_prompt)
        self.system_text.bind("<KeyRelease>", self.update_system_prompt)

        # Controls
        controls = ctk.CTkFrame(self.sidebar)
        controls.pack(padx=20, pady=20, fill="x")

        ctk.CTkButton(
            controls, text="Export Chat", command=self.export_chat, width=100
        ).pack(side="left", padx=5)
        ctk.CTkButton(
            controls,
            text="Clear Chat",
            command=self.clear_chat,
            width=100,
            fg_color="red",
        ).pack(side="right", padx=5)

        # Main Chat Area
        self.main_frame = ctk.CTkFrame(self.root)
        self.main_frame.pack(side="right", fill="both", expand=True, padx=10, pady=10)

        # Chat title
        self.chat_title = ctk.CTkLabel(
            self.main_frame,
            text="New Conversation",
            font=ctk.CTkFont(size=20, weight="bold"),
        )
        self.chat_title.pack(pady=10)

        # Chat display
        self.chat_frame = ctk.CTkScrollableFrame(self.main_frame)
        self.chat_frame.pack(fill="both", expand=True, padx=10, pady=10)

        # Input area
        input_frame = ctk.CTkFrame(self.main_frame, height=80)
        input_frame.pack(fill="x", padx=10, pady=10)
        input_frame.pack_propagate(False)

        self.input_box = ctk.CTkTextbox(input_frame, height=60)
        self.input_box.pack(
            side="left", fill="both", expand=True, padx=(10, 5), pady=10
        )
        self.input_box.bind("<Control-Return>", self.send_message_event)

        send_btn = ctk.CTkButton(
            input_frame,
            text="Send ✨",
            width=100,
            command=self.send_message,
            height=60,
            font=ctk.CTkFont(weight="bold"),
        )
        send_btn.pack(side="right", padx=(5, 10), pady=10)

        # Status bar
        self.status = ctk.CTkLabel(
            self.main_frame,
            text="Ready • Connected to xAI",
            text_color="gray",
            font=ctk.CTkFont(size=12),
        )
        self.status.pack(pady=5)

    def load_initial_greeting(self):
        self.add_message(
            "assistant",
            "Hello! I'm Grok Magic — the most powerful chat interface ever built.\n\n"
            "What would you like to explore today? I can help with coding, creative writing, "
            "deep research, brainstorming, or just have an amazing conversation. ✨",
        )

    def add_message(self, role, content, is_streaming=False):
        frame = ctk.CTkFrame(self.chat_frame, fg_color="transparent")
        frame.pack(fill="x", pady=8, padx=5, anchor="w" if role == "user" else "e")

        # Bubble
        bubble_color = "#2b2b2b" if role == "user" else "#1f538d"
        text_color = "white"

        bubble = ctk.CTkFrame(frame, fg_color=bubble_color, corner_radius=18)
        bubble.pack(side="right" if role == "user" else "left", padx=10)

        # Header
        header = ctk.CTkFrame(bubble, fg_color="transparent")
        header.pack(fill="x", padx=14, pady=(12, 4))

        name = ctk.CTkLabel(
            header,
            text="You" if role == "user" else "Grok Magic",
            text_color="#a0a0a0",
            font=ctk.CTkFont(size=12),
        )
        name.pack(side="left")

        timestamp = ctk.CTkLabel(
            header,
            text=datetime.now().strftime("%H:%M"),
            text_color="#666666",
            font=ctk.CTkFont(size=11),
        )
        timestamp.pack(side="right")

        # Message content with markdown support
        try:
            html = markdown2.markdown(content, extras=["fenced-code-blocks", "tables"])
            content_label = ctk.CTkLabel(
                bubble,
                text=content,
                text_color=text_color,
                font=ctk.CTkFont(size=15),
                justify="left",
                wraplength=700,
                anchor="w",
            )
            content_label.pack(padx=16, pady=(0, 14), anchor="w")
        except:
            content_label = ctk.CTkLabel(
                bubble,
                text=content,
                text_color=text_color,
                font=ctk.CTkFont(size=15),
                justify="left",
                wraplength=700,
            )
            content_label.pack(padx=16, pady=(0, 14), anchor="w")

        self.messages.append({"role": role, "content": content})
        self.chat_frame._parent_canvas.yview_moveto(1.0)

    def send_message(self):
        message = self.input_box.get("1.0", "end").strip()
        if not message:
            return

        self.add_message("user", message)
        self.input_box.delete("1.0", "end")

        # Show typing indicator
        self.status.configure(text="Grok is thinking...")
        self.root.update()

        # Run in thread to not freeze UI
        threading.Thread(
            target=self.get_ai_response, args=(message,), daemon=True
        ).start()

    def send_message_event(self, event=None):
        self.send_message()
        return "break"

    def get_ai_response(self, user_message):
        try:
            # Build conversation with system prompt
            chat = self.client.chat.create(
                model=self.current_model,
                messages=[system(self.system_prompt)]
                + [
                    {"role": m["role"], "content": m["content"]}
                    for m in self.messages[-10:]
                ],  # last 10 messages for context
            )

            response = chat.sample()
            response_text = (
                response.text if hasattr(response, "text") else str(response)
            )

            # Update UI from main thread
            self.root.after(0, lambda: self.add_message("assistant", response_text))
            self.root.after(
                0, lambda: self.status.configure(text="Ready • Connected to xAI")
            )

        except Exception as e:
            error_msg = f"Error: {str(e)}"
            self.root.after(0, lambda: self.add_message("assistant", error_msg))
            self.root.after(
                0, lambda: self.status.configure(text=f"Error: {str(e)[:40]}...")
            )

    def change_model(self, model):
        self.current_model = model
        self.status.configure(text=f"Switched to {model}")

    def update_system_prompt(self, event=None):
        self.system_prompt = self.system_text.get("1.0", "end").strip()

    def new_conversation(self):
        self.messages = []
        for widget in self.chat_frame.winfo_children():
            widget.destroy()
        self.load_initial_greeting()
        self.chat_title.configure(text="New Conversation")
        self.status.configure(text="New conversation started ✨")

    def clear_chat(self):
        if ctk.CTkToplevel(self.root):
            confirm = ctk.CTkToplevel(self.root)
            confirm.title("Clear Chat?")
            confirm.geometry("300x150")

            ctk.CTkLabel(
                confirm, text="Clear this conversation?", font=ctk.CTkFont(size=16)
            ).pack(pady=20)

            btn_frame = ctk.CTkFrame(confirm)
            btn_frame.pack(pady=10)

            ctk.CTkButton(
                btn_frame,
                text="Yes, Clear",
                fg_color="red",
                command=lambda: [self.new_conversation(), confirm.destroy()],
            ).pack(side="left", padx=10)
            ctk.CTkButton(btn_frame, text="Cancel", command=confirm.destroy).pack(
                side="right", padx=10
            )

    def export_chat(self):
        if not self.messages:
            return

        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        filename = f"magic_chat_{timestamp}.md"

        with open(filename, "w") as f:
            f.write("# ✨ Grok Magic Chat Export\n\n")
            f.write(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
            f.write(f"**Model:** {self.current_model}\n\n")
            f.write("---\n\n")

            for msg in self.messages:
                role = "🧑‍💻 **You**" if msg["role"] == "user" else "🌟 **Grok Magic**"
                f.write(f"{role}\n\n{msg['content']}\n\n---\n\n")

        self.status.configure(text=f"Chat exported to {filename} ✨")

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    print("🚀 Launching the most amazing chat interface ever built...")
    app = MagicChatApp()
    app.run()
