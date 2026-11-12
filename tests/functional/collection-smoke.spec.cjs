const {test,expect}=require('./fixtures.cjs');
const {readdirSync,existsSync}=require('node:fs');
const {resolve}=require('node:path');
const appRoot=resolve(__dirname,'../../apps');
for(const app of readdirSync(appRoot).filter(name=>existsSync(resolve(appRoot,name,'index.html')))){
 test(`${app} starts without exceptions or missing local assets`,async({page,baseURL})=>{
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(baseURL)&&r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
  await page.goto(`apps/${app}/`,{waitUntil:'load'});
  await expect(page.locator('body')).not.toBeEmpty();
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);expect(failed).toEqual([]);
  await expect(page.locator('body')).not.toContainText('could not start');
 });
}
