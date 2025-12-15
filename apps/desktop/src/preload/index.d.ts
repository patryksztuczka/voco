import { ElectronAPI } from '@electron-toolkit/preload'

export interface TranscriptionRecord {
  id: string
  text: string
  timestamp: string
  duration: number | null
}

export interface DatabaseAPI {
  getTranscriptions: () => Promise<TranscriptionRecord[]>
  createTranscription: (text: string, duration?: number) => Promise<TranscriptionRecord>
  deleteTranscription: (id: string) => Promise<void>
}

export interface API {
  db: DatabaseAPI
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
