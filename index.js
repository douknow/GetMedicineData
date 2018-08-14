const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

require("tls").DEFAULT_ECDH_CURVE = "auto"

const baesURL = 'https://zhongyibaike.com';
const indexURL = '/wiki/%E4%B8%AD%E8%8D%AF%E5%A4%A7%E5%85%A8';


const option = {
  method: 'GET',
  url: baesURL + indexURL,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
  }
}

request(option, (err, res, body) => {
  if (err) return console.log(err);

  let data = {
    data: []
  };

  const $ = cheerio.load(body);
  $('main section h2').each((i, elem) => {
    const tag = $(elem).text()
    let itemData = { };

    itemData.type = tag;

    let items = [];

    $(elem).next().find('ol > li').each((i, elem) => {
      const smallTag = $(elem).find('strong').text();

      let d = {};
      d.type = smallTag;

      let sitems = [];
      $(elem).find('ul > li > a').each((i, elem) => {
        sitems.push({
          name: $(elem).text(),
          href: $(elem).prop('href')
        });
      });

      d.items = sitems;
      items.push(d);
    });

    itemData.items = items;
    // console.log('-----------------------------------------');
    // console.log(items);
    data.data.push(itemData);
  });

  fs.writeFileSync('./data.json', JSON.stringify(data));
  console.log('ok');
});
