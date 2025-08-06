const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const bearerToken = token.split(" ")[1]; // "Bearer <token>"

    const decoded = jwt.verify(
      bearerToken,
      process.env.JWT_SECRET || "library_staff_secret"
    );

    req.id = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

module.exports = verifyToken;
