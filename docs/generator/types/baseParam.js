const baseItem = require('./baseItem');
const baseVariable = require('./baseVariable');

class baseParam extends baseItem {

    registerData(info) {
        super.registerData(info);
        this.data = info
        this.data.type = new baseVariable(this, info.type);
    }
    serialize() {
        super.serialize();
        const {name, description, type, optional} = this.data;
        return {
            name,
            description,
            optional,
            type: type.serialize(),
        };
    }
}