// userValidation.js
const validator = require("validator");
const userValidation = (req) => {
    const { firstName, lastName, email, password, age, gender } = req.body;

    // Check all required fields are present
    if (!firstName || !lastName || !email || !password || age === undefined || !gender) {
        throw new Error("Please enter all required fields");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Please enter a valid email address");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password must contain at least one lowercase, uppercase, special character, and be at least 8 characters long");
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) ){
        throw new Error("Age must be a valid number");
    }
    if (ageNum < 18) {
        throw new Error("Minimum age to register is 18 years");
    }
};

module.exports = { userValidation };
