const fs = require('fs').promises;
const minify = require('@minify-js/node');

(async function() {
    try {
        let content = await fs.readFile('./save_extension.js', 'utf8');
        // content = content.replace(new RegExp("\\ {4}", "g"), "");
        buffer = minify.minify("global", Buffer.from(content));
        // console.log(buffer.toString());
        console.log("javascript:" + encodeURIComponent(buffer.toString()));
    } catch (error) {
        console.log(error);
    }
})()
