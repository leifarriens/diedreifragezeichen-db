const Fs = require('fs');
const Path = require('path');
const Axios = require('axios')
const moment = require('moment');
const scrapeIt = require('scrape-it');
const Folge = require('../models/folge');

module.exports = async () => {
  return new Promise(async (resolve, reject) => {
    const folgen = await Folge.find({});
  
    let counter = 0;
      folgen.forEach(folge => {
        const formattedTitle = folge.title.toLowerCase()
              .replace(/\s+/g, '-')
              .replace('ß', 'ss')
              .replace('ä', 'a')
              .replace('ö', 'o')
              .replace('ü', 'u');
              
        scrapeIt(`https://dreifragezeichen.de/produktwelt/details/${formattedTitle}`, {
          title: '.product-title',
          release: '.title span:last-of-type',
          inhalt: '#info-inhalt p',
          sprecher: '#info-sprecher p'
        }).then(({ data, response }) => {
          folge.inhalt = data.inhalt;
          folge.sprecher = data.sprecher;
          const releaseSplit = data.release.replace('Veröffentlichungsdatum: ', '').split('.');
          const formattedDate = `${releaseSplit[1]}/${releaseSplit[0]}/${releaseSplit[2]}`;
          if (moment(formattedDate).isValid()) {
            folge.release = moment(formattedDate); 
          } else {
            folge.release = '???';
          }
    
          folge.save()
          .then(() => {
            console.log(folge.number);
            counter++;
            if (counter === folgen.length) resolve(true);
          })
          .catch(err => console.log(err));
        })
      });
  });
}
 