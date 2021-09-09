const express = require("express")
const puppeteerCurrencyHandler = require('./currency-table-handlers/puppeteer-currency-handler')
const cheerioCurrencyHandler = require('./currency-table-handlers/cheerio-currency-handler')
const app = express();
app.get('/currency-table-via-cheerio', async (req, res) => {
  try {
    const table = await cheerioCurrencyHandler.scrapeCurrencyTable();
    return res.status(200).json({currencies: table});
  } catch (e) {
    return res.status(500).json(e);
  }
});

app.get('/currency-table-via-puppeteer', async (req, res) => {
  try {
    const table = await puppeteerCurrencyHandler.scrapeCurrencyTable();
    return res.status(200).json({currencies: table});
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = app