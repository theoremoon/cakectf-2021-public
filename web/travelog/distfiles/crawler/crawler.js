// REDUCTED

const crawl = async (post_url) => {
    if (!post_url.match(/\/post\/[0-9a-f]{32}\/[0-9a-f]{32}$/)) {
        return;
    }
    const url = base_url + post_url;

    const browser = await puppeteer.launch(browser_option);
    try {
        const page = await browser.newPage();
        page.setUserAgent(flag); // [!] steal this flag
        await page.goto(url, {timeout: 3000});
        await wait(3000);
        await page.close();
    } catch(e) { }

    await browser.close();
}

// REDUCTED
