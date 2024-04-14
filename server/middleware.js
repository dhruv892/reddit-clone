const authMiddleware = (req, res, next) => {
	// Checks the session for a userId
	console.log("######################", req.session);
	if (!req.session.userId) {
		return res.status(403).json({
			message: "Unauthorized from middleware",
		});
	}
	next();
};

module.exports = {
	authMiddleware,
};
