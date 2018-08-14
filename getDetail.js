const request = require('request');
const cheerio = require('cheerio');
require("tls").DEFAULT_ECDH_CURVE = "auto"

module.exports = function(url) {
  return new Promise((resolve, reject) => {

    request(url, (err, res, body) => {
      if (err) return reject(err);
    
      let data = {};
    
      const $ = cheerio.load(body);
      const title = $('main article header div > h1').text().replace(/\n/g, '').trim();
      const date = $('main article header div > time').text();
    
      let images = [];
      $('#content .card-panel > .p_image_center img').each((i, elem) => {
        images.push($(elem).prop('src'));
      });
    
      const englishName = $('#content .card-panel h2 + p').text();
    
      let otherNames = [];
      $('#content .card-panel ol.p_alternative_list > li > a').each((_, elem) => {
        const d = {
          name: $(elem).text(),
          href: $(elem).prop('href')
        }
        otherNames.push(d);
      });
    
      const fromInfo = $('#content .card-panel')[1];
      let from, taste, make, traits;
      $(fromInfo).find('h3').each((_, elem) => {
        const value = $(elem).next().text();
        if (!value) value = ''; 
        switch($(elem).text()) {
          case '来源':
            from = value;
            break;
          case '性味':
            taste = value;
            break;
          case '炮制':
            make = value;
            break;
          case '性状':
            traits = value;
            break;
          default:
            break;
        }
      });
    
      const effectInfo = $('#content .card-panel')[2];
      let effect, meridian, indication, dosage, attention;
      $(effectInfo).find('h3').each((_, elem) => {
        const nextHtml = $(elem).next();
        let value = nextHtml.text();
        if (nextHtml.get(0).tagName === 'ul') {
          let it = [];
          value = nextHtml.find('li').each((_, elem) => {
            it.push($(elem).text());
          });
          value = it;
        }
    
        switch($(elem).text()) {
          case '功效':
            effect = value;
            break;
          case '经脉':
            meridian = value;
            break;
          case '主治':
            indication = value;
            break;
          case '用法用量':
            dosage = value;
            break;
          case '注意禁忌':
            attention = value;
            break;
          default:
            break;
        }
      });
    
      const prescription = [];
      $($('#content .card-panel')[3]).find('ul > li').each((_, elem) => {
        prescription.push($(elem).text());
      });
    
    
      data = {
        title,
        date,
        images,
        englishName,
        otherNames,
        from,
        taste,
        make,
        traits,
        effect, 
        meridian, 
        indication, 
        dosage, 
        attention,
        prescription
      };
    
      resolve(data);
    });
    
  });
}
