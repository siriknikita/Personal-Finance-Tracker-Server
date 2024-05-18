const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const database = require('../database');

router.use(bodyParser.json());
router.use(express.json());

router.get('/get/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        const goals = await database.getGoals(userID);
        res.json({ goals: goals });
    } catch (error) {
        console.error(`Error getting goals: ${error}`);
        res.status(500);
    }
});

router.post('/set', async (req, res) => {
    try {
        // TODO: Use object destructuring instead
        const userID = req.body.userID;
        const goalDescription = req.body.goal;
        const goalDate = req.body.deadline;

        const response = await database.addGoal(
            userID,
            goalDescription,
            goalDate
        );
        if (response) {
            res.json({ message: 'Goal set successfully' });
        }
    } catch (error) {
        console.error(`Error setting goal: ${error}`);
        res.status(500);
    }
});

module.exports = router;
