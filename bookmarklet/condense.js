const fs = require('fs').promises;

(async function() {
    try {
        let content = await fs.readFile('./save_extension.js', 'utf8');
        content = content.replace(new RegExp("\\ {4}", "g"), "");
        // console.log(content);
        console.log("javascript:" + encodeURIComponent(content));
    } catch (error) {
        console.log(error);
    }
})()
