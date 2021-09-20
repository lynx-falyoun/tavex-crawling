const got = require('got');
const url = 'https://tavex.se/valutaprislista/';
const cheerio = require('cheerio')
module.exports = {
  scrapeCurrencyTable: async () => {
    return await got(url)
      .then(response => {
        const $ = cheerio.load(response.body)
        const loaded$ = $('.currency-hero__rates .box__content .list-table .list-table__body .list-table__row');
        const data = [];
        loaded$.each((_idx, el) => {
          data.push($(el).text().replace(/\s\s+/g, ' ').trim())
        });
        return data;
      })
      .then(elements => {
        return elements.map(ele => {
          const strArr = ele.split(' ')
          const code = strArr[0];
          strArr.splice(0, 1);
          const weSell = strArr[strArr.length - 1];
          const weBuy = strArr[strArr.length - 2];
          strArr.splice(strArr.length - 2);
          const key = strArr.join(' ');
          return {
            currency: key,
            code,
            buy: weBuy,
            sell: weSell
          }
        });
        // fs.writeFileSync('table2.json', JSON.stringify(table, null, 2))
      });
  }
}

