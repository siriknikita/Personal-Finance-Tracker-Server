const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { createUser, loginUser } = require("../services/userService");
const { User } = require("../models");

router.use(bodyParser.json());
router.use(express.json());

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Error registering user
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await createUser(username, email, password);
    if (newUser === "User already exists") {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(`Error registering user: ${error}`);
    res.status(500).send("Error registering user");
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isGoogle:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Error logging in user
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, isGoogle } = req.body;
    const user = await loginUser(email, password, isGoogle);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = password === user.passwordHash;
    if (!isMatch && !isGoogle) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("The passwords did match");

    const token = jwt.sign(
      { id: user.userID, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("The token is: ", token);

    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Logged in successfully", token: token, user: user });
  } catch (error) {
    console.error(`Error logging in user: ${error}`);
    res.status(500).send("Error logging in user");
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching user details
 */
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error(`Error fetching user details: ${error}`);
    res.status(500).send("Error fetching user details");
  }
});

module.exports = router;
