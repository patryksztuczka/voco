import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Database API for renderer
const api = {
  db: {
    getTranscriptions: (): Promise<TranscriptionRecord[]> =>
      ipcRenderer.invoke('db:getTranscriptions'),

    createTranscription: (text: string, duration?: number): Promise<TranscriptionRecord> =>
      ipcRenderer.invoke('db:createTranscription', text, duration),

    deleteTranscription: (id: string): Promise<void> =>
      ipcRenderer.invoke('db:deleteTranscription', id)
  }
}

// Type for serialized transcription record
export interface TranscriptionRecord {
  id: string
  text: string
  timestamp: string
  duration: number | null
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
