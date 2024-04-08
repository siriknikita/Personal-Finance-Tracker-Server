const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

app.post("/api/signup", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordHash = req.body.passwordHash;

    try {
        const user = await database.createUser(username, email, passwordHash);
        res.json({ user: user });
    } catch (error) {
        console.error(`Error creating a user: ${error}`);
        res.status(500);
    }
});

app.get("/api/login/:email/:passwordHash", async (req, res) => {
    const email = req.params.email;
    const passwordHash = req.params.passwordHash;

    try {
        const user = await database.loginUser(email, passwordHash);
        if (user) {
            res.json({ user: user });
        } else {
            res.json({ message: "Invalid email or password" })
        }
    } catch (error) {
        console.error(`Error logging in: ${error}`);
        res.status(500);
    }
});

app.get("/api/get/user/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const user = await database.getUser(email);
        res.json({ user: user });
    } catch (error) {
        console.error(`Error getting a user: ${error}`);
        res.status(500);
    }
});

app.listen(PORT, () => { console.log(`Server starts on port ${PORT}...`) });
