// app/install-button.tsx
"use client";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onInstallClick = async () => {
    if (!deferredPrompt) return;
    setCanInstall(false);
    await deferredPrompt.prompt();
    // Optionally inspect the choice result:
    // const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (!canInstall) return null;

  return (
    <button
      onClick={onInstallClick}
      className="rounded-xl px-4 py-2 bg-black text-white hover:opacity-90"
    >
      Install Fortivo
    </button>
  );
}