const jwt = require("jsonwebtoken");

exports.cookieJWTAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error(`Error verifying JWT: ${error}`);
    res.status(500).send("Error verifying JWT");
  }
};
