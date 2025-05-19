// components/SettingsDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/@shadcn/ui/dialog"
import { Input } from "@/components/@shadcn/ui/input"
import { Button } from "@/components/@shadcn/ui/button"
import { useEffect, useState } from "react"
import axios from "@/lib/axios"
// Icons
import { Settings } from 'lucide-react';
import { Description } from "@radix-ui/react-dialog"


export const SettingsButton = () => {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<{ key: string; value: string }[]>([])

  useEffect(() => {
    if (open) {
      axios.get("/settings").then(res => {
        setSettings(res.data.settings || [])
      })
    }
  }, [open])

  const updateSettingValue = (key: string, newValue: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.key === key ? { ...setting, value: newValue } : setting
      )
    )
  }

  const saveSettings = async () => {
    try {
      await axios.post("/settings", { settings })
      setOpen(false)
    } catch (err) {
      console.error("Failed to save settings", err)
    }
  }

  return (
    <div className="flex justify-between">
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button className="font-medium cursor-pointer border-0 hover:bg-green-600 bg-gray-800"><Settings />Settings</Button>
      </DialogTrigger>
      <DialogContent className="p-4 bg-gray-800 opacity-100 text-gray-200">
        <Description className="text-gray-200 hidden">Customize your settings here.</Description>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {settings.map(({ key, value }) => (
            <div key={key} className="space-y-1">
              <label className="block text-sm font-medium text-gray-200">{key}</label>
              <Input
                value={value}
                onChange={(e) => updateSettingValue(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-end space-x-2">
          <Button className="bg-green-600 hover:bg-green-500 mb-1 cursor-pointer" onClick={saveSettings}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}
