const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto('https://cerebrium.ai/', { waitUntil: 'networkidle2' });

        const details = await page.evaluate(() => {
            const getStr = (el) => {
                if (!el) return null;
                const s = window.getComputedStyle(el);
                return {
                    bg: s.backgroundColor,
                    color: s.color,
                    font: s.fontFamily,
                    fontSize: s.fontSize,
                    fontWeight: s.fontWeight,
                    letterSpacing: s.letterSpacing,
                    textTransform: s.textTransform
                };
            };

            const h1 = document.querySelector('h1');
            const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText);
            const mainCanvas = document.querySelector('canvas') || document.querySelector('video');
            const buttons = Array.from(document.querySelectorAll('a, button')).slice(0, 5).map(b => getStr(b));

            const firstSection = document.querySelector('section');

            return {
                body: getStr(document.body),
                h1: h1 ? { text: h1.innerText, style: getStr(h1) } : null,
                h1HTML: h1 ? h1.outerHTML : null,
                navClasses: document.querySelector('nav') ? document.querySelector('nav').className : null,
                mainSectionClasses: firstSection ? firstSection.className : null,
                h2s,
                canvasElement: mainCanvas ? mainCanvas.outerHTML : null,
                buttons
            };
        });

        console.log(JSON.stringify(details, null, 2));
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
