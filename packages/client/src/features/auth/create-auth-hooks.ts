import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AuthResult {
  error: null | { message?: string | undefined };
}

interface SignInOtpAuthClient<
  TRequestResult extends AuthResult,
  TSignInResult extends AuthResult,
> {
  deleteUser: () => Promise<AuthResult>;
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
  signOut: () => Promise<AuthResult>;
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

  function useSignOut() {
    const queryClient = useQueryClient();

    const signOutMutation = useMutation({
      mutationFn: () => authClient.signOut(),
      onError(error) {
        console.error(error);
      },
      onSettled() {
        queryClient.clear();
      },
    });

    return signOutMutation;
  }

  function useDeleteAccount() {
    const queryClient = useQueryClient();

    const deleteAccountMutation = useMutation({
      mutationFn: async () => {
        const result = await authClient.deleteUser();
        if (result.error) {
          const message =
            result.error.message ?? "Could not delete your account.";
          throw new Error(
            `${message}${message.endsWith(".") ? "" : "."} If your session has expired, sign out and sign back in before trying again.`,
          );
        }
        return result;
      },
      onSettled() {
        queryClient.clear();
      },
    });

    return deleteAccountMutation;
  }

  return { useDeleteAccount, useSignIn, useSignOut };
}
