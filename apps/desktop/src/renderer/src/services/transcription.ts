const BACKEND_URL = 'http://localhost:8787'

export interface TranscriptionResult {
  text: string
  duration?: number
}

export interface TranscriptionError {
  error: string
}

export const transcribeAudio = async (audioData: Uint8Array): Promise<TranscriptionResult> => {
  const response = await fetch(`${BACKEND_URL}/transcribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      audio: Array.from(audioData)
    })
  })

  if (!response.ok) {
    const errorData = (await response.json()) as TranscriptionError
    throw new Error(errorData.error || 'Transcription failed')
  }

  return response.json() as Promise<TranscriptionResult>
}
