const { Goal } = require('../models');

async function addGoal(userID, description, deadline) {
    try {
        const newGoal = await Goal.create({
            userID,
            description,
            deadline
        });

        return newGoal;
    } catch (error) {
        console.log('[ADD GOAL] Error: ' + error);
    }
}

async function getGoals(userID) {
    try {
        return await Goal.findAll({ where: { userID } });
    } catch (error) {
        console.log('[GET GOALS] Error: ' + error);
    }
}

module.exports = {
    addGoal,
    getGoals
};
