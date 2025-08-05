import jwt from "jsonwebtoken"

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.adminToken

  if (!token) {
    return res.status(401).json({ message: "Admin not authenticated!" })
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Admin token is not valid!" })
    }

    // Check if it's admin credentials
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Access denied!" })
    }

    req.adminId = payload.id
    next()
  })
}
