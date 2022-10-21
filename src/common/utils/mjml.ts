import fs from 'fs';
import mjml2html from 'mjml';
import mustache from 'mustache';
import path from 'path';

export async function renderMailToString(
  template: string,
  templateData?: unknown,
) {
  const emailsPath = path.resolve(process.cwd(), 'src', 'emails');
  const emailsDir = fs.readdirSync(emailsPath);

  const templateFilename = emailsDir.find((string) =>
    string.includes(template),
  );

  if (!templateFilename) {
    throw Error('So such email template file');
  }

  const file = fs.readFileSync(path.join(emailsPath, templateFilename));

  try {
    const renderedMJML = mustache.render(file.toString(), templateData);

    const html = mjml2html(renderedMJML, {
      filePath: emailsPath,
    }).html;

    return html;
  } catch (error) {
    console.log(error);
    throw new Error('Error rendering Email to String');
  }
}
