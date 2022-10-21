import * as aws from '@aws-sdk/client-ses';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import nodemailer from 'nodemailer';

import dayjs from '@/lib/dayjs';
import { FolgeWithId } from '@/models/folge';
import { User } from '@/models/user';
import { renderMailToString } from '@/utils/mjml';

const ses = new aws.SESClient({
  apiVersion: '2010-12-01',
  region: process.env.AWS_REGION,
  credentialDefaultProvider: defaultProvider,
});

const transporter = nodemailer.createTransport({
  // streamTransport: true,
  // newline: 'unix',
  SES: { ses, aws },
});

export async function sendFolgenNotification(folge: FolgeWithId) {
  const users = await User.find({ notifications: true });

  const to = users.map((user) => user.email);

  if (to.length === 0) return { message: 'No users in this mailing list' };

  const data = {
    name: folge.name,
    image: folge.images[1].url,
    release_date: dayjs(folge.release_date).format('DD.MM.YYYY'),
    inhalt: folge.inhalt,
    href: `${process.env.NEXTAUTH_URL}/folge/${folge._id}`,
  };

  const html = await renderMailToString('new-folge', data);

  if (process.env.NODE_ENV !== 'production') {
    return html;
  }

  return transporter.sendMail({
    from: 'Die drei Fragezeichen DB <archiv@ddfdb.de>',
    to,
    subject: 'Ein neuer Fall wurde dem Archiv hinzugefügt',
    html,
  });
}
