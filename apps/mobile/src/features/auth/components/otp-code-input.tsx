import { type ComponentRef, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface OtpCodeInputProps {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  length?: number;
  onChangeText: (code: string) => void;
  onComplete?: (code: string) => void;
  value: string;
}

export function normalizeOtpCode(value: string, length: number) {
  const codeLength = Math.max(1, Math.floor(length));
  return value.replace(/\D/g, "").slice(0, codeLength);
}

export function OtpCodeInput({
  accessibilityHint,
  accessibilityLabel = "Verification code",
  autoFocus = false,
  disabled = false,
  length = 6,
  onChangeText,
  onComplete,
  value,
}: OtpCodeInputProps) {
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectionStart, setSelectionStart] = useState<null | number>(null);
  const codeLength = Math.max(1, Math.floor(length));
  const code = normalizeOtpCode(value, codeLength);
  const activeIndex = isFocused
    ? Math.min(selectionStart ?? code.length, codeLength - 1)
    : -1;

  function handleChangeText(text: string) {
    const nextCode = normalizeOtpCode(text, codeLength);
    onChangeText(nextCode);

    if (nextCode.length === codeLength) {
      onComplete?.(nextCode);
    }
  }

  return (
    <View className="relative w-full">
      <View
        accessibilityElementsHidden
        className="h-14 flex-row gap-2"
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
      >
        {Array.from({ length: codeLength }, (_, index) => {
          const isActive = activeIndex === index;
          const digit = code[index] ?? "";

          return (
            <View
              className={`h-full flex-1 items-center justify-center rounded-xl border ${isActive ? "border-sky-400 bg-white/10" : "border-white/70"}`}
              key={index}
            >
              {digit !== "" && (
                <Text className="text-2xl font-semibold text-white">
                  {digit}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <TextInput
        accessibilityHint={
          accessibilityHint ??
          `Enter the ${String(codeLength)}-digit code sent to you.`
        }
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        autoCapitalize="none"
        autoComplete="one-time-code"
        autoCorrect={false}
        autoFocus={autoFocus}
        caretHidden
        editable={!disabled}
        keyboardType="number-pad"
        maxLength={codeLength}
        onBlur={() => { setIsFocused(false); }}
        onChangeText={handleChangeText}
        onFocus={() => {
          setIsFocused(true);
          setSelectionStart(code.length);
        }}
        onSelectionChange={({ nativeEvent }) => {
          setSelectionStart(nativeEvent.selection.start);
        }}
        ref={inputRef}
        returnKeyType="done"
        selectionColor="transparent"
        style={{
          color: "transparent",
          fontSize: 24,
          height: "100%",
          left: 0,
          opacity: 0.01,
          padding: 0,
          position: "absolute",
          textAlign: "center",
          top: 0,
          width: "100%",
        }}
        underlineColorAndroid="transparent"
        value={code}
      />
      <Pressable
        accessible={false}
        disabled={disabled}
        onPress={() => {
          inputRef.current?.focus();
        }}
        style={{
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />
    </View>
  );
}
