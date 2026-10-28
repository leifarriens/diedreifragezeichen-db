import { useOtpResendCooldown } from "@ddfdb/client";

interface ResendOtpButtonProps {
  disabled: boolean;
  onResend: () => void;
  sentAt: number;
}

export function ResendOtpButton({
  disabled,
  onResend,
  sentAt,
}: ResendOtpButtonProps) {
  const remainingSeconds = useOtpResendCooldown(sentAt);
  const isDisabled = disabled || remainingSeconds > 0;

  return (
    <button
      className="font-medium text-ddf-blue-500 hover:underline disabled:opacity-60"
      disabled={isDisabled}
      onClick={onResend}
      type="button"
    >
      Code erneut senden
      {remainingSeconds > 0 ? ` (${String(remainingSeconds)} s)` : ""}
    </button>
  );
}
