import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui'
import { GeneralTab } from './general-tab'
import { ApiKeysTab } from './api-keys-tab'
import { AboutTab } from './about-tab'

export const SettingsWindow = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header with drag region */}
      <header className="shrink-0 px-4 pt-3 pb-2 border-b border-border app-drag-region">
        <h1 className="text-base font-semibold text-text-primary text-center">Settings</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="pt-2">
            <GeneralTab />
          </TabsContent>

          <TabsContent value="api-keys" className="pt-2">
            <ApiKeysTab />
          </TabsContent>

          <TabsContent value="about" className="pt-2">
            <AboutTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
