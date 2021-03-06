const bcrypt = require("bcrypt");

async function  genereteHash (data) {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(data, salt);
    return hash;
}

async function confirmHash(data, hash) {
    return await bcrypt.compare(data, hash);
}

module.exports = {
    genereteHash, confirmHash
}