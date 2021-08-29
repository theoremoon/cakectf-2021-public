const puppeteer = require('puppeteer');
const Redis = require('ioredis');
const connection = new Redis(6379, 'redis');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const flag = process.env.flag || "CakeCTF{**** TEST FLAG *****}";
const base_url = "http://challenge:8080";
const browser_option = {
    headless: true,
    args: [
        '-wait-for-browser',
        '--no-sandbox', '--disable-gpu',
        '--js-flags="--noexpose_wasm"'
    ]
}

const crawl = async (post_url) => {
    if (!post_url.match(/\/post\/[0-9a-f]{32}\/[0-9a-f]{32}$/)) {
        return;
    }
    const url = base_url + post_url;
    console.log(`[+] Crawl: ${url}`);

    const browser = await puppeteer.launch(browser_option);
    try {
        const page = await browser.newPage();
        await page.setCookie({
            "domain":"challenge:8080",
            "name":"flag",
            "value":flag,
            "sameSite":"Strict",
            "httpOnly":false,
            "secure":false
        });
        await page.goto(url, {timeout: 3000});
        await wait(3000);
        await page.close();
    } catch(e) {
        console.log("[-] " + e);
    }

    await browser.close();
}

const handle = () => {
    connection.blpop('query', 0, async (err, message) => {
        try {
            await crawl(message[1]);
            setTimeout(handle, 10);
        } catch (e) {
            console.log("[-] " + e);
        }
    });
};

handle();
