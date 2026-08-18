import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Download, Check, X } from 'lucide-react';

export default function PwaManager() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('pwa_install_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setTimeout(() => setInstalled(false), 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('pwa_install_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <aside aria-label="حالة التطبيق والتثبيت" className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto bg-primary-950/95 text-secondary-100 border border-secondary-400/30 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium"
            dir="rtl"
          >
            <div className="p-1.5 rounded-lg bg-secondary-400/20 text-secondary-200">
              <WifiOff className="size-4" />
            </div>
            <div>
              <p className="font-bold text-secondary-200">أنت تعمل دون اتصال</p>
              <p className="text-[11px] text-secondary-300/80">جميع الحسابات تعمل بكامل ميزاتها بدون إنترنت</p>
            </div>
          </motion.div>
        )}

        {deferredPrompt && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto bg-primary-950/95 text-secondary-100 border border-secondary-400/30 backdrop-blur-md p-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-xs"
            dir="rtl"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-secondary-400/20 text-secondary-200 shrink-0">
                <Download className="size-4" />
              </div>
              <div>
                <p className="font-bold text-secondary-200">تثبيت التطبيق</p>
                <p className="text-[11px] text-secondary-300/80">استخدم التطبيق كبرنامج مستقل دون اتصال</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3 py-1.5 rounded-lg bg-secondary-200 text-primary-950 font-bold text-xs hover:bg-secondary-100 transition-colors shadow cursor-pointer"
              >
                تثبيت
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-secondary-300/70 hover:text-secondary-100 hover:bg-secondary-400/10 transition-colors cursor-pointer"
                title="إغلاق"
                aria-label="إغلاق نافذة التثبيت"
              >
                <X className="size-4" />
              </button>
            </div>
          </motion.div>
        )}

        {installed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto bg-emerald-900/95 text-emerald-100 border border-emerald-500/30 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs"
            dir="rtl"
          >
            <Check className="size-4 text-emerald-300" />
            <span>تم تثبيت التطبيق بنجاح! يمكنك استخدامه دون إنترنت.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
