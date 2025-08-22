// app/install-button.tsx
'use client'
import { useEffect, useState } from 'react'

export default function InstallButton() {
  const [deferred, setDeferred] = useState<any>(null)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferred(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferred) return null

  return (
    <button
      onClick={async () => {
        deferred.prompt()
        const choice = await deferred.userChoice
        setDeferred(null)
        console.log('A2HS result:', choice.outcome)
      }}
      style={{ padding: 10, borderRadius: 8, marginTop: 12 }}
    >
      Install Fortivo
    </button>
  )
}