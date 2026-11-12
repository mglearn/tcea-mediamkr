const base=require('@playwright/test');
// Functional checks use local font fallbacks and do not depend on the Fonts CDN.
const test=base.test.extend({page:async({page},use)=>{
 await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({contentType:'text/css',body:'/* Use local font fallbacks in functional checks. */'}));
 await use(page);
}});
module.exports={test,expect:base.expect};
