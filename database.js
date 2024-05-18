const sql = require('mssql');
const moment = require('moment');
require('dotenv').config();

// TODO: Split functions into different files based on functionality block

const config = {
    user: 'finance-tracker-admin',
    password: 'Database-PFT-password',
    server: 'personalfinancetracker-database.database.windows.net',
    database: 'personalfinancetrcker',
    authentication: {
        type: 'default',
    },
    options: {
        encrypt: true,
    },
};

// User section
async function getUser(email) {
    try {
        const pool = await sql.connect(config);
        let user = await pool
            .request()
            .input('email', sql.VarChar, email)
            .query(
                `SELECT *
                FROM Users
                WHERE email = @email`
            );
        return user.recordset[0];
    } catch (error) {
        console.log('Error: ' + error);
    }
}

async function getUsers() {
    try {
        const pool = await sql.connect(config);
        let users = await pool.request().query('SELECT * FROM Users');
        return users.recordset;
    } catch (error) {
        console.log('[GET USERS] Error: ' + error);
    }
}

async function createUser(username, email, passwordHash) {
    try {
        const pool = await sql.connect(config);
        let datetime = moment().format('YYYY-MM-DD HH:mm:ss.zzz') + '000';
        const user = await getUser(email);
        if (user) {
            return 'User already exists';
        }
        const response = await pool
            .request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('passwordHash', sql.VarChar, passwordHash)
            .query(
                `INSERT INTO Users (username, email, passwordHash, registrationDate, isAuthorized)
                VALUES (@username, @email, @passwordHash, '${datetime}', 1)`
            );
        if (response.rowsAffected[0] === 1) {
            const user = await getUser(email);
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.log('[CREATE USER] Error: ' + error);
    }
}

async function loginUser(email, password) {
    const user = await getUser(email);
    if (user.passwordHash === password) {
        try {
            const pool = await sql.connect(config);
            await pool.request().query(
                `UPDATE Users
                    SET isAuthorized = 1
                    WHERE email = '${email}'`
            );
            return user;
        } catch (error) {
            console.log('[LOGIN USER] Error: ' + error);
        }
    } else {
        return null;
    }
}

// Transactions section
async function getTransactionCategoriesIDByUserID(userID) {
    try {
        const pool = await sql.connect(config);
        let categories = await pool
            .request()
            .input('userID', sql.Int, userID)
            .query(
                `SELECT categoryID
                FROM Transactions
                WHERE userID = @userID`
            );
        let categoriesID = [];
        for (let i = 0; i < categories.recordset.length; i++) {
            categoriesID.push(categories.recordset[i].categoryID);
        }
        return categoriesID;
    } catch (error) {
        console.log(
            '[GET TRANSACTION CATEGORIES ID BY USER ID] Error: ' + error
        );
    }
}

async function getCategoryNameByID(categoryID) {
    try {
        const pool = await sql.connect(config);
        let categoryName = await pool
            .request()
            .input('categoryID', sql.Int, categoryID)
            .query(
                `SELECT name
                FROM Categories
                WHERE id = @categoryID`
            );
        return categoryName.recordset[0].name;
    } catch (error) {
        console.log('[GET CATEGORY NAME BY ID] Error: ' + error);
    }
}

async function getTransactionCategoriesByUserID(userID) {
    const categoriesID = await getTransactionCategoriesIDByUserID(userID);
    let categoriesList = [];
    for (let i = 0; i < categoriesID.length; i++) {
        const categoryName = await getCategoryNameByID(categoriesID[i]);
        categoriesList.push(categoryName);
    }
    return categoriesList;
}

async function getCategoriesList() {
    try {
        const pool = await sql.connect(config);
        let categories = await pool.request().query('SELECT * FROM Categories');
        return categories.recordset;
    } catch (error) {
        console.log('[GET CATEGORIES LIST] Error: ' + error);
    }
}

async function getUniqueCategoriesList(userID) {
    const categories = await getTransactionCategoriesByUserID(userID);
    const categoriesSet = new Set(categories);
    const uniqueCategoriesList = Array.from(categoriesSet);
    return uniqueCategoriesList;
}

async function getTransactionMoneyByUserID(userID) {
    try {
        const pool = await sql.connect(config);
        let moneySpent = await pool
            .request()
            .input('userID', sql.Int, userID)
            .query(
                `SELECT amount
                FROM Transactions
                WHERE userID = @userID`
            );
        let moneySpentList = [];
        for (let i = 0; i < moneySpent.recordset.length; i++) {
            moneySpentList.push(moneySpent.recordset[i].amount);
        }
        return moneySpentList;
    } catch (error) {
        console.log('[GET TRANSACTION MONEY BY USER ID] Error: ' + error);
    }
}

async function getMoneySpentOnEachCategory(userID) {
    const categories = await getTransactionCategoriesByUserID(userID);
    const moneySpent = await getTransactionMoneyByUserID(userID);
    let moneySpentOnEachCategory = {};
    for (let i = 0; i < categories.length; i++) {
        if (moneySpentOnEachCategory[categories[i]]) {
            moneySpentOnEachCategory[categories[i]] += moneySpent[i];
        } else {
            moneySpentOnEachCategory[categories[i]] = moneySpent[i];
        }
    }
    return moneySpentOnEachCategory;
}

async function addTransaction(userID, amount, categoryID) {
    try {
        const pool = await sql.connect(config);
        let response = await pool
            .request()
            .input('userID', sql.Int, userID)
            .input('categoryID', sql.Int, categoryID)
            .input('amount', sql.Decimal, amount)
            .query(
                `INSERT INTO Transactions (userID, categoryID, amount)
                VALUES (@userID, @categoryID, @amount)`
            );
        if (response.rowsAffected[0] === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log('[ADD TRANSACTION] Error: ' + error);
    }
}

async function getTransactionsByID(userID) {
    console.log('[GET TRANSACTIONS BY ID] userID: ' + userID);
    try {
        const pool = await sql.connect(config);
        let transactions = await pool
            .request()
            .input('userID', sql.Int, userID)
            .query(
                `SELECT *
                FROM Transactions
                WHERE userID = @userID`
            );
        return transactions.recordset;
    } catch (error) {
        console.log('[GET TRANSACTIONS BY ID] Error: ' + error);
    }
}

async function getTotalSpent(userID) {
    try {
        const pool = await sql.connect(config);
        let totalSpent = await pool
            .request()
            .input('userID', sql.Int, userID)
            .query(
                `SELECT totalSpent
                FROM Users
                WHERE userID = @userID`
            );
        return totalSpent.recordset[0].totalSpent;
    } catch (error) {
        console.log('[GET TOTAL SPENT] Error: ' + error);
    }
}

async function updateTotalMoneySpentByUserID(userID, amount) {
    try {
        let totalSpent = await getTotalSpent(userID);
        let updateAmount = parseFloat(amount);
        let updatedTotalSpent = totalSpent + updateAmount;
        const pool = await sql.connect(config);
        let response = await pool
            .request()
            .input('updatedTotalSpent', sql.Decimal, updatedTotalSpent)
            .input('userID', sql.Int, userID)
            .query(
                `UPDATE Users
                SET totalSpent = @updatedTotalSpent
                WHERE userID = @userID`
            );
        return response.rowsAffected[0] === 1;
    } catch (error) {
        console.log('[UPDATE TOTAL SPENT BY USER ID] Error: ' + error);
    }
}

// Update control section
async function updateEmail(currentEmail, newEmail) {
    try {
        const pool = await sql.connect(config);
        let response = await pool
            .request()
            .input('newEmail', sql.VarChar, newEmail)
            .input('currentEmail', sql.VarChar, currentEmail)
            .query(
                `UPDATE Users
        SET email = @newEmail
                WHERE email = @currentEmail`
            );
        return response.rowsAffected[0] === 1;
    } catch (error) {
        console.log('[UPDATE EMAIL] Error: ' + error);
    }
}

async function updatePassword(email, newPassword) {
    try {
        const pool = await sql.connect(config);
        let response = await pool
            .request()
            .input('newPassword', sql.VarChar, newPassword)
            .input('email', sql.VarChar, email)
            .query(
                `UPDATE Users
                SET passwordHash = @newPassword
                WHERE email = @email`
            );
        return response.rowsAffected[0] === 1;
    } catch (error) {
        console.log('[UPDATE PASSWORD] Error: ' + error);
    }
}

async function updateUsername(email, currentUsername, newUsername) {
    try {
        const pool = await sql.connect(config);
        let user = await getUser(email);
        if (user.username === currentUsername) {
            let response = await pool
                .request()
                .input('newUsername', sql.VarChar, newUsername)
                .input('email', sql.VarChar, email)
                .query(
                    `UPDATE Users
          SET username = @newUsername
          WHERE email = @email`
                );
            return response.rowsAffected[0] === 1;
        } else {
            return false;
        }
    } catch (error) {
        console.log('[UPDATE USERNAME] Error: ' + error);
    }
}

// Goals section
async function addGoal(userID, description, deadline) {
    try {
        const pool = await sql.connect(config);
        let response = await pool
            .request()
            .input('userID', sql.Int, userID)
            .input('description', sql.NVarChar, description)
            .input('deadline', sql.Date, deadline)
            .query(
                `INSERT INTO Goals (userID, description, deadline)
                VALUES (@userID, @description, @deadline)`
            );
        return response.rowsAffected[0] === 1;
    } catch (error) {
        console.log('[ADD GOAL] Error: ' + error);
    }
}

async function getGoals(userID) {
    try {
        const pool = await sql.connect(config);
        let goals = await pool
            .request()
            .input('userID', sql.Int, userID)
            .query(
                `SELECT *
        FROM Goals
                WHERE userID = @userID`
            );
        return goals.recordset;
    } catch (error) {
        console.log('[GET GOALS] Error: ' + error);
    }
}

async function getMoneySpentByCategoryID(categoryID) {
    try {
        const pool = await sql.connect(config);
        let moneySpent = await pool
            .request()
            .input('categoryID', sql.Int, categoryID)
            .query(
                `SELECT amount
                    FROM Transactions
                    WHERE categoryID = @categoryID`
            );
        let moneySpentList = [];
        for (let i = 0; i < moneySpent.recordset.length; i++) {
            moneySpentList.push(moneySpent.recordset[i].amount);
        }
        return moneySpentList;
    } catch (error) {
        console.log('[GET MONEY SPENT BY CATEGORY ID] Error: ' + error);
    }
}

async function getTop5FrequentCategories() {
    try {
        const pool = await sql.connect(config);
        let categories = await pool.request().query(
            `SELECT TOP 5 categoryID, COUNT(categoryID) as count
                FROM Transactions
                GROUP BY categoryID
                ORDER BY count DESC`
        );
        return categories.recordset;
    } catch (error) {
        console.log(
            '[GET TOP 5 FREQUENT SPENDINGS CATEGORIES] Error: ' + error
        );
    }
}

async function getTop5CategoriesFrequencies() {
    try {
        let categories = await getTop5FrequentCategories();
        let top5CategoriesFrequencies = {};
        for (let i = 0; i < categories.length; i++) {
            const categoryName = await getCategoryNameByID(
                categories[i].categoryID
            );
            top5CategoriesFrequencies[categoryName] = categories[i].count;
        }
        return top5CategoriesFrequencies;
    } catch (error) {
        console.log('[GET TOP 5 CATEGORIES FREQUENCIES] Error: ' + error);
    }
}

async function getTop5CategoriesNames() {
    try {
        let categories = await getTop5FrequentCategories();
        let top5CategoriesNames = [];
        for (let i = 0; i < categories.length; i++) {
            const categoryName = await getCategoryNameByID(
                categories[i].categoryID
            );
            top5CategoriesNames.push(categoryName);
        }
        return top5CategoriesNames;
    } catch (error) {
        console.log('[GET TOP 5 CATEGORIES NAMES] Error: ' + error);
    }
}

async function getUsersSpending() {
    try {
        const pool = await sql.connect(config);
        let usersSpending = {};
        const categories = await getCategoriesList();
        for (let i = 0; i < categories.length; i++) {
            const moneySpent = await getMoneySpentByCategoryID(
                categories[i].id
            );
            usersSpending[categories[i].name] = moneySpent;
        }
        return usersSpending;
    } catch (error) {
        console.log('[GET USERS SPENDING] Error: ' + error);
    }
}

async function getTotalUsersSpending() {
    try {
        let totalUsersSpending = {};
        const categories = await getCategoriesList();
        for (let i = 0; i < categories.length; i++) {
            const moneySpent = await getMoneySpentByCategoryID(
                categories[i].id
            );
            let totalSpent = 0;
            for (let j = 0; j < moneySpent.length; j++) {
                totalSpent += moneySpent[j];
            }
            totalUsersSpending[categories[i].name] = totalSpent;
        }
        return totalUsersSpending;
    } catch (error) {
        console.log('[GET TOTAL USERS SPENDING] Error: ' + error);
    }
}

module.exports = {
    getUser,
    getUsers,
    createUser,
    loginUser,
    getCategoryNameByID,
    getTransactionCategoriesByUserID,
    getTransactionMoneyByUserID,
    getMoneySpentOnEachCategory,
    addTransaction,
    getTransactionsByID,
    getTotalSpent,
    getUniqueCategoriesList,
    getTop5FrequentCategories,
    getTop5CategoriesNames,
    getTop5CategoriesFrequencies,
    updateTotalMoneySpentByUserID,
    updateEmail,
    updatePassword,
    updateUsername,
    addGoal,
    getGoals,
    getTotalUsersSpending,
};
