const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const cookie = req.cookies; 

        const decodedToken = jwt.verify(cookie.token, "devTinder");

     
        req.email = decodedToken.email;

        next();
    } catch (error) {
        res.status(401).send("Unauthorized: Invalid token");
    }
};

module.exports =  auth ; //not inside curly braces because it's a midd;leware and if we export it insede curly braces then it will become an object and willnot work as middleware
