import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { prisma } from './lib/prisma'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Database IPC handlers
  ipcMain.handle('db:getTranscriptions', async () => {
    const records = await prisma.transcription.findMany({
      orderBy: { timestamp: 'desc' }
    })
    return records.map((r) => ({
      id: r.id,
      text: r.text,
      timestamp: r.timestamp.toISOString(),
      duration: r.duration
    }))
  })

  ipcMain.handle('db:createTranscription', async (_event, text: string, duration?: number) => {
    const record = await prisma.transcription.create({
      data: { text, duration: duration ?? null }
    })
    return {
      id: record.id,
      text: record.text,
      timestamp: record.timestamp.toISOString(),
      duration: record.duration
    }
  })

  ipcMain.handle('db:deleteTranscription', async (_event, id: string) => {
    await prisma.transcription.delete({ where: { id } })
  })

  // Preset IPC handlers
  ipcMain.handle('db:getPresets', async () => {
    const records = await prisma.preset.findMany({
      orderBy: { createdAt: 'asc' }
    })
    return records.map((r) => ({
      id: r.id,
      name: r.name,
      prompt: r.prompt,
      isBuiltin: r.isBuiltin
    }))
  })

  ipcMain.handle(
    'db:createPreset',
    async (_event, data: { name: string; prompt: string }) => {
      const record = await prisma.preset.create({
        data: { name: data.name, prompt: data.prompt, isBuiltin: false }
      })
      return {
        id: record.id,
        name: record.name,
        prompt: record.prompt,
        isBuiltin: record.isBuiltin
      }
    }
  )

  ipcMain.handle(
    'db:updatePreset',
    async (_event, id: string, data: { name: string; prompt: string }) => {
      const record = await prisma.preset.update({
        where: { id },
        data: { name: data.name, prompt: data.prompt }
      })
      return {
        id: record.id,
        name: record.name,
        prompt: record.prompt,
        isBuiltin: record.isBuiltin
      }
    }
  )

  ipcMain.handle('db:deletePreset', async (_event, id: string) => {
    // Only allow deleting non-builtin presets
    const preset = await prisma.preset.findUnique({ where: { id } })
    if (preset && !preset.isBuiltin) {
      await prisma.preset.delete({ where: { id } })
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Clean up database connection on quit
app.on('will-quit', async () => {
  await prisma.$disconnect()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
