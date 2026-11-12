const {test,expect}=require('./fixtures.cjs');
const {readFile}=require('node:fs/promises');
const Zip=require('../../apps/docmkr/vendor/jszip.min.js');

test('PixelMkr removes white, exports cutout ZIP, and restores the source with Undo',async({page})=>{
 const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 await page.goto('apps/pixelmkr/');
 const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='white';g.fillRect(0,0,64,64);g.fillStyle='red';g.fillRect(16,16,32,32);return c.toDataURL().split(',')[1];});
 await page.locator('#imageInput').setInputFiles({name:'cutout.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});await page.locator('.layer.selected').waitFor();
 const open=async()=>{await page.getByRole('button',{name:'Effects',exact:true}).click();await page.locator('[data-action="smartRemoveBg"]').click();await page.locator('#backgroundStudio').waitFor();};
 await open();await page.locator('#bs-mode').selectOption('white');await page.locator('#bs-process').click();await expect(page.locator('#bs-apply')).toBeEnabled();
 expect(await page.locator('#bs-result').evaluate(c=>c.getContext('2d').getImageData(0,0,1,1).data[3])).toBe(0);
 const pending=page.waitForEvent('download');await page.locator('#bs-zip').click();const zip=await Zip.loadAsync(await readFile(await(await pending).path()));const images=Object.values(zip.files).filter(f=>!f.dir);expect(images).toHaveLength(1);expect(images[0].name).toMatch(/\.png$/);expect((await images[0].async('uint8array')).length).toBeGreaterThan(20);
 await page.locator('#bs-apply').click();await expect(page.locator('#backgroundStudio')).toHaveCount(0);await page.keyboard.press('Control+z');await page.locator('.layer').first().click();await open();
 expect(await page.locator('#bs-original').evaluate(c=>c.getContext('2d').getImageData(0,0,1,1).data[3])).toBe(255);await page.locator('#bs-close').click();expect(errors).toEqual([]);expect(failed).toEqual([]);
});

test('PuzzleMkr starts with a local image, exports questions, and opens the student activity',async({page})=>{
 const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 await page.goto('apps/puzzlemkr/');await expect(page.locator('#previewImage')).toBeVisible();await expect.poll(()=>page.locator('#previewImage').evaluate(i=>i.naturalWidth)).toBeGreaterThan(0);await expect(page.locator('#questionList li')).toHaveCount(5);
 const pending=page.waitForEvent('download');await page.locator('#downloadBtn').click();const setup=JSON.parse(await readFile(await(await pending).path(),'utf8'));expect(setup.questions).toHaveLength(5);expect(new URL(setup.image).pathname).toMatch(/\/apps\/puzzlemkr\/puppy.jpg$/);
 const popup=page.waitForEvent('popup');await page.locator('#openStudentBtn').click();const student=await popup;student.on('pageerror',e=>errors.push(e.message));await student.waitForLoadState();expect((await student.locator('body').innerText()).length).toBeGreaterThan(100);await student.close();expect(errors).toEqual([]);expect(failed).toEqual([]);
});

test('PageMkr loads its bundled Arabic, Indic, and CJK fonts',async({page})=>{
 const failed=[];page.on('response',r=>{if(r.url().includes('/fonts/')&&r.status()>=400)failed.push(r.url());});
 await page.goto('apps/pagemkr/');
 const loaded=await page.evaluate(async()=>{const fonts=[['PageMkr Arabic','مرحبا'],['PageMkr Indic','नमस्ते'],['PageMkr CJK','中文']];return Promise.all(fonts.map(async([name,sample])=>{const faces=await document.fonts.load(`20px "${name}"`,sample);return {name,loaded:faces.length>0&&faces.every(f=>f.status==='loaded')};}));});
 expect(loaded.every(f=>f.loaded)).toBe(true);expect(failed).toEqual([]);
});
