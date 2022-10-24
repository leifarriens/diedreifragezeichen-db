import formData from 'form-data';
import Mailgun from 'mailgun.js';
const mailgun = new Mailgun(formData);

import dayjs from '@/lib/dayjs';
import { FolgeWithId } from '@/models/folge';
import { User } from '@/models/user';
import { renderMailToString } from '@/utils/mjml';

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: process.env.MAILGUN_API_URL,
});

export async function sendFolgenNotification(folge: FolgeWithId) {
  const users = await User.find({ notifications: true });

  const recipientVariables = users.reduce((curr, acc) => {
    return { ...curr, [acc.email]: { unique_id: acc._id.toString() } };
  }, {});

  if (Object.keys(recipientVariables).length === 0)
    return { message: 'No users in this mailing list' };

  const data = {
    name: folge.name,
    image: folge.images[1].url,
    release_date: dayjs(folge.release_date).format('DD.MM.YYYY'),
    inhalt: folge.inhalt,
    href: `${process.env.NEXTAUTH_URL}/folge/${folge._id}`,
  };

  const html = await renderMailToString('new-folge', data);

  console.log(recipientVariables);
  if (process.env.NODE_ENV !== 'production') {
    return html;
  }

  return mg.messages.create('mg.ddfdb.de', {
    from: 'Die drei Fragezeichen DB <archiv@ddfdb.de>',
    to: Object.keys(recipientVariables),
    subject: 'Ein neuer Fall wurde dem Archiv hinzugefügt',
    html,
    'recipient-variables': JSON.stringify(recipientVariables),
  });
}
