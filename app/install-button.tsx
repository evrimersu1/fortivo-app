// app/install-button.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

export default function InstallButton() {
  // Android/Desktop: the deferred install prompt event
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [eligible, setEligible] = useState(false); // whether we should render a CTA at all

  const isStandalone = useMemo(() => {
    // Works on iOS and most browsers
    return (
      typeof window !== "undefined" &&
      (window.matchMedia?.("(display-mode: standalone)").matches ||
        // iOS fallback
        (window as any).navigator?.standalone === true)
    );
  }, []);

  const isIOS = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    if (isStandalone) {
      setEligible(false);
      return;
    }

    if (isIOS) {
      // iOS never fires beforeinstallprompt; show our own CTA
      setEligible(true);
      return;
    }

    // Android/Desktop: wait for beforeinstallprompt
    const onBIP = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setEligible(true);
    };

    window.addEventListener("beforeinstallprompt", onBIP as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", onBIP as EventListener);
  }, [isIOS, isStandalone]);

  const handleClick = async () => {
    if (isIOS) {
      // Open instructions for iOS
      setShowIOSHelp(true);
      return;
    }
    if (!deferredPrompt) return;
    // Android/Desktop install
    await deferredPrompt.prompt();
    // const result = await deferredPrompt.userChoice; // optional
    setDeferredPrompt(null);
    setEligible(false);
  };

  if (!eligible) return null;

  return (
    <>
      <button
        onClick={handleClick}
        className="rounded-full px-4 py-2 bg-black text-white hover:opacity-90"
        aria-haspopup={isIOS ? "dialog" : undefined}
        aria-controls={isIOS ? "ios-install-dialog" : undefined}
      >
        Install Fortivo
      </button>

      {/* Simple inline iOS instructions */}
      {isIOS && showIOSHelp && (
        <div
          id="ios-install-dialog"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
          onClick={() => setShowIOSHelp(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Add Fortivo to Home Screen</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm text-neutral-700">
              <li>Tap the <span className="font-medium">Share</span> icon in Safari.</li>
              <li>Scroll and choose <span className="font-medium">Add to Home Screen</span>.</li>
              <li>Tap <span className="font-medium">Add</span>.</li>
            </ol>
            <p className="text-xs text-neutral-500 mt-3">
              Tip: This makes Fortivo open full‑screen like an app.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowIOSHelp(false)}
                className="px-3 py-1.5 rounded-md border border-black/10"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}