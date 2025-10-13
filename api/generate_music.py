from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from elevenlabs.client import ElevenLabs
from fastapi.responses import StreamingResponse
import os

app = FastAPI()

class MusicRequest(BaseModel):
    text: str

@app.post("/api/generate_music")
def generate_music(request_body: MusicRequest):
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
