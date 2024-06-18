const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log(req.headers);

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to authenticate token", message: err.message });
    }

    req.user_id = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  });
};

module.exports = verifyToken;
