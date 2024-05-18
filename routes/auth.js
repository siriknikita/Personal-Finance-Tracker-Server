const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const database = require('../database');

router.use(bodyParser.json());
router.use(express.json());

// Use POST methods instead of GET to send data in body
// TODO: Use object destructuring instead
router.get("/signup/:username/:email/:passwordHash/", async (req, res) => {
  try {
    const username = req.params.username;
    const email = req.params.email;
    const passwordHash = req.params.passwordHash;
        const user = await database.createUser(username, email, passwordHash);
        res.status(200).json({ user: user });
    } catch (error) {
        console.error(`[SIGNUP] Error creating a user: ${error}`);
        res.status(500);
    }
});

router.get('/login/:email/:password/:isGoogle/:isAdmin', async (req, res) => {
    try {
        // TODO: Use object destructuring instead
        const email = req.params.email;
        const password = req.params.password;
        const isGoogle = req.params.isGoogle;
        const isAdmin = req.params.isAdmin;

        const user = await database.getUser(email);

        if (!user) {
            return res
                .status(404)
                .json({ user: {}, message: 'User not found' });
        }
        if (
            (isGoogle === 'true' && user.email === email) ||
            user.passwordHash === password
        ) {
            const newUser = { ...user, isAdmin: isAdmin };
            return res.json({ user: newUser });
        } else {
            return res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error(`Error logging in: ${error}`);
        return res.status(500).json({ message: `Error logging in: ${error}` });
    }
});

module.exports = router;
