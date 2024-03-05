// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const absolutePath = path.resolve(__dirname, '../client_generator/ei.jhu.edu/truss-simulator/index.html');

const dialogHandler = async dialog => {
    if (dialog.type() !== 'prompt') {
        return;
    }
    await dialog.accept('y');
};

test.beforeEach(async ({ page }) => {
    page.on('dialog', dialogHandler);
    await page.goto(`file://${absolutePath}`);
    // @ts-ignore
    await page.waitForFunction(() => globalThis.loadOnce !== undefined && window.workspace !== undefined);

    page.on('console', msg => {
        console.log("CONSOLE " + msg.text());
    });
});

test('Extension Load', async ({ page }) => {
    let loaded = await page.evaluate(() => globalThis.loadOnce);
    expect(loaded).toBe(true);
});

test('Save and Load Truss', async ({ page }) => {
    // Configure remote.
    await page.click('button:has-text("Import & Export")');
    await page.fill('input[placeholder="enter server address..."]', 'http://localhost:5000');

    // Upload test.
    // 1
    await page.click('button:has-text("Pre-built truss")');
    await page.click('button:has-text("1")');
    await page.click('button:has-text("Import & Export")');

    await page.click('button:has-text("Save as file")');
    await page.fill('input[placeholder="enter filename..."]', 'test1');
    await page.click('button:has-text("upload to server")');

    // 2
    await page.click('button:has-text("Import & Export")');
    await page.click('button:has-text("Pre-built truss")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text("Import & Export")');

    await page.click('button:has-text("Save as file")');
    await page.fill('input[placeholder="enter filename..."]', 'test2');
    await page.click('button:has-text("upload to server")');

    // Load test.
    let loadName = 'test1';
    page.removeListener('dialog', dialogHandler);
    page.on('dialog', async dialog => {
        if (dialog.type() !== 'prompt') {
            return;
        }
        await dialog.accept(loadName);
    });
    await page.click('button:has-text("Import & Export")');
    await page.click('button:has-text("load from server")');
    await page.waitForFunction(() => document.body.firstElementChild?.textContent === 'save status: LOADED unsaved');

    await page.evaluate(() => {
        // @ts-ignore
        let test_loadFile = loadDataElem.files[0];
        let test_reader = new FileReader();
        test_reader.onload = (e) => {
            // @ts-ignore
            globalThis.test_content = e.target?.result;
        };
        test_reader.readAsText(test_loadFile);
    });

    // @ts-ignore
    await page.waitForFunction(() => globalThis.test_content !== undefined);
    // @ts-ignore
    let content = await page.evaluate(() => globalThis.test_content);
    expect(content).toBe('{"nodes":["-7,7","7,7","0,0"],"members":["0,1","0,2","1,2"],"supports":{"0":"P","1":"Rh"},"forces":["2,-10,-30","2,10,0"],"workspace":{"workspace-width":20,"workspace-height":20,"workspace-width-pixels":320,"Yaxis-dist-from-left":10,"Xaxis-dist-from-bottom":8,"grid-x":1,"grid-y":1,"force-scale":5}}');

    loadName = 'test2';
    await page.evaluate(() => {
        if (document.body.firstElementChild != undefined) {
            document.body.firstElementChild.textContent = '';
        }
        globalThis.test_content = undefined;
    });
    await page.click('button:has-text("Import & Export")');
    await page.click('button:has-text("load from server")');
    await page.waitForFunction(() => document.body.firstElementChild?.textContent === 'save status: LOADED unsaved');

    await page.evaluate(() => {
        // @ts-ignore
        let test_loadFile = loadDataElem.files[0];
        let test_reader = new FileReader();
        test_reader.onload = (e) => {
            // @ts-ignore
            globalThis.test_content = e.target?.result;
        };
        test_reader.readAsText(test_loadFile);
    });

    // @ts-ignore
    await page.waitForFunction(() => globalThis.test_content !== undefined);
    // @ts-ignore
    content = await page.evaluate(() => globalThis.test_content);
    expect(content).toBe('{"nodes":["0,0","6,6","-6,6","-6,-6","6,-6"],"members":["0,1","0,2","0,3","0,4","1,2","2,3","3,4"],"supports":{"1":"Rh","2":"P"},"forces":["4,0,-12"],"workspace":{"workspace-width":20,"workspace-height":20,"workspace-width-pixels":320,"Yaxis-dist-from-left":10,"Xaxis-dist-from-bottom":10,"grid-x":1,"grid-y":1,"force-scale":6}}');

    // await page.screenshot({ path: 'temp.png' });
});
