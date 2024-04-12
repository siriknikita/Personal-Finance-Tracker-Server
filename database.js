const sql = require("mssql");
const moment = require("moment");
require("dotenv").config();

var config = {
    user: "finance-tracker-admin",
    password: "Database-PFT-password",
    server: "personalfinancetracker-database.database.windows.net",
    database: "personalfinancetrcker",
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

async function getUser(email) {
    try {
        let pool = await sql.connect(config);
        let user = await pool.request()
            .input('email', sql.VarChar, email)
            .query(
                `SELECT *
                FROM Users
                WHERE email = @email`
            );
        console.log(user.recordset[0]);
        return user.recordset[0];
    } catch (error) {
        console.log("Error: " + error);
    }
}

async function createUser(username, email, passwordHash) {
    try {
        let pool = await sql.connect(config);
        let datetime = moment().format("YYYY-MM-DD HH:mm:ss.zzz") + "000";
        const user = await getUser(email);
        if (user) {
            return "User already exists";
        }
        const response = await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('passwordHash', sql.VarChar, passwordHash)
            .query(
                `INSERT INTO Users (username, email, passwordHash, registrationDate)
                VALUES (@username, @email, @passwordHash, '${datetime}')`
            );
        if (response.rowsAffected[0] === 1) {
            const user = await getUser(email);
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.log("[CREATE USER] Error: " + error);
    }
}

async function loginUser(email, password) {
    const user = await getUser(email);
    if (user.passwordHash === password) {
        return user;
    } else {
        return null;
    }
}

async function getTransactionCategoriesIDByUserID(userID) {
    try {
        let pool = await sql.connect(config);
        let categories = await pool.request()
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
        console.log("[GET TRANSACTION CATEGORIES ID BY USER ID] Error: " + error);
    }
}

async function getTransactionCategoriesIDByUserID(userID) {
    try {
        let pool = await sql.connect(config);
        let categories = await pool.request()
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
        console.log("[GET TRANSACTION CATEGORIES ID BY USER ID] Error: " + error);
    }
}

async function getTransactionCategoriesIDByUserID(userID) {
    try {
        let pool = await sql.connect(config);
        let categories = await pool.request()
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
        console.log("[GET TRANSACTION CATEGORIES ID BY USER ID] Error: " + error);
    }
}

async function getCategoryNameByID(categoryID) {
    try {
        let pool = await sql.connect(config);
        let categoryName = await pool.request()
            .input('categoryID', sql.Int, categoryID)
            .query(
                `SELECT categoryName
                FROM Categories
                WHERE categoryID = @categoryID`
            );
        return categoryName.recordset[0].categoryName;
    } catch (error) {
        console.log("[GET CATEGORY NAME BY ID] Error: " + error);
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

async function getTransactionMoneyByUserID(userID) {
    try {
        let pool = await sql.connect(config);
        let moneySpent = await pool.request()
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
        console.log("[GET TRANSACTION MONEY BY USER ID] Error: " + error);
    }
}

async function addTransaction(userID, amount, categoryID) {
    try {
        let pool = await sql.connect(config);
        let response = await pool.request()
            .input('userID', sql.Int, userID)
            .input('amount', sql.Decimal, amount)
            .input('categoryID', sql.Int, categoryID)
            .query(
                `INSERT INTO Transactions (userID, amount, categoryID)
                VALUES (@userID, @amount, @categoryID)`
            );
        if (response.rowsAffected[0] === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("[ADD TRANSACTION] Error: " + error);
    }
}

async function getTransactionsByID(userID) {
    try {
        let pool = await sql.connect(config);
        let transactions = await pool.request()
            .input('userID', sql.Int, userID)
            .query(
                `SELECT *
                FROM Transactions
                WHERE userID = @userID`
            );
        return transactions.recordset;
    } catch (error) {
        console.log("[GET TRANSACTIONS BY ID] Error: " + error);
    }
}

async function getTotalSpent(userID) {
    try {
        let pool = await sql.connect(config);
        let totalSpent = await pool.request()
            .input('userID', sql.Int, userID)
            .query(
                `SELECT totalSpent
                FROM Users
                WHERE userID = @userID`
            );
        return totalSpent.recordset[0].totalSpent;
    } catch (error) {
        console.log("[GET TOTAL SPENT] Error: " + error);
    }
}

async function updateTotalMoneySpentByUserID(userID, amount) {
    try {
        let totalSpent = await getTotalSpent(userID);
        let updateAmount = parseFloat(amount);
        let updatedTotalSpent = totalSpent + updateAmount;
        let pool = await sql.connect(config);
        let response = await pool.request()
            .input('updatedTotalSpent', sql.Decimal, updatedTotalSpent)
            .input('userID', sql.Int, userID)
            .query(
                `UPDATE Users
                SET totalSpent = @updatedTotalSpent
                WHERE userID = @userID`
            );
        if (response.rowsAffected[0] === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("[UPDATE TOTAL SPENT BY USER ID] Error: " + error);
    }
}

async function updateEmail(currentEmail, newEmail) {
    try {
        let pool = await sql.connect(config);
        let response = await pool.request()
            .input('newEmail', sql.VarChar, newEmail)
            .input('currentEmail', sql.VarChar, currentEmail)
            .query(
                `UPDATE Users
                SET email = @newEmail
                WHERE email = @currentEmail`
            );
        if (response.rowsAffected[0] === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("[UPDATE EMAIL] Error: " + error);
    }
}

async function updatePassword(email, newPassword) {
    try {
        let pool = await sql.connect(config);
        let response = await pool.request()
            .input('newPassword', sql.VarChar, newPassword)
            .input('email', sql.VarChar, email)
            .query(
                `UPDATE Users
                SET passwordHash = @newPassword
                WHERE email = @email`
            );
        if (response.rowsAffected[0] === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("[UPDATE PASSWORD] Error: " + error);
    }
}

async function updateUsername(email, currentUsername, newUsername) {
    try {
        let pool = await sql.connect(config);
        let user = await getUser(email);
        if (user.username === currentUsername) {
            let response = await pool.request()
                .input('newUsername', sql.VarChar, newUsername)
                .input('email', sql.VarChar, email)
                .query(
                    `UPDATE Users
                    SET username = @newUsername
                    WHERE email = @email`
                );
            if (response.rowsAffected[0] === 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log("[UPDATE USERNAME] Error: " + error);
    }
}

async function addGoal(userID, description, deadline) {
    try {
        let pool = await sql.connect(config);
        let response = await pool.request()
            .input('userID', sql.Int, userID)
            .input('description', sql.VarChar, description)
            .input('deadline', sql.Date, deadline)
            .query(
                `INSERT INTO Goals (userID, goalDescription, deadline)
                VALUES (@userID, @description, @deadline)`
            );
        if (response.rowsAffected[0] === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("[ADD GOAL] Error: " + error);
    }
}

async function getGoals(userID) {
    try {
        let pool = await sql.connect(config);
        let goals = await pool.request()
            .input('userID', sql.Int, userID)
            .query(
                `SELECT *
                FROM Goals
                WHERE userID = @userID`
            );
        return goals.recordset;
    } catch (error) {
        console.log("[GET GOALS] Error: " + error);
    }
}

module.exports = {
    getUser,
    createUser,
    loginUser,
    getCategoryNameByID,
    getTransactionCategoriesByUserID,
    getTransactionMoneyByUserID,
    addTransaction,
    getTransactionsByID,
    getTotalSpent,
    updateTotalMoneySpentByUserID,
    updateEmail,
    updatePassword,
    updateUsername,
    addGoal,
    getGoals
};
