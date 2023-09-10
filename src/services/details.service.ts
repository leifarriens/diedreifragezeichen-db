import Axios from 'axios';
import { load } from 'cheerio';
import https from 'https';

const RESOURCE_BASE_URL = 'https://dreifragezeichen.de';
const RESOURCE_URL = RESOURCE_BASE_URL + '/produktwelt/hoerspiele';

interface Details {
  url: string;
  title: string;
  inhalt: string;
  sprecher: string;
  detailinfos: string;
}

interface Weblink {
  title: string;
  url: string;
}

const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 10 });

const instance = Axios.create({ httpsAgent });

export async function getAllWeblinks(): Promise<Weblink[]> {
  const numberOfPages = await getNumberOfPages();

  const pages = Array.from({ length: numberOfPages }).map((_, i) => i + 1);

  const pageLinks = await Promise.all(pages.map(getPageLinks));

  return Array<Weblink>().concat.apply([], pageLinks);
}

export async function getFolgenDetails(
  detailsPageUrl: string,
): Promise<Details> {
  const { data } = await instance.get<string>(detailsPageUrl);

  const html = load(data);

  let details: Details = {
    url: detailsPageUrl,
    title: '',
    inhalt: '',
    sprecher: '',
    detailinfos: '',
  };

  html('body').each(function () {
    const el = html(this);

    const title = el.find('.product-info .title h1').text();
    const inhalt = el.find('#info-inhalt p').text();
    const sprecher = el.find('#info-sprecher p').text();
    const detailinfos = el.find('#info-detailinfos p').text();

    details = { ...details, title, inhalt, sprecher, detailinfos };
  });

  return details;
}

async function getPageLinks(pageNumber: number): Promise<Weblink[]> {
  const { data } = await instance.get<string>(RESOURCE_URL, {
    params: {
      page: pageNumber,
    },
  });

  const html = load(data);

  const links: Weblink[] = [];

  html('.card-expander').each(function () {
    const el = html(this);

    const title = el.find('h4').text();
    const link = el.find('a').attr('href');

    if (link)
      links.push({
        title,
        url: RESOURCE_BASE_URL + link,
      });
  });

  return links;
}

export async function getNumberOfPages() {
  const { data } = await instance.get<string>(RESOURCE_URL);
  const html = load(data);

  return parseInt(html('.pagination').find('li:nth-last-child(2)').text());
}
