const puppeteer = require('puppeteer-core');
module.exports = {
  scrapeCurrencyTable: async (siteUrl = '', headless = true) => {
    // Optional window and viewport dimensions config
    const width = 1920;
    const height = 1080;
    const browser = await puppeteer.launch({
      headless: headless,
      args: [`--window-size=${width},${height}`],
      timeout: 0,
      executablePath: process.env.CHROMIUM_PATH
    });
    const page = await browser.newPage();
    await page.setViewport({width, height});
    // Navigating
    await page.goto(siteUrl, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 0
    });

    return await page.evaluate(() => {
      const elementsByClassName = document.querySelectorAll('.currency-hero__rates .box__content .list-table .list-table__body .list-table__row');
      if(elementsByClassName && elementsByClassName.length > 0) {
        return Array.from(elementsByClassName).map(ele => ele.innerText);
      }
      return [];
    })
      .then(elements => {
        const table = elements.map(ele => {
          const strArr = ele.split('\n')
          const key = strArr[0];
          const weBuy = strArr[1];
          const weSell = strArr[2];
          return {
            [key]: {
              'We buy': weBuy,
              'We sell': weSell
            }
          }
        })
        return table;
      });
  }
}