const puppeteer = require('puppeteer');
const fs = require('fs');
const downloader = require('image-downloader');

function getLagestImageFromSrcSet(srcSet) {
    const splitedSrcs = srcSet.split(',');
    const imgSrc = splitedSrcs[splitedSrcs.length - 1 ].split(' ')[0];
    return imgSrc
}

async function getImageUrlsFromPage(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const imageSrcSets = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('article img'));
        const srcSetAttribute = imgs.map(i => i.getAttribute('srcset'));
        return srcSetAttribute;
    })

    const imgUrls = imageSrcSets.map(srcSet => getLagestImageFromSrcSet(srcSet));
    await browser.close();
    return imgUrls;
}

async function main() {
    const resultFolder = './result';
    if (!fs.existsSync(resultFolder)) {
        fs.mkdirSync(resultFolder);
    }

    // const instaUrl =  'https://www.instagram.com/hot_sexy_asian_girrls/';
    const instaUrl = 'https://www.instagram.com/hauyenn/';
    const images = await getImageUrlsFromPage(instaUrl);
    // console.log(images);
    images.forEach((image) => {
        downloader({
            url: image,
            dest: resultFolder
        })
    })
}

main();