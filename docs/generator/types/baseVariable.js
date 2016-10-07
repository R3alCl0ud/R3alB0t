const baseItem = require('./baseItem');

const regex = /([\w]+)([^\w]+)/;
const regexG = /([\w]+)([^\w]+)/g;

function splitVarName(str) {
  if (str === '*') {
    return ['*', ''];
  }
  const matches = str.match(regexG);
  const output = [];
  if (matches) {
    for (const match of matches) {
      const groups = match.match(regex);
      output.push([groups[1], groups[2]]);
    }
  } else {
    output.push([str.match(/(\w+)/g)[0], '']);
  }
  return output;
}

class baseVariable extends baseItem {
    registerData(data) {
        super.registerData(data);
        this.data = data;
    }

    serialize() {
        super.serialize();
        const names = [];
        for (const name of this.data.names) {
            names.push(splitVarName(name));
        }
        return {
            types: names,
        };
    }
}
