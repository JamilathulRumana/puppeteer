var puppeteer = require("puppeteer");
var fs = require('fs');

(async function main(){
try{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    var appendAmazonLink = "https://www.amazon.in/";
    var data = {
        categories: []
    }
    var rating = "";
    /////////////////////////////URL///////////////////////////////////////////
    await page.goto('https://www.amazon.in/SKM-kabasura-kudineer-chooranam-Churanam100/dp/B08BNJGP5Q/ref=sr_1_5?crid=1Q1WPM3G4STWN&dchild=1&keywords=kabasura+kudineer&qid=1603374138&sprefix=kaba%2Caps%2C784&sr=8-5', {waitUntil : 'domcontentloaded'});
    /////////////////////////////URL///////////////////////////////////////////
    await page.addScriptTag({url : 'https://code.jquery.com/jquery-3.2.1.min.js'});
    const seeAllReviewsButton = await page.$('a.a-link-emphasis.a-text-bold');
    seeAllReviewsButton.click();

    await page.waitForSelector('#cm_cr-review_list');
    const divs = await page.$$('#cm_cr-review_list > div.a-section.review.aok-relative');
    const ProductName =await page.$eval('a[data-hook = "product-link"]', a=> a.innerText);
    console.log(ProductName);
    
    for(const div of divs){
        const reviewerName =await div.$eval('.a-profile-content', span => span.innerText);
                const IndianRatingCheck = await page.$('i[data-hook = "review-star-rating"]>span.a-icon-alt');
                if(IndianRatingCheck==null)
                {
                    rating =await div.$eval('i[data-hook = "cmps-review-star-rating"]', span => span.innerText);
                }
                else{
                    rating =await div.$eval('i[data-hook = "review-star-rating"]', span => span.innerText);
                }
        const review =await div.$eval('span[data-hook = "review-body"]', span => span.innerText);
        let obj = {
            ReviewerName: reviewerName,
            Rating: rating,
            Review: review
        }
        data.categories.push(obj);
    }
                for(let i=0;i<499;i++){
                const nextPageDisableEnable = await page.$('div[data-hook = "pagination-bar"]>ul>li.a-disabled.a-last');

                    if(nextPageDisableEnable==null)
                    {
                    const NextPageLink = await page.$eval(('div[data-hook = "pagination-bar"]>ul>li.a-last>a'), a => a.getAttribute('href'));          
                    await page.goto(appendAmazonLink + NextPageLink, {waitUntil : 'domcontentloaded'});
                    await page.waitForSelector('#cm_cr-review_list');
                    const divsone = await page.$$('#cm_cr-review_list > div.a-section.review.aok-relative');
                                if(divsone){
                                            for(const divone of divsone){
                                                const reviewerName =await divone.$eval('.a-profile-content', span => span.innerText);
                                                const IndianRatingCheck = await page.$('i[data-hook = "review-star-rating"]>span.a-icon-alt');
                                                if(IndianRatingCheck==null)
                                                {
                                                    rating =await divone.$eval('i[data-hook = "cmps-review-star-rating"]', span => span.innerText);
                                                }
                                                else{
                                                    
                                                    rating =await divone.$eval('i[data-hook = "review-star-rating"]', span => span.innerText);
                                                }
                                                
                                                const review =await divone.$eval('span[data-hook = "review-body"]', span => span.innerText);
                                                let obj = {
                                                    ReviewerName: reviewerName,
                                                    Rating: rating,
                                                    Review: review
                                                }
                                                data.categories.push(obj);
                                            }

                                }
                                else{
                                            console.log('else error');
                                    }

                      }
                      else{
                          i=500;
                        }
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
