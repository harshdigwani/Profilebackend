const jwt = require('jsonwebtoken');
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({
    "status": 401,
    "ok": false,
    "message": "Access Denied. No Token provided..."
  });

  try {
    const payload = jwt.verify(token, jwtPrivateKey);
    req.user = payload;
    next();
  }
  catch (err) {
    res.status(400).json({
      "status": 400,
      "ok": false,
      "message": "Invalid token"
    });
  }
}