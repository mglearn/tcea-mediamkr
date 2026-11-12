const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'./tests/functional',testMatch:'*.spec.cjs',workers:1,timeout:30000,
 use:{baseURL:process.env.MEDIAMKR_URL||'http://127.0.0.1:4183/mglearn/mediamkr/'},
 projects:[
  {name:'chromium',use:{browserName:'chromium',channel:'chrome'}},
  {name:'firefox',use:{browserName:'firefox'}},
  {name:'iphone',use:{...devices['iPhone 13'],browserName:'webkit'}},
 ],
});
