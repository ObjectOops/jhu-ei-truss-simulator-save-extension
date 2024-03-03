const fs = require('fs').promises;

(async function() {
    try {
        let content = await fs.readFile('./save_extension.js', 'utf8');
        console.log("javascript:" + encodeURIComponent(content));
    } catch (error) {
        console.log(error);
    }
})()
