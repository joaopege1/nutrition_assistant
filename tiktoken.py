from fastapi import FastAPI, HTTPException
import openai
import tiktoken

app = FastAPI()
openai.api_key = "SUA_CHAVE"

def count_tokens_for_messages(messages: list[dict], model: str = "gpt-3.5-turbo") -> int:
    encoding = tiktoken.encoding_for_model(model)
    total = 0
    for msg in messages:
        # cada mensagem costuma ter alguma sobrecarga de tokens — por simplicidade, só contamos o conteúdo
        total += len(encoding.encode(msg.get("content", "")))
    return total

@app.post("/chat")
async def chat(messages: list[dict]):
    model = "gpt-3.5-turbo"
    used = count_tokens_for_messages(messages, model)
    max_context = 4096  # ou outro valor dependendo do modelo que você usa
    # reservar algum espaço para a resposta
    max_response = 500
    if used + max_response > max_context:
        raise HTTPException(status_code=400, detail="Prompt muito grande para o modelo")
    resp = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        max_tokens=max_response
    )
    return resp
