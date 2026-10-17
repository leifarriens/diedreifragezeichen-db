import { useMutation } from "@tanstack/react-query";

interface AuthResult {
  error: null | { message?: string | undefined };
}

interface SignInOtpAuthClient<
  TRequestResult extends AuthResult,
  TSignInResult extends AuthResult,
> {
  emailOtp: {
    sendVerificationOtp(input: {
      email: string;
      type: "sign-in";
    }): Promise<TRequestResult>;
  };
  signIn: {
    emailOtp(input: {
      email: string;
      name: string;
      otp: string;
    }): Promise<TSignInResult>;
  };
}

interface SignInOtpVariables {
  email: string;
  otp: string;
}

export function createAuthHooks<
  TRequestResult extends AuthResult,
  TSignInResult extends AuthResult,
>(authClient: SignInOtpAuthClient<TRequestResult, TSignInResult>) {
  function useSignIn() {
    const otpRequestMutation = useMutation<
      TRequestResult,
      Error,
      { email: string }
    >({
      mutationFn: async ({ email }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const result = await authClient.emailOtp.sendVerificationOtp({
          email: normalizedEmail,
          type: "sign-in",
        });

        if (result.error) {
          throw new Error(
            result.error.message ?? "Could not send a sign-in code.",
          );
        }

        return result;
      },
    });

    const otpSigninMutation = useMutation<
      TSignInResult,
      Error,
      SignInOtpVariables
    >({
      mutationFn: async ({ email, otp }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const result = await authClient.signIn.emailOtp({
          email: normalizedEmail,
          name: normalizedEmail.split("@")[0] ?? normalizedEmail,
          otp: otp.trim(),
        });

        if (result.error) {
          throw new Error(
            result.error.message ?? "Could not verify the sign-in code.",
          );
        }

        return result;
      },
    });

    return { otpRequestMutation, otpSigninMutation };
  }

  return { useSignIn };
}
