const { Router } = require("express");
const router = Router();
const path = require("path");
const { read, write } = require("../modules/readBase");
const basePath = path.join(__dirname, "..", "database.json");
const dataPath = path.join(__dirname, "..", "data.json");

router.post("/sendMessage/:roomId/:username/:type", async (req, res) => {
    try {
        let { roomId, username, type } = req.params;
        let { message } = req.body;
        if (roomId && username && type && message) {
            let data = await read(dataPath, "data");
            let users = await read(basePath, "users");
            let room = data.find((x) => x.roomId === roomId - 0);
            let user = users.find((y) => y.username === username);
            if (!room) res.status(404).send("This room not found");
            if (!user) res.status(404).send("This user not found");
            let isTrue = user.roomIds.includes(roomId - 0);
            if (!isTrue) {
                res.status(400).json({message: "Ivalid roomId"});
            } else {
                let response = {
                    username,
                    message,
                    type,
                    id: room.messages.length + 1,
                };
                room.messages.push(response);
                write(dataPath, data, "data");
                res.json({message: "ok"});
            }
        } else {
            res.status(400).json({message: "Bad request"});
        }
    } catch (e) {}
});

module.exports = router;
