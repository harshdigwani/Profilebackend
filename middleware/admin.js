module.exports = function (req, res, next) {

  if (!req.user.isAdmin) return res.status(403).json({
    "status": 403,
    "ok": false,
    "message": "Access Denied."
  });
  next();
}