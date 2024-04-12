const express = require('express');
const database = require('./database');
const bodyParser = require('body-parser');
// const cors = require('cors');
const app = express();

app.use(bodyParser.json());

// app.use(cors());
// app.use(
//     cors({
//         origin: "http://localhost:3000",
//         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//         credentials: true
//     })
// );

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello World from server!");
});

app.get("/api/signup/:username/:email/:passwordHash", async (req, res) => {
    const username = req.params.username;
    const email = req.params.email;
    const passwordHash = req.params.passwordHash;

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
        if (!user) {
            res.status(404).json({ user: {}, message: "User not found" });
        }
        res.json({ user: user });
    } catch (error) {
        console.error(`Error logging in: ${error}`);
        res.status(500).json({ message: `Error logging in: ${error}` });
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

app.post("/api/add/transaction", async (req, res) => {
    const userID = req.body.userID;
    const amount = req.body.amount;
    const categoryID = req.body.categoryID;

    try {
        const response = await database.addTransaction(userID, amount, categoryID);
        if (response) {
            res.json({ message: "Transaction added successfully" });
        }
    } catch (error) {
        console.error(`Error adding transaction: ${error}`);
        res.status(500);
    }
});

app.post("/api/update/email", async (req, res) => {
    const email = req.body.email;
    const newEmail = req.body.newEmail;

    try {
        const response = await database.updateEmail(email, newEmail);
        if (response) {
            res.json({ message: "Email updated successfully" });
        }
    } catch (error) {
        console.error(`Error updating email: ${error}`);
        res.status(500);
    }
});

app.post("/api/update/password", async (req, res) => {
    const email = req.body.email;
    const newPasswordHash = req.body.newPasswordHash;

    try {
        const response = await database.updatePassword(email, newPasswordHash);
        if (response) {
            res.json({ message: "Password updated successfully" });
        }
    } catch (error) {
        console.error(`Error updating password: ${error}`);
        res.status(500);
    }
});

app.post("/api/update/username", async (req, res) => {
    const email = req.body.email;
    const currentUsername = req.body.currentUsername;
    const newUsername = req.body.newUsername;

    try {
        const response = await database.updateUsername(email, currentUsername, newUsername);
        if (response) {
            res.json({ message: "Username updated successfully" });
        }
    } catch (error) {
        console.error(`Error updating username: ${error}`);
        res.status(500);
    }
});

app.post("/api/set/goal", async (req, res) => {
    const userID = req.body.userID;
    const goalDescription = req.body.goal;
    const goalDate = req.body.deadline;

    try {
        const response = await database.addGoal(userID, goalDescription, goalDate);
        if (response) {
            res.json({ message: "Goal set successfully" });
        }
    } catch (error) {
        console.error(`Error setting goal: ${error}`);
        res.status(500);
    }
});

app.get("/api/get/goals/:userID", async (req, res) => {
    const userID = req.params.userID;

    try {
        const goals = await database.getGoals(userID);
        res.json({ goals: goals });
    } catch (error) {
        console.error(`Error getting goals: ${error}`);
        res.status(500);
    }
});

app.get("/api/get/transactions/:userID", async (req, res) => {
    const userID = req.params.userID;

    try {
        const transactions = await database.getTransactionsByID(userID);
        res.json({ transactions: transactions });
    } catch (error) {
        console.error(`Error getting transactions: ${error}`);
        res.status(500);
    }
});

app.get("/api/get/transactions/moneySpent/:userID", async (req, res) => {
    const userID = req.params.userID;

    try {
        const moneySpent = await database.getTransactionMoneyByUserID(userID);
        res.json({ moneySpent: moneySpent });
    } catch (error) {
        console.error(`Error getting total spent: ${error}`);
        res.status(500);
    }
});

app.get("/api/get/transactions/categories/:userID", async (req, res) => {
    const userID = req.params.userID;

    try {
        const categories = await database.getTransactionCategoriesByUserID(userID);
        res.json({ categories: categories });
    } catch (error) {
        console.error(`Error getting transaction categories: ${error}`);
        res.status(500);
    }
});

app.listen(PORT, () => { console.log(`Server starts on port ${PORT}...`) });
