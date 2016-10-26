class baseItem {
    constructor(parent, info) {
        this.parent = parent;
        this.registerData(info);
    }
    
    registerData() {
        return;
    }
    
    serialize() {
        return;
    }
}

module.exports = baseItem;