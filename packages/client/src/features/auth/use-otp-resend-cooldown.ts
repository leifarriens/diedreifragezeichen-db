import { useEffect, useState } from "react";

const OTP_RESEND_COOLDOWN_SECONDS = 60;

export function useOtpResendCooldown(sentAt: number) {
  const [now, setNow] = useState(Date.now);
  const remainingSeconds = Math.max(
    0,
    Math.min(
      OTP_RESEND_COOLDOWN_SECONDS,
      Math.ceil((sentAt + OTP_RESEND_COOLDOWN_SECONDS * 1000 - now) / 1000),
    ),
  );
  const isCoolingDown = remainingSeconds > 0;

  useEffect(() => {
    if (!isCoolingDown) return;

    // Use elapsed time rather than ticks so background throttling does not
    // extend the cooldown.
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sentAt, isCoolingDown]);

  return remainingSeconds;
}
