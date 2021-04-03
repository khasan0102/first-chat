const express = require("express");
const app = express();
const path = require("path");
const getUser = require("./routes/getUser");
const sendMessage = require("./routes/sendMessage");
const { genereteHash, confirmHash } = require("./modules/crpyt");
const cookieParser = require("cookie-parser");
const { read, write } = require("./modules/readBase");
require("dotenv").config();
const basePath = path.join(__dirname, "database.json");
const port = process.env.PORT;
const ejs = require("ejs");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "public"));
app.use(express.static("public"));
app.use(getUser);
app.use(sendMessage);
app.use(cookieParser());

app.get("/", async (req, res) => {
    res.render("index.html");
});
app.get("/login", async (req, res) => {
    res.render("login.html");
});
app.get("/signup", async (req, res) => {
    res.render("signup.html");
});

app.post("/signup", async (req, res) => {
    try {
        let users = await read(basePath, "users");
        let { username, password } = req.body;
        if (username && password) {
            username = username.toLowerCase();
            let hash = await genereteHash(password);
            if (users.find((x) => x.username === username))
                throw new Error("User already exists");
            let user = {
                username,
                password: hash,
                id: users.length + 1,
                roomIds: [],
            };
            users.push(user);
            write(basePath, users, "users");
            res.status(200).json({
                username,
                id: user.id,
            });
        } else {
            res.status(400).json({ message: "Redired signup" });
        }
    } catch (e) {
        res.status(400).json({ message: e + "" });
    }
});

app.post("/login", async (req, res) => {
    try {
        let { username, password } = req.body;
        console.log(req.body);
        if (username && password) {
            let users = await read(basePath, "users");
            username = username.toLowerCase();
            let user = users.find((x) => x.username === username);
            if (!user) throw new Error("User not found");
            let isTrue = await confirmHash(password, user.password);
            if (isTrue) {
                res.status(200).json({
                    username,
                    id: user.id,
                });
            } else {
                res.status(400).json({ message: "Redired signup" });
            }
        } else {
            res.status(404).json({ message: "Login or passwword not found" });
        }
    } catch (e) {
        res.status(400).json({ message: e + "" });
    }
});
app.listen(port, () => console.log("Server has been started port " + port));
