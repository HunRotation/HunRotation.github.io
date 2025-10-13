import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from fastapi.responses import StreamingResponse

# Load environment variables from .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI()

# Configure CORS
origins = [
    "https://hunrotation.github.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MusicRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the music generation API"}

@app.get("/api/generate-music")
def read_generate_music():
    return {"message": "This endpoint expects a POST request with a JSON body containing a 'text' field."}


@app.post("/api/generate-music")
def generate_music_api(request_body: MusicRequest):
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found on server.")

    try:
        client = ElevenLabs(api_key=api_key)
        audio_stream = client.music.compose(
            prompt=request_body.text,
            music_length_ms=30000,  # 30 seconds
        )
        return StreamingResponse(audio_stream, media_type="audio/mpeg")

    except Exception as e:
        print(f"Error calling ElevenLabs API: {e}")
        raise HTTPException(status_code=500, detail=f"Error from music generation API: {str(e)}")