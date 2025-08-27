"use client";

import { useEffect, useMemo, useState } from "react";

function getIsStandalone() {
  if (typeof window === "undefined") return false;
  // Standard PWA check
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  // iOS legacy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).navigator?.standalone === true) return true;
  return false;
}

function getIsIOSWebKit() {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent || "";
  const platform = (navigator as unknown as { platform?: string }).platform || "";

  const isiPhoneLike = /iphone|ipod/i.test(ua);
  const isiPadLikeUA = /ipad/i.test(ua);
  const isiPadLikeDesktopUA =
    /macintosh/i.test(ua) && "maxTouchPoints" in navigator && (navigator as unknown as { maxTouchPoints: number }).maxTouchPoints > 1;

  const iOSPlatform = /iPad|iPhone|iPod/.test(platform);

  return isiPhoneLike || isiPadLikeUA || isiPadLikeDesktopUA || iOSPlatform;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [eligible, setEligible] = useState(false);

  const isStandalone = useMemo(getIsStandalone, []);
  const isIOS = useMemo(getIsIOSWebKit, []);

  useEffect(() => {
    // If already installed, do not show CTA
    if (isStandalone) {
      setEligible(false);
      return;
    }

    if (isIOS) {
      // iOS never fires beforeinstallprompt, so show our own CTA
      setEligible(true);
      return;
    }

    // Android/Desktop flow
    const onBIP = (e: Event) => {
      e.preventDefault?.();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setEligible(true);
    };

    window.addEventListener("beforeinstallprompt", onBIP as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", onBIP as EventListener);
  }, [isIOS, isStandalone]);

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSHelp(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    // const choice = await deferredPrompt.userChoice; // optional
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

      {/* iOS instruction sheet */}
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
              <li>Open in <span className="font-medium">Safari</span> (if you aren’t already).</li>
              <li>Tap the <span className="font-medium">Share</span> icon.</li>
              <li>Choose <span className="font-medium">Add to Home Screen</span>, then tap <span className="font-medium">Add</span>.</li>
            </ol>
            <p className="text-xs text-neutral-500 mt-3">
              Tip: Installed PWAs open full‑screen and behave like native apps.
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
