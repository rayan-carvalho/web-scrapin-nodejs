const pup = require("puppeteer");
const url = "https://www.mercadolivre.com.br/";
const searchFor = "macbook";
let c = 1;
let list = [];
(async () => {

  const browser =  await pup.launch({headless:false});
  const page =  await browser.newPage();
 

 
  await page.goto(url);
  
  await page.waitForSelector('#cb1-edit')

  await page.type('#cb1-edit', searchFor);

  await Promise.all([
    page.waitForNavigation(),
    page.click('.nav-search-btn')
  ])

  const links = await page.$$eval('.ui-search-item__group__element.ui-search-link', elements => elements.map(el => el.href));


 for(link of links){
  console.log('Página', c);
  console.log(link);
  await page.goto(link);
  await page.waitForSelector('.ui-pdp-title');

  const tile = await page.$eval('.ui-pdp-title', element => element.innerText);
  const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);

  const seller = await page.evaluate(()=> {
    const el = document.querySelector('.ui-pdp-promotions-pill-label__text');
    if(!el) return null
    return el.innerText;
  });
  const obj = {};

  obj.tittle = tile;
  obj.price = price;
  (seller ? obj.seller = seller : '');
  obj.link = link;

  list.push(obj);

  console.log(obj);

  
  
  c++;
 }

 const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

 await delay(3000);

await browser.close();



 

})();