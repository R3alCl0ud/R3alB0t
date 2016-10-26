const fs = require('fs-extra');
const parse = require('jsdoc-parse');
const DocScanner = require('./scanner');
const compress = false;
const Documentation = require('./docs');
const custom = require('../custom/index');
const zlib = require('zlib'); 

const Scanner = new DocScanner(this);

function parseDocs(json) {
  console.log(`${json.length} items found`);
  const documentation = new Documentation(json, custom);
  console.log('serializing');
  let output = JSON.stringify(documentation.serialize(), null, 0);
  if (compress) {
    console.log('compressing');
    output = zlib.deflateSync(output).toString('utf8');
  }
  if (!process.argv.slice(2).includes('silent')) {
    console.log('writing to docs.json');
    fs.writeFileSync('./docs/docs.json', output);
  }
  console.log('done!');
  process.exit(0);
}


Scanner.scan('./lib/').then(console.log).catch(console.log);