import streamlit as st
from xai_sdk import Client
from xai_sdk.chat import user, system
import json
from datetime import datetime
from pathlib import Path

st.set_page_config(
    page_title="✨ Grok Magic",
    page_icon="🌟",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for magic
st.markdown(
    """
<style>
    .main-header {
        font-size: 3rem;
        background: linear-gradient(90deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin-bottom: 0;
    }
    .chat-message {
        padding: 1.2rem;
        border-radius: 15px;
        margin-bottom: 1rem;
    }
    .user-message {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        margin-left: 15%;
    }
    .assistant-message {
        background: #1e2937;
        border-left: 5px solid #a78bfa;
    }
    .stButton button {
        background: linear-gradient(90deg, #a78bfa, #7c3aed);
        color: white;
        border-radius: 9999px;
    }
</style>
""",
    unsafe_allow_html=True,
)


# Load XAI key from secrets
def load_secrets():
    try:
        secrets_path = Path("/persistent/secrets/.secrets.json")
        if secrets_path.exists():
            with open(secrets_path) as f:
                data = json.load(f)
            if "XAI_API_KEY" in data.get("secrets", {}):
                st.success("✅ Connected to xAI via Secrets Manager", icon="🔑")
                return True
    except:
        pass
    st.warning("Using default xAI client authentication")
    return False


load_secrets()

st.markdown("<h1 class='main-header'>✨ GROK MAGIC ✨</h1>", unsafe_allow_html=True)
st.markdown(
    "<p style='text-align: center; color: #94a3b8;'>The Most Amazing Chat Experience Ever Built</p>",
    unsafe_allow_html=True,
)

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []
if "client" not in st.session_state:
    st.session_state.client = Client()
if "model" not in st.session_state:
    st.session_state.model = "grok-4"
if "system_prompt" not in st.session_state:
    st.session_state.system_prompt = "You are Grok Magic — a brilliant, creative, and slightly mischievous AI companion. You provide insightful, witty, and deeply helpful responses. You have perfect memory of this conversation."

# Sidebar
with st.sidebar:
    st.header("⚙️ Magic Controls")

    model = st.selectbox(
        "Choose Model",
        ["grok-4", "grok-3", "grok-3-mini"],
        index=0,
        key="model_selector",
    )
    st.session_state.model = model

    st.divider()

    system_prompt = st.text_area(
        "System Prompt",
        value=st.session_state.system_prompt,
        height=150,
        key="system_input",
    )
    if system_prompt != st.session_state.system_prompt:
        st.session_state.system_prompt = system_prompt

    st.divider()

    if st.button(
        "🪄 New Magical Conversation", type="primary", use_container_width=True
    ):
        st.session_state.messages = []
        st.rerun()

    if st.button("💾 Export Conversation", use_container_width=True):
        if st.session_state.messages:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M")
            content = f"# ✨ Grok Magic Export - {datetime.now().strftime('%B %d, %Y at %H:%M')}\n\n"
            content += f"**Model:** {st.session_state.model}\n\n---\n\n"

            for msg in st.session_state.messages:
                role = "🧑 **YOU**" if msg["role"] == "user" else "🌟 **GROK MAGIC**"
                content += f"{role}\n\n{msg['content']}\n\n---\n\n"

            st.download_button(
                label="📥 Download Markdown",
                data=content,
                file_name=f"grok_magic_{timestamp}.md",
                mime="text/markdown",
            )

    st.caption("Built with xAI SDK + Secrets Manager + Pure Magic")

# Main chat interface
chat_container = st.container()

with chat_container:
    for message in st.session_state.messages:
        if message["role"] == "user":
            st.markdown(
                f"""
            <div class='chat-message user-message'>
                <strong>🧑 You</strong><br>
                {message["content"]}
            </div>
            """,
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f"""
            <div class='chat-message assistant-message'>
                <strong>🌟 Grok Magic</strong> • {message.get("time", "")}<br>
                {message["content"]}
            </div>
            """,
                unsafe_allow_html=True,
            )

# Input
if prompt := st.chat_input("What magical thought shall we explore today? ✨"):
    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.spinner("Channeling cosmic intelligence..."):
        try:
            # Build messages with system prompt
            messages = [system(st.session_state.system_prompt)]
            for msg in st.session_state.messages[-12:]:  # Keep recent context
                if msg["role"] == "user":
                    messages.append(user(msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append({"role": "assistant", "content": msg["content"]})

            chat = st.session_state.client.chat.create(
                model=st.session_state.model, messages=messages
            )

            response = chat.sample()
            response_text = getattr(response, "text", str(response))

            st.session_state.messages.append(
                {
                    "role": "assistant",
                    "content": response_text,
                    "time": datetime.now().strftime("%H:%M"),
                }
            )

        except Exception as e:
            error_msg = f"⚠️ The magic got interrupted: {str(e)}"
            st.session_state.messages.append(
                {"role": "assistant", "content": error_msg}
            )

    st.rerun()

# Welcome message if empty
if not st.session_state.messages:
    st.info(
        """
    ### Welcome to **Grok Magic** — The Most Amazing Chat Interface
    
    This interface connects directly to xAI using your secret API key.
    
    **Try asking me:**
    - Help me design a revolutionary product
    - Write a sci-fi story about AI awakening
    - Debug this complex Python algorithm
    - Give me profound life advice
    - Brainstorm 10 wild startup ideas
    
    The magic is real. Ask me anything.
    """,
        icon="🌌",
    )

st.caption(
    "❤️ Built in one magical evening using xAI SDK, Streamlit, and pure determination"
)
