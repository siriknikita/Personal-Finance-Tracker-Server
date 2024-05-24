const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const fs = require("fs");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Personal Finance Tracker API",
        version: "1.0.0",
        description: "API for the Personal Finance Tracker application",
    },
};

const routesPath = path.join(process.cwd(), 'routes');
if (!fs.existsSync(routesPath)) {
    throw new Error(`Routes directory does not exist: ${routesPath}`);
}

const routeFiles = fs.readdirSync(routesPath).filter(file => file.endsWith('.routes.js'));
if (routeFiles.length === 0) {
    throw new Error(`No .routes.js files found in routes directory: ${routesPath}`);
}

// console.log("Route files found:", routeFiles);

const options = {
    swaggerDefinition,
    apis: routeFiles.map(file => path.join(routesPath, file)),
};

// console.log("Swagger options:", options);

try {
    const swaggerSpec = swaggerJSDoc(options);
    // console.log("Generated Swagger spec:", swaggerSpec);
    module.exports = swaggerSpec;
} catch (error) {
    console.error("Error generating Swagger specification:", error);
    throw error;
}
