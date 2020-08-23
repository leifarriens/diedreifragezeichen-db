const Fs = require('fs');
const Path = require('path');
const Axios = require('axios')
const moment = require('moment');
const scrapeIt = require('scrape-it');
const Folge = require('../models/folge');

// module.exports = async () => {
//   return new Promise(async (resolve, reject) => {
//     const folgen = await Folge.find({});

//     folgen.forEach

//     let counter = 0;
//       folgen.forEach(folge => {
//         const formattedTitle = folge.title.toLowerCase()
//               .replace(/\s+/g, '-')
//               .replace('ß', 'ss')
//               .replace('ä', 'a')
//               .replace('ö', 'o')
//               .replace('ü', 'u');

//         scrapeIt(`https://dreifragezeichen.de/produktwelt/details/${formattedTitle}`, {
//           title: '.product-title',
//           release: '.title span:last-of-type',
//           inhalt: '#info-inhalt p',
//           sprecher: '#info-sprecher p',
//           url: '.produkt-cover'
//         }).then(({ data, response }) => {
//           console.log();
//           folge.inhalt = data.inhalt;
//           folge.sprecher = data.sprecher;
//           folge.release = data.release.replace('Veröffentlichungsdatum: ', '');

//           folge.save()
//           .then(() => {
//             console.log(folge.number);
//             counter++;
//             if (counter === folgen.length) resolve(true);
//           })
//           .catch(err => console.log(err));
//         })
//       });
//   });
// }

exports.scrapeFolge = async (number) => {
  return new Promise(async (resolve, reject) => {
    const folge = await Folge.findOne({
      number
    });

    const formattedTitle = folge.title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace('ß', 'ss')
      .replace('ä', 'a')
      .replace('ö', 'o')
      .replace('ü', 'u');

    scrapeIt(`https://dreifragezeichen.de/produktwelt/details/${formattedTitle}`, {
      title: '.product-title h2',
      release: '.title span:last-of-type',
      inhalt: '#info-inhalt p',
      sprecher: '#info-sprecher p',
      cover: {
        selector: '.img-fluid.product-cover',
        attr: 'src'
      }
    }).then(({
      data,
      response
    }) => {
      console.log(data);
      resolve(data);
      // folge.title = data.title;
      // folge.url= data.url
      // folge.save()
      // .then(() => resolve(folge))
      // .catch(error => reject(error));
    })
  });
}