const fs = require("fs/promises");
const read = async (filePath, key) => {
    try {
        let base = await fs.readFile(filePath, "utf8");
        base = JSON.parse(base);
        return base[key];
    } catch (error) {
        return [];
    }
}

const write = async (filePath, data, key) => {
    let base = {};
     base[key] = data;
     await fs.writeFile(filePath, JSON.stringify(base));
}

module.exports = {read, write}