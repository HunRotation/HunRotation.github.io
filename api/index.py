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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MusicRequest(BaseModel):
    text: str


@app.post("/generate-music")
def generate_music(request_body: MusicRequest):
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found.")

    try:
        client = ElevenLabs(api_key=api_key)

        # Generate music using the SDK
        audio_stream = client.music.compose(
            prompt=request_body.text,
            force_instrumental=True,
            music_length_ms=30000,  # 60 seconds
        )

        # Stream the audio back to the client
        return StreamingResponse(audio_stream, media_type="audio/mpeg")

    except Exception as e:
        print(f"Error calling ElevenLabs API: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error from music generation API: {str(e)}"
        )


@app.post("/api/generate_music")
def generate_music_api(request_body: MusicRequest):
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found on server.")

    try:
        client = ElevenLabs(api_key=api_key)
        audio_stream = client.music.compose(
            prompt=request_body.text,
            music_length_ms=60000  # 60 seconds
        )
        return StreamingResponse(audio_stream, media_type="audio/mpeg")

    except Exception as e:
        print(f"Error calling ElevenLabs API: {e}")
        raise HTTPException(status_code=500, detail=f"Error from music generation API: {str(e)}")
