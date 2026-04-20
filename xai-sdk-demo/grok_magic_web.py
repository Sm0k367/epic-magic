import gradio as gr
from xai_sdk import Client
from xai_sdk.chat import user, system, assistant
import os
from datetime import datetime

print("🚀 Starting Grok Magic Web UI v2...")

# Ensure API key is available
if not os.getenv("XAI_API_KEY"):
    print("Warning: XAI_API_KEY not found in environment")

client = Client()

SYSTEM_PROMPT = """You are Grok Magic — the most powerful, creative, and fun AI companion ever created. 
Be insightful, humorous, and maximally helpful. You can discuss anything."""


def chat(message, history):
    try:
        messages = [system(SYSTEM_PROMPT)]
        for human, ai in history or []:
            messages.append(user(human))
            if ai:
                messages.append(assistant(ai))
        messages.append(user(message))

        chat_obj = client.chat.create(model="grok-4", messages=messages)
        response = chat_obj.sample()
        return getattr(response, "text", str(response))
    except Exception as e:
        return f"**Error connecting to Grok:** {str(e)}\n\nThe API key may need refreshing or the service may be temporarily unavailable."


with gr.Blocks(
    title="Grok Magic",
    theme=gr.themes.Soft(),
    css="""
    .container {max-width: 1200px; margin: auto;}
    footer {visibility: hidden}
""",
) as demo:
    gr.Markdown("# 🌟 **GROK MAGIC** 🌟")
    gr.Markdown(
        "**Real Grok-4 • Voice Input • Image Generation (v2 coming)**\n\nBuilt for you with love using your real xAI API key from the Secrets Manager."
    )

    chatbot = gr.Chatbot(height=550, show_label=False, avatar_images=("🧑", "🌟"))

    with gr.Row():
        with gr.Column(scale=4):
            msg = gr.Textbox(
                placeholder="What magical thing shall we discuss or create today?",
                label="Your Message",
                lines=3,
            )
        with gr.Column(scale=1):
            voice = gr.Audio(
                sources=["microphone"],
                type="filepath",
                label="🎤 Voice Input",
                waveform_options=gr.WaveformOptions(waveform_color="#a78bfa"),
            )

    with gr.Row():
        submit_btn = gr.Button("Send Message ✨", variant="primary", size="large")
        clear_btn = gr.Button("New Conversation", variant="secondary")
        gr.Markdown("**Tip:** Try 'draw a dragon' or 'tell me a story'")

    def respond(message, history, audio):
        if not message and not audio:
            return history
        if audio:
            message = "[Voice message received - transcription would appear here in full version]"
        response = chat(message, history)
        return history + [[message, response]]

    submit_btn.click(respond, inputs=[msg, chatbot, voice], outputs=chatbot).then(
        lambda: "", None, msg
    )

    msg.submit(respond, inputs=[msg, chatbot, voice], outputs=chatbot).then(
        lambda: "", None, msg
    )

    clear_btn.click(lambda: [], None, chatbot)

    gr.Markdown(
        "---\n**Status**: Running • Using real xAI API key from Secrets Manager\nVoice transcription and Flux image generation will be fully enabled in the next update."
    )

demo.launch(
    server_name="0.0.0.0",
    server_port=7860,
    share=False,
    show_api=False,
    show_error=True,
    quiet=True,
)
