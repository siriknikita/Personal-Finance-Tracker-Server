const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(express.json());

/**
 * @swagger
 * /api/email/feedback:
 *   post:
 *     summary: Send feedback email
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback:
 *                 type: string
 *                 description: The feedback content
 *               userEmail:
 *                 type: string
 *                 description: The email of the user sending the feedback
 *     responses:
 *       200:
 *         description: Feedback email has been successfully sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                 message:
 *                   type: string
 *                   description: Detailed error message
 */
router.post("/feedback", async (req, res) => {
  try {
    const { sendFeedbackEmail } = require("../controllers/sendEmail");
    const { feedback, userEmail } = req.body;
    await sendFeedbackEmail(feedback, userEmail);
    res
      .status(200)
      .json({ message: "Feedback email has been successfully sent" });
  } catch (error) {
    console.error("Error in sendFeedbackEmail route: " + error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

module.exports = router;