const { Router } = require("express");
const router = Router();
const path = require("path");
const { read, write } = require("../modules/readBase");
const basePath = path.join(__dirname, "..", "database.json");
const dataPath = path.join(__dirname, "..", "data.json");

router.get("/users/:username", async (req, res) => {
    let users = await read(basePath, "users");
    let { username } = req.params;
    users = users.filter((x) => x.username !== username);
    let response = [];
    for (let el of users) {
        response.push({ username: el.username, id: el.id });
    }
    res.status(200).json(response);
});

router.get("/get/roomId/:fId/:sId", async (req, res) => {
    try {
        let users = await read(basePath, "users");
        let data = await read(dataPath, "data");
        let firstUser = users.find((x) => x.id === req.params.fId - 0);
        let secondUser = users.find((y) => y.id === req.params.sId - 0);
        let response = { roomId: data.length + 1, messages: [] };
        if (!firstUser || !secondUser) {
            res.status(400).json({message: "User is not defined"});
        } else {
            let roomId = findID(firstUser.roomIds, secondUser.roomIds);
            if (!roomId) {
                data.push(response);
                firstUser.roomIds.push(response.roomId);
                secondUser.roomIds.push(response.roomId);
                write(dataPath, data, "data");
                write(basePath, users, "users");
                res.status(200).json(response);
            } else {
                let response = data.find((x) => x.roomId == roomId);
                res.status(200).json(response);
            }
        }
    } catch (e) {
        return e + "";
    }
});

function findID(array1 = [], array2 = []) {
    let isTrue = false;
    for (let el1 of array1) {
        for (let el2 of array2) {
            if (el1 === el2) {
                isTrue = el2;
                break;
            }
        }
        if (isTrue) break;
    }
    return isTrue;
}

module.exports = router;
