import { useState, useRef, useCallback } from 'react'

interface AudioRecorderState {
  isRecording: boolean
  audioData: Uint8Array | null
  error: string | null
}

interface UseAudioRecorderReturn {
  isRecording: boolean
  audioData: Uint8Array | null
  error: string | null
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Uint8Array | null>
  cancelRecording: () => void
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    audioData: null,
    error: null
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null, audioData: null }))

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      })

      streamRef.current = stream
      audioChunksRef.current = []

      // Use webm format which is well supported
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(100) // Collect data every 100ms

      setState((prev) => ({ ...prev, isRecording: true }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone'
      setState((prev) => ({ ...prev, error: errorMessage }))
      console.error('Error starting recording:', err)
    }
  }, [])

  const stopRecording = useCallback(async (): Promise<Uint8Array | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current

      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        setState((prev) => ({ ...prev, isRecording: false }))
        resolve(null)
        return
      }

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        streamRef.current?.getTracks().forEach((track) => {
          track.stop()
        })

        // Combine all chunks into a single blob
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus'
        })

        // Convert blob to Uint8Array
        const arrayBuffer = await audioBlob.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        setState((prev) => ({
          ...prev,
          isRecording: false,
          audioData: uint8Array
        }))

        resolve(uint8Array)
      }

      mediaRecorder.stop()
    })
  }, [])

  const cancelRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }

    streamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })

    audioChunksRef.current = []

    setState({
      isRecording: false,
      audioData: null,
      error: null
    })
  }, [])

  return {
    isRecording: state.isRecording,
    audioData: state.audioData,
    error: state.error,
    startRecording,
    stopRecording,
    cancelRecording
  }
}
