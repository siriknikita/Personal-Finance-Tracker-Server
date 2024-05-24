const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const service = require("../services/goalService");

router.use(bodyParser.json());
router.use(express.json());

/**
 * @swagger
 * /api/goals/get/{userID}:
 *   get:
 *     summary: Retrieve goals for a specific user
 *     tags: [Goals]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose goals to retrieve
 *     responses:
 *       200:
 *         description: Goals retrieved successfully
 *       500:
 *         description: Error retrieving goals
 */
router.get("/get/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    const goals = await service.getGoals(userID);
    res.json({ goals: goals });
  } catch (error) {
    console.error(`Error getting goals: ${error}`);
    res.status(500);
  }
});

/**
 * @swagger
 * /api/goals/set:
 *   post:
 *     summary: Add a new goal for a user
 *     tags: [Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *               goalDescription:
 *                 type: string
 *               goalDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Goal set successfully
 *       500:
 *         description: Error setting goal
 */
router.post("/set", async (req, res) => {
  try {
    const { userID, goalDescription, goalDate } = req.body;

    const response = await service.addGoal(userID, goalDescription, goalDate);
    if (response) {
      res.json({ message: "Goal set successfully" });
    }
  } catch (error) {
    console.error(`Error setting goal: ${error}`);
    res.status(500);
  }
});

module.exports = router;
