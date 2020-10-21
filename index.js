var puppeteer = require("puppeteer");
var fs = require('fs');

(async function main(){
try{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://www.amazon.in/Samsung-Galaxy-Midnight-128GB-Storage/dp/B07HGH88GL/ref=redir_mobile_desktop?ie=UTF8&aaxitk=.1lpc0IvqJifMittaV5Eww&hsa_cr_id=3709661290002&ref_=sbx_be_s_sparkle_td_asin_2', {waitUntil : 'domcontentloaded'});
    await page.addScriptTag({url : 'https://code.jquery.com/jquery-3.2.1.min.js'});

    const seeAllReviewsButton = await page.$('a.a-link-emphasis.a-text-bold');
    seeAllReviewsButton.click();

    await page.waitForSelector('#cm_cr-review_list');
    const divs = await page.$$('#cm_cr-review_list > div.a-section.review.aok-relative');

    var data = {
        categories: []
    }
    
    for(const div of divs){
        const reviewerName =await div.$eval('.a-profile-content', span => span.innerText);
        const rating =await div.$eval('i[data-hook = "review-star-rating"]', span => span.innerText);
        const productDetails =await div.$eval('a[data-hook = "format-strip"]', a => a.innerText);
        const review =await div.$eval('span[data-hook = "review-body"]', span => span.innerText);
        let obj = {
            ReviewerName: reviewerName,
            Rating: rating,
            ProductDetails: productDetails,
            Review: review
        }
        data.categories.push(obj);
    }
    fs.appendFile("categories.json", JSON.stringify(data.categories), function(err){
        if(err){
            console.log("Error");
        }else{
            console.log("Data Scrapped");
        }
    })
    await page.close();
    await browser.close();
}catch(e){
console.log('our error',e);
}
})();