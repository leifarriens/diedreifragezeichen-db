/* eslint-disable @typescript-eslint/no-var-requires */
const Axios = require('axios');
const cheerio = require('cheerio');
const cliProgress = require('cli-progress');

async function scrapeInhalt(folgenName) {
  const normalizedName = folgenName
    .toLowerCase()
    // .replaceAll('und', '')
    .trim()
    .replaceAll(' ', '-')
    .replaceAll('ä', 'a')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ß', 'ss');

  try {
    const { data } = await Axios(
      `https://dreifragezeichen.de/produktwelt/details/${normalizedName}`,
    );

    const html = cheerio.load(data);
    const inhalt = html('#info-inhalt').find('p').text();
    // console.log(normalizedName, 'success');
    return inhalt;
  } catch (error) {
    // console.log(normalizedName, 'unable to scrape');
    // console.log(error);
    // console.log(`Unable to get Inhalt for ${normalizedName}`);
    return '';
  }
}

async function scrapeAllInhalte(folgen = []) {
  const actions = folgen.map((folge) => {
    return scrapeInhalt(folge.name);
  });

  await allProgress(actions);
}

function allProgress(proms) {
  const bar1 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic,
  );
  bar1.start(proms.length, 0);

  for (const p of proms) {
    p.then(() => {
      bar1.increment(1);
    });
  }
  return Promise.all(proms);
}

module.exports = { scrapeInhalt, scrapeAllInhalte };
