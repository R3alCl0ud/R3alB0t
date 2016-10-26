const parse = require('jsdoc-parse');

module.exports = class scanner {
    constructor(generator) {
        this.generator = generator;
    }

    scan(directory) {
        return new Promise((resolve, reject) => {
            const stream = parse({src: [`${directory}*.js`, `${directory}*/*.js`, `${directory}**/*.js`]});

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