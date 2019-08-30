const Folge = require('../models/folge');

const scrapeDetails = async () => {
  const folgen = await Folge.find({});
  console.log(folgen);
  folgen.forEach(folge => {
    const formattedTitle = folge.title.replace(/\s+/g, '-').toLowerCase();
    scrapeIt(`https://dreifragezeichen.de/produktwelt/details/${formattedTitle}`, {
      title: '.product-title',
      release: '.title span:last-of-type',
      inhalt: '#info-inhalt p',
      sprecher: '#info-sprecher p'
    }).then(({ data, response }) => {
      console.log(`Status Code: ${response.statusCode}`)
      // console.log(data)
      folge.inhalt = data.inhalt;
      folge.sprecher = data.sprecher;
      folge.release = data.release;
  
      console.log(data.inhalt);
      folge.save()
      .then(() => console.log(folge))
      .catch(err => console.log(err));
    })
  })
}

scrapeDetails();