const Axios = require('axios');
const cheerio = require('cheerio');
const cliProgress = require('cli-progress');
const fs = require('fs');
const path = require('path');

const BASE_URL =
  'https://play-europa.de/produktwelt/hoerspiele/produktliste/die-drei';

async function main() {
  const numberOfPages = await getNumberOfPages();

  const pages = Array.from({ length: numberOfPages }).map((_, i) => i + 1);

  const promises = pages.map((pageNunber) => {
    return Axios.get(BASE_URL, {
      params: {
        page: pageNunber,
      },
    });
  });

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  const pageResponses = await promisesWithProgress(promises, bar);

  const pageData = pageResponses.map(({ data }) => {
    const html = cheerio.load(data);

    let page = [];

    html('.news-teaser-body').each(function () {
      const el = html(this);

      const name = el.find('h5').text();
      const body = el.find('p').text();

      page.push({ name, body });
    });

    return page;
  });

  const result = [].concat.apply([], pageData);

  const filePath = path.resolve(__dirname, 'scrape-result.json');
  fs.writeFileSync(filePath, JSON.stringify(result), 'utf8');

  bar.stop();
  console.info('Saved scrape result to', filePath);
}

// utils
async function getNumberOfPages() {
  const { data } = await Axios(BASE_URL);
  const html = cheerio.load(data);

  return parseInt(html('.pagination').find('li:nth-last-child(2)').text());
}

// helpers
function promisesWithProgress(promises, progressBar) {
  progressBar.start(promises.length, 0);

  for (const p of promises) {
    p.then(() => {
      progressBar.increment(1);
    });
  }

  return Promise.all(promises);
}

main();
