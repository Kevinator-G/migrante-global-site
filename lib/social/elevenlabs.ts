// ElevenLabs — converts text to Spanish MP3 audio
// Required env vars:
//   ELEVENLABS_API_KEY  — from elevenlabs.io
//   ELEVENLABS_VOICE_ID — voice ID to use (default: Spanish male)

const BASE = 'https://api.elevenlabs.io/v1'

// Default voice: "Antoni" — clear Spanish-accented male voice
// Replace ELEVENLABS_VOICE_ID in Vercel with your preferred voice ID
const DEFAULT_VOICE_ID = 'ErXwobaYiN019PkySvjV'

interface AudioResult {
  success: boolean
  audioBuffer?: Buffer
  error?: string
}

export async function textToSpeech(text: string): Promise<AudioResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) return { success: false, error: 'ELEVENLABS_API_KEY not set' }

  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID

  // Keep under 2500 chars for a ~60s clip
  const trimmed = text.slice(0, 2500)

  try {
    const res = await fetch(`${BASE}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: trimmed,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return { success: false, error: `ElevenLabs error: ${err}` }
    }

    const arrayBuffer = await res.arrayBuffer()
    return { success: true, audioBuffer: Buffer.from(arrayBuffer) }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
