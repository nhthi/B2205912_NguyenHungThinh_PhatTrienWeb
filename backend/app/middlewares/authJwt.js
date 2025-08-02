const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("🔐 [verifyToken] Received token header:", token);

  if (!token) {
    console.warn("⛔ No token provided!");
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const bearerToken = token.split(" ")[1]; // "Bearer <token>"
    console.log("🔑 Extracted bearer token:", bearerToken);

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
