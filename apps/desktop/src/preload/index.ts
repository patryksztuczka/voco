import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Type for serialized transcription record
export interface TranscriptionRecord {
  id: string
  text: string
  timestamp: string
  duration: number | null
}

// Type for preset record
export interface PresetRecord {
  id: string
  name: string
  prompt: string
  isBuiltin: boolean
}

// Database API for renderer
const api = {
  db: {
    getTranscriptions: (): Promise<TranscriptionRecord[]> =>
      ipcRenderer.invoke('db:getTranscriptions'),

    createTranscription: (text: string, duration?: number): Promise<TranscriptionRecord> =>
      ipcRenderer.invoke('db:createTranscription', text, duration),

    deleteTranscription: (id: string): Promise<void> =>
      ipcRenderer.invoke('db:deleteTranscription', id),

    getPresets: (): Promise<PresetRecord[]> => ipcRenderer.invoke('db:getPresets'),

    createPreset: (data: { name: string; prompt: string }): Promise<PresetRecord> =>
      ipcRenderer.invoke('db:createPreset', data),

    updatePreset: (id: string, data: { name: string; prompt: string }): Promise<PresetRecord> =>
      ipcRenderer.invoke('db:updatePreset', id, data),

    deletePreset: (id: string): Promise<void> => ipcRenderer.invoke('db:deletePreset', id)
  }
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
