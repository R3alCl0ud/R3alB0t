const parse = require('jsdoc-to-markdown');

module.exports = class scanner {
    constructor(generator) {
        this.generator = generator;
    }

    scan(dir) {
        return new Promise((resolve, reject) => {
            const stream = parse({
                src: [`${dir}*.js`, `${dir}**/*.js`],
            });

            let json = '';
            stream.on('data', chunk => json += chunk.toString('utf-8'));
            stream.on('error', reject);
            stream.on('end', () => {
                json = JSON.parse(json);
                resolve(json);
            });
        });
    }
}