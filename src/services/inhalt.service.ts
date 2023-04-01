import Axios from 'axios';
import { load } from 'cheerio';

const RESOURCE_URL =
  'https://play-europa.de/produktwelt/hoerspiele/produktliste/die-drei';

interface InhaltData {
  name: string;
  body: string;
}

export async function getAllInhalte(): Promise<InhaltData[]> {
  const numberOfPages = await getNumberOfPages();

  const pages = Array.from({ length: numberOfPages }).map((_, i) => i + 1);

  const pageInhalte = await Promise.all(pages.map(getPageInhalte));

  const array: InhaltData[] = [];
  const result: InhaltData[] = array.concat.apply([], pageInhalte);

  return result;
}

// utils
async function getNumberOfPages() {
  const { data } = await Axios.get<string>(RESOURCE_URL);
  const html = load(data);

  return parseInt(html('.pagination').find('li:nth-last-child(2)').text());
}

async function getPageInhalte(pageNumber: number) {
  const { data } = await Axios.get<string>(RESOURCE_URL, {
    params: {
      page: pageNumber,
    },
  });

  const html = load(data);

  const page: InhaltData[] = [];

  html('.news-teaser-body').each(function () {
    const el = html(this);

    const name = el.find('h5').text();
    const body = el.find('p').text();

    page.push({ name, body });
  });

  return page;
}
