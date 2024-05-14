const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const database = require("../database");

router.use(bodyParser.json());
router.use(express.json());

router.get("/get/users", async (req, res) => {
  try {
    const users = await database.getUsers();
    res.json({ users: users });
  } catch (error) {
    console.error(`Error getting users: ${error}`);
    res.status(500);
  }
});

router.get("/get/usersSpending", async (req, res) => {
  try {
    const usersSpending = await database.getTotalUsersSpending();
    res.json({ usersSpending: usersSpending });
  } catch (error) {
    console.error(`Error getting users spending: ${error}`);
    res.status(500);
  }
});

module.exports = router;
