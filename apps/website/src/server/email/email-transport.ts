import { Resend } from "resend";

export interface EmailMessage {
  html: string;
  subject: string;
  text: string;
  to: string;
}

export interface EmailTransport {
  send(message: EmailMessage): Promise<void>;
}

interface EmailTransportOptions {
  environment?: string;
  log?: (message: string) => void;
  resendApiKey?: string;
  resendFromEmail?: string;
  sendWithResend?: ResendEmailDelivery;
}

type ResendEmailDelivery = (
  apiKey: string,
  message: ResendEmailPayload,
) => Promise<void>;

interface ResendEmailPayload extends EmailMessage {
  from: string;
}

const sendWithResend: ResendEmailDelivery = async (apiKey, message) => {
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(message);

  if (error) {
    throw new Error(`Resend could not send the email: ${error.message}`);
  }
};

export function createEmailTransport(
  options: EmailTransportOptions = {},
): EmailTransport {
  const environment = options.environment ?? process.env.NODE_ENV;

  if (environment !== "production") {
    const log = options.log ?? ((message: string) => {
      console.info(message);
    });

    return {
      send(message) {
        log(
          `[email:console]\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}`,
        );
        return Promise.resolve();
      },
    };
  }

  const deliverWithResend = options.sendWithResend ?? sendWithResend;

  return {
    async send(message) {
      const resendApiKey = options.resendApiKey ?? process.env.RESEND_API_KEY;
      const resendFromEmail =
        options.resendFromEmail ?? process.env.RESEND_FROM_EMAIL;

      if (!resendApiKey || !resendFromEmail) {
        throw new Error(
          "RESEND_API_KEY and RESEND_FROM_EMAIL are required to send email in production.",
        );
      }

      await deliverWithResend(resendApiKey, {
        ...message,
        from: resendFromEmail,
      });
    },
  };
}
