const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const database = require('../database');

router.use(bodyParser.json());
router.use(express.json());

router.get('/get/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const transactions = await database.getTransactionsByID(userID);
        res.json({ transactions: transactions });
    } catch (error) {
        console.error(`Error getting transactions: ${error}`);
        res.status(500);
    }
});

router.get('/get/moneySpent/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        const moneySpent = await database.getTransactionMoneyByUserID(userID);
        res.json({ moneySpent: moneySpent });
    } catch (error) {
        console.error(`Error getting total spent: ${error}`);
        res.status(500);
    }
});

router.get('/get/moneySpent/categories/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        const moneySpentOnEachCategory =
            await database.getMoneySpentOnEachCategory(userID);
        res.json({ data: moneySpentOnEachCategory });
    } catch (error) {
        console.error(`Error getting money spent on each category: ${error}`);
        res.status(500);
    }
});

router.get('/get/spendings/top5', async (req, res) => {
    try {
        const top5SpendingsFreq = await database.getTop5CategoriesFrequencies();
        res.json({
            top5Spendings: top5SpendingsFreq,
        });
    } catch (error) {
        console.error(`Error getting top 5 spendings: ${error}`);
        res.status(500);
    }
});

router.get('/get/categories/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        const categories = await database.getTransactionCategoriesByUserID(
            userID
        );
        res.json({ categories: categories });
    } catch (error) {
        console.error(`Error getting transaction categories: ${error}`);
        res.status(500);
    }
});

router.post('/add', async (req, res) => {
    try {
        // TODO: Use object destructuring instead
        const userID = req.body.userID;
        const amount = req.body.amount;
        const categoryID = req.body.categoryID;

        const response = await database.addTransaction(
            userID,
            amount,
            categoryID
        );
        if (response) {
            res.json({ message: 'Transaction added successfully' });
        }
    } catch (error) {
        console.error(`Error adding transaction: ${error}`);
        res.status(500);
    }
});

module.exports = router;
