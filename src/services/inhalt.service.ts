import Axios from 'axios';
import { load } from 'cheerio';
const RESOURCE_URL =
  'https://play-europa.de/produktwelt/hoerspiele/produktliste/die-drei';

type InhaltData = {
  name: string;
  body: string;
};

export async function getAllInhalte() {
  const numberOfPages = await getNumberOfPages();

  const pages = Array.from({ length: numberOfPages }).map((_, i) => i + 1);

  try {
    const pageResponses = await Promise.all(pages.map(getPage));

    const pageData = pageResponses.map(({ data }) => {
      const html = load(data);

      const page: InhaltData[] = [];

      html('.news-teaser-body').each(function () {
        const el = html(this);

        const name = el.find('h5').text();
        const body = el.find('p').text();

        page.push({ name, body });
      });

      return page;
    });

    // eslint-disable-next-line prefer-spread
    const array: InhaltData[] = [];
    const result: InhaltData[] = array.concat.apply([], pageData);

    return result;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      console.warn(error.response?.data);
    }
    return null;
  }
}

// utils
async function getNumberOfPages() {
  const { data } = await Axios(RESOURCE_URL);
  const html = load(data);

  return parseInt(html('.pagination').find('li:nth-last-child(2)').text());
}

async function getPage(pageNumber: number) {
  await sleep(1000 * pageNumber);

  const res = Axios.get(RESOURCE_URL, {
    params: {
      page: pageNumber,
    },
  });

  return res;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
