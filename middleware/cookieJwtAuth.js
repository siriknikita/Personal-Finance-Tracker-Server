const jwt = require("jsonwebtoken");

exports.cookieJWTAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in cookieJWTAuth: ", error);
    res.clearCookie("token");
    res.status(401).send("Unauthorized");
  }
};
