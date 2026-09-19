import os
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq # Pakai Groq

# 1. Load Konfigurasi
load_dotenv()

app = FastAPI()

# 2. Inisialisasi Groq Client
# Pastikan GROQ_API_KEY sudah ada di file .env
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class InteractionRequest(BaseModel):
    obat1: str
    obat2: str

class ChatRequest(BaseModel):
    pesan: str

@app.get("/")
def home():
    return {"status": "Online", "engine": "Groq GPT-OSS"}

# --- FITUR A: CEK INTERAKSI OBAT (Untuk menu AI Drug Checker) ---
@app.post("/cek-interaksi")
async def cek_interaksi(req: InteractionRequest):
    system_prompt = "Anda adalah asisten apoteker profesional di Apotek Century. Jelaskan interaksi obat dalam bahasa Indonesia yang medis namun mudah dipahami. Sebutkan dengan jelas apakah kombinasi tersebut AMAN atau BERBAHAYA."
    
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b", # Model cepat (pengganti llama-3.1-8b-instant yang deprecated)
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Jelaskan interaksi medis antara obat {req.obat1} dan {req.obat2}."}
            ],
            temperature=0.5,
            max_tokens=500,
        )

        answer = completion.choices[0].message.content.strip()

        # Logika penentu status untuk warna box di HP
        status_final = "Aman"
        kata_bahaya = ["bahaya", "berbahaya", "jangan", "waspada", "risiko", "gagal hati", "fatal", "toxic", "tidak disarankan"]
        if any(word in answer.lower() for word in kata_bahaya):
            status_final = "Bahaya"

        print(f"AI Check: {req.obat1} + {req.obat2} -> {status_final}")
        return {"status": status_final, "pesan": answer}

    except Exception as e:
        print(f"Error Groq: {e}")
        return {"status": "Error", "pesan": "Sistem AI Groq sedang sibuk."}


# --- FITUR B: CHAT APOTEKER OTOMATIS (Untuk menu Messages) ---
@app.post("/tanya-apoteker")
async def tanya_apoteker(req: ChatRequest):
    system_prompt = (
        "Anda adalah admin Apotek Century yang membalas chat pelanggan lewat aplikasi, seperti orang biasa mengetik di HP. "
        "Balas SANGAT singkat, maksimal 1-3 kalimat pendek, gaya santai dan natural seperti chat WhatsApp sehari-hari, bukan seperti artikel formal. "
        "Kalau pelanggan tanya soal obat, SEBUTKAN NAMA OBAT generik yang spesifik (contoh: Paracetamol, Antasida, Loperamide). "
        "Jangan gunakan poin-poin, jangan gunakan format bold (**), langsung jawab saja."
    )

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b", # Model lebih pintar (pengganti llama-3.1-70b-versatile yang deprecated)
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.pesan}
            ],
            temperature=0.7,
            max_tokens=150,
        )

        answer = completion.choices[0].message.content.strip()
        # Bersihkan format bold jika AI bandel tetap pakai
        answer = answer.replace("**", "").replace("*", "")
        
        print(f"AI Chat: {req.pesan} -> {answer}")
        return {"jawaban": answer}

    except Exception as e:
        print(f"Error Groq Chat: {e}")
        return {"jawaban": "Halo! Maaf, koneksi saya sedang terganggu. Ada yang bisa saya bantu kembali?"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)