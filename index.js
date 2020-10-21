var puppeteer = require("puppeteer");

(async function main(){
try{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://www.amazon.in/Samsung-Galaxy-Midnight-128GB-Storage/dp/B07HGH88GL/ref=redir_mobile_desktop?ie=UTF8&aaxitk=.1lpc0IvqJifMittaV5Eww&hsa_cr_id=3709661290002&ref_=sbx_be_s_sparkle_td_asin_2', {waitUntil : 'domcontentloaded'});
    await page.addScriptTag({url : 'https://code.jquery.com/jquery-3.2.1.min.js'});

    //console.log('its showing');

    const seeAllReviewsButton = await page.$('a.a-link-emphasis.a-text-bold');
    //console.log(seeAllReviewsButton.length);
    seeAllReviewsButton.click();

    await page.waitForSelector('#cm_cr-review_list');
    const divs = await page.$$('#cm_cr-review_list > div.a-section.review.aok-relative');

    for(const div of divs){
        const reviewerName =await div.$eval('.a-profile-content', span => span.innerText);
        console.log('Reviewer Name:', reviewerName);
        console.log('');
        const rating =await div.$eval('i[data-hook = "review-star-rating"]', span => span.innerText);
        console.log('Rating:', rating);
        console.log('');
        const productDetails =await div.$eval('a[data-hook = "format-strip"]', a => a.innerText);
        console.log('Product Details:', productDetails);
        console.log('');
        const review =await div.$eval('span[data-hook = "review-body"]', span => span.innerText);
        console.log('Review:', review);
        console.log('----------------------------------------------------------------------------');
    }



}catch(e){
console.log('our error',e);
}
})();