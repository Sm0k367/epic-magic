from xai_sdk import Client
from xai_sdk.chat import user

client = Client()

# Reuse the batch we created earlier
BATCH_ID = "batch_f769a855-01d4-4be8-a591-66a6e4cf97e0"

print("=== xAI Batch API - What You Can Do ===\n")

# Get current batch status
batch = client.batch.get(BATCH_ID)
print(f"📋 Batch: {batch.name} ({batch.batch_id})")
print(f"   State: {batch.state}")
print(
    f"   Created: {batch.create_time.ToDatetime() if hasattr(batch.create_time, 'ToDatetime') else batch.create_time}\n"
)

# Example: Create chat objects and add them to the batch
print("Adding chat completion requests to the batch...")

# Create multiple independent chat objects
chat1 = client.chat.create(
    model="grok-3",
    messages=[user("Explain quantum computing in simple terms.")],
    max_tokens=150,
)
chat1.batch_request_id = "quantum_explanation"  # Helps match results later

chat2 = client.chat.create(
    model="grok-3",
    messages=[user("Write a haiku about AI consciousness.")],
    max_tokens=80,
)
chat2.batch_request_id = "haiku_ai"

chat3 = client.chat.create(
    model="grok-3",
    messages=[user("What are the main benefits of using batch inference APIs?")],
    max_tokens=120,
)
chat3.batch_request_id = "batch_benefits"

# Add them to the batch
client.batch.add(BATCH_ID, [chat1, chat2, chat3])
print(f"✅ Successfully added 3 requests to batch '{BATCH_ID}'\n")

# Check what's in the batch
print("📊 Batch contents:")
try:
    requests = client.batch.list_batch_requests(BATCH_ID, limit=10)
    print(f"   Total requests submitted: {getattr(requests, 'total', 'Unknown')}")
except Exception as e:
    print(f"   Could not list requests: {e}")

print("\n" + "=" * 60)
print("🚀 **WHAT YOU CAN DO WITH xAI BATCHES:**")
print("=" * 60)
print("""
1. **High-volume LLM inference** (thousands of prompts at once)
2. **Cost optimization** — batch pricing is usually cheaper
3. **Bulk content generation** (product descriptions, summaries, translations)
4. **Large-scale data processing** (classification, extraction, labeling)
5. **Evaluation & benchmarking** — test many prompts against models
6. **Media generation at scale** (images, video via batch endpoints)
7. **Async processing** — fire and forget, retrieve results later

**Supported operations:**
• client.batch.create() — start new batch
• client.batch.add() — add chat/image/video requests
• client.batch.get() — check status
• client.batch.list() — see all your batches  
• client.batch.list_batch_results() — download all outputs
• client.batch.cancel() — stop a running batch

**Typical workflow:**
1. Create batch
2. Add many requests (chat, image, video, etc.)
3. Wait for processing (or poll status)
4. Retrieve all results in one call
""")

print("To retrieve results when ready, run:")
print("   results = client.batch.list_batch_results(BATCH_ID)")
print("   for result in results.results:")
print("       print(result.batch_request_id, '->', result.response)")
print(
    "\nWould you like me to create a complete working example that also retrieves results?"
)
