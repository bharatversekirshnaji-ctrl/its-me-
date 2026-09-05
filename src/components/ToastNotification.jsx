import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onDismiss }) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setIsLeaving(false);

    const autoTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onDismiss, 280);
    }, 3800);

    return () => clearTimeout(autoTimer);
  }, [toast]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(onDismiss, 280);
  };

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError   = toast.type === 'error';
  const isInfo    = toast.type === 'info';

  return (
    <div
      className={`fixed bottom-6 right-4 sm:right-6 z-[9999] max-w-sm w-full ${
        isLeaving ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      <div
        className={`flex items-start space-x-3 px-4 py-3.5 border shadow-2xl backdrop-blur-sm ${
          isError
            ? 'bg-[#2D0E0E] text-[#FFF9EF] border-red-500/60'
            : isInfo
            ? 'bg-[#16220E] text-[#F4E9D5] border-[#B28A4A]/40'
            : 'bg-[#1E2D12] text-[#F4E9D5] border-[#B28A4A]'
        }`}
      >
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          {isError ? (
            <AlertCircle className="w-4.5 h-4.5 text-red-400" />
          ) : isInfo ? (
            <Info className="w-4.5 h-4.5 text-[#B28A4A]" />
          ) : (
            <CheckCircle2 className="w-4.5 h-4.5 text-[#B28A4A]" />
          )}
        </div>

        {/* Message */}
        <p className="flex-1 text-xs sm:text-sm font-medium tracking-wide font-sans leading-snug">
          {toast.message}
        </p>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 text-[#D9C09A]/60 hover:text-white transition-colors mt-0.5"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Gold progress bar */}
      <div className="h-[2px] bg-[#B28A4A]/20 overflow-hidden">
        <div
          className="h-full bg-[#B28A4A]"
          style={{
            animation: 'toastProgress 3.8s linear forwards',
          }}
        />
      </div>
    </div>
  );
}
