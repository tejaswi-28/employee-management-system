const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Get the user's role from the request (set by authMiddleware)

      if (allowedRoles.includes(userRole)) {
        next(); // User has the required role, proceed to the next handler
      } else {
        return res.status(403).json({ message: 'Forbidden' }); // User does not have permission
      }
    };
  };

  module.exports = roleMiddleware;