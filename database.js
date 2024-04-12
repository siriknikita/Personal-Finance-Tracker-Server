const sql = require("mssql");
require("dotenv").config();

var config = {
    user: "finance-tracker-admin",
    password: "Database-PFT-password",
    server: "personalfinancetracker-database.database.windows.net",
    database: "personalfinancetracker",
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
        console.log(user);
    } catch (error) {
        console.log("Error: " + error);
    }
}

// function getUser(email) {
//     var request = new sql.Request();
//     const response = request.query(
//         `SELECT *
//         FROM Users
//         WHERE email = ?`,
//         [email],
//         function (error, recordset) {
//             if (error) {
//                 console.log("Error: " + error);
//             } else {
//                 console.log(recordset);
//                 return recordset;
//             }
//         }
//     );
//     return response;
// }

// function createUser(username, email, passwordHash) {
//     const [insertID] = connection.query(
//         `INSERT INTO Users (username, email, passwordHash) 
//         VALUES (?, ?, ?)`,
//         [username, email, passwordHash]
//     );
//     return insertID;
// }

async function loginUser(email, password) {
    const user = await getUser(email);
    if (user.passwordHash === password) {
        return user;
    } else {
        return null;
    }
}

// function getTransactionCategoriesIDByUserID(userID) {
//     const [categoriesRequest] = connection.query(
//         `SELECT categoryID
//         FROM Transactions
//         WHERE userID = ?`,
//         [userID]
//     );
//     let categoriesID = [];
//     for(let i = 0; i < categoriesRequest.length; i++) {
//         categoriesID.push(categoriesRequest[i].categoryID);
//     }
//     return categoriesID;
// }

// function getCategoryNameByID(categoryID) {
//     const [categoryNameRequest] = connection.query(
//         `SELECT categoryName
//         FROM Categories
//         WHERE categoryID = ?`,
//         [categoryID]
//     );
//     const categoryNameJSON = categoryNameRequest[0];
//     return categoryNameJSON.categoryName;
// }

// function getTransactionCategoriesByUserID(userID) {
//     const categoriesID = getTransactionCategoriesIDByUserID(userID);
//     let categoriesList = [];
//     for(let i = 0; i < categoriesID.length; i++) {
//         const categoryName = getCategoryNameByID(categoriesID[i]);
//         categoriesList.push(categoryName);
//     }
//     return categoriesList;
// }

// function getTransactionMoneyByUserID(userID) {
//     const [moneySpentObj] = connection.query(
//         `SELECT amount
//         FROM Transactions
//         WHERE userID = (?)`,
//         [userID]
//     );
//     let moneySpent = [];
//     for(let i = 0; i < moneySpentObj.length; i++) {
//         moneySpent.push(moneySpentObj[i].amount);
//     }
//     return moneySpent;
// }

// function addTransaction(userID, amount, categoryID) {
//     const [rows] = connection.query(
//         `INSERT INTO Transactions (userID, amount, categoryID)
//         VALUES (?, ?, ?);`,
//         [userID, amount, categoryID]
//     );
//     return true;
// }

// function getTransactionsByID(userID) {
//     const [rows] = connection.query(
//         `SELECT *
//         FROM Transactions
//         WHERE userID = ?`,
//         [userID]
//     );
//     return rows;
// }

// function getTotalSpent(userID) {
//     const [totalSpentRequest] = connection.query(
//         `SELECT totalSpent
//         FROM Users
//         WHERE userID = (?)`,
//         [userID]
//     );
//     return totalSpentRequest[0].TotalSpent;
// }

// // async function updateTotalMoneySpentByUserID(userID, amount) {
// //     const totalSpentString = await getTotalSpent(userID);
// //     const totalSpent = parseFloat(totalSpentString);
// //     const updateAmount = parseFloat(amount);
// //     const updatedTotalSpent = totalSpent + updateAmount;
// //     const [rows] = await connection.query(
// //         `UPDATE Users
// //         SET TotalSpent = ?
// //         WHERE UserID = ?`,
// //         [updatedTotalSpent, userID]
// //     );
// //     return true;
// // }

// function updateEmail(currentEmail, newEmail) {
//     const [rows] = connection.query(
//         `UPDATE Users
//         SET email = ?
//         WHERE email = ?`,
//         [newEmail, currentEmail]
//     );
//     return true;
// }

// function updatePassword(email, currentPassword, newPassword) {
//     const user = getUser(email);
//     if (user.PasswordHash === currentPassword) {
//         const [rows] = connection.query(
//             `UPDATE Users
//             SET passwordHash = ?
//             WHERE email = ?`,
//             [newPassword, email]
//         );
//         return true;
//     } else {
//         return false;
//     }
// }

// function updateUsername(email, currentUsername, newUsername) {
//     const user = getUser(email);
//     if (user.Username === currentUsername) {
//         const [rows] = connection.query(
//             `UPDATE Users
//             SET username = ?
//             WHERE email = ?`,
//             [newUsername, email]
//         );
//         return true;
//     } else {
//         return false;
//     }
// }

// function addGoal(userID, description, deadline) {
//     const [rows] = connection.query(
//         `INSERT INTO Goals (userID, goalDescription, deadline)
//         VALUES (?, ?, ?)`,
//         [userID, description, deadline]
//     );
//     return true;
// }

// async function getGoals(userID) {
//     const [rows] = await connection.query(
//         `SELECT *
//         FROM Goals
//         WHERE userID = ?`,
//         [userID]
//     );
//     return rows;
// }

module.exports = {
    getUser,
    // createUser,
    loginUser,
    // getCategoryNameByID,
    // getTransactionCategoriesByUserID,
    // getTransactionMoneyByUserID,
    // addTransaction,
    // getTransactionsByID,
    // getTotalSpent,
    // // updateTotalMoneySpentByUserID,
    // updateEmail,
    // updatePassword,
    // updateUsername,
    // addGoal,
    // getGoals
};
