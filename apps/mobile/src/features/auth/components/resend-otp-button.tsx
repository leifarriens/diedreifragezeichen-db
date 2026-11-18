import { useOtpResendCooldown } from "@ddfdb/client";

import { UIButton } from "@/components/ui/button";

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
    <UIButton
      disabled={isDisabled}
      intent="plain"
      label={`Code erneut senden${remainingSeconds > 0 ? ` (${String(remainingSeconds)} s)` : ""}`}
      onPress={onResend}
    />
  );
}
