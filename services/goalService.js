const { Goal } = require("../models");

async function addGoal(userID, description, deadline) {
  try {
    const newGoal = await Goal.create({
      userID,
      description,
      deadline,
    });

    return newGoal;
  } catch (error) {
    console.error("[ADD GOAL] Error: " + error);
  }
}

async function getGoals(userID) {
  try {
    const data = await Goal.findAll({ where: { userID: userID } });
    console.log("goals", data);
    return data;
  } catch (error) {
    console.error("[GET GOALS] Error: " + error);
  }
}

module.exports = {
  addGoal,
  getGoals,
};
