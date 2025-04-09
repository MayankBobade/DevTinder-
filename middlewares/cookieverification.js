const jwt=require("jsonwebtoken");
const cookieVerifier = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token found" });

    const decoded = jwt.verify(token,"devTinder");
    const{email}=decoded;
    // Add null checks for decoded data
    if (!email) {
      return res.status(401).json({ error: "Invalid token structure" });
    }

    req.user = decoded; // Attach to request object
    next();
  } catch (err) {
    console.error("Middleware Error:", err); // Log error details
    return res.status(401).json({ error: "Authentication failed" });
  }
};
module.exports={cookieVerifier};