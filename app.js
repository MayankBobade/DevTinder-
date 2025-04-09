const connectDB=require('./database.js');
const express=require('express');
const app=express();

const user=require('./schemas/user.js');
const validator=require("validator");
const{userValidation}=require("./uservalidation.js");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { userauth } = require('./middlewares/auth.js');
const { cookieVerifier } = require('./middlewares/cookieverification.js');
const cookieParser = require("cookie-parser");



connectDB().then(()=>{
    app.listen(7777,()=>{
        console.log("successfully  connected to database and server is listening at port 7777");
    })
}).catch((err)=>{
    console.error("couldnot connect to the database")
})


//now writing functionalities for my application
app.use(express.json());
app.use(cookieParser());

// on sign up page,ie creating a new user,ie adding a new user to database

// In your route file (app.js or similar)
app.post("/signup", async (req, res) => {
    try {
        await userValidation(req);

        const { firstName, lastName, email, password, age, gender } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new user({
            firstName,
            lastName,
            email,
            password: hashPassword,
            age: Number(age), // Ensure age is stored as a number
            gender
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });
    } catch (err) {
        // Handle duplicate email error (MongoDB error code 11000)
        if (err.code === 11000) {
            return res.status(400).send("Email already exists");
        }
        // Handle other errors
        res.status(400).send(err.message);
    }
});
// okay so now i have my users in the collection ,
// writing feed api's to fetch the users in the feed

app.get("/feed",cookieVerifier, async (req, res) => {
    const { email } = req.user; // Changed from req.body.email to req.query.email
    try {
        const foundUser = await user.find({ email: email });
        res.send(foundUser);
    } catch {
        res.send("could not find the user");
    }
});
//now writing an api to delete account,ie to delete the user from the database
app.delete("/deleteaccount", cookieVerifier, async (req, res) => {
    const { email } = req.user;
    try {
        
        const deletedUser = await user.findOneAndDelete({ email: email });
      
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }

        // 3. Clear cookie BEFORE sending response
        // 4. Use correct cookie name 'token' 
        // 5. Include cookie options if they were set during initial creation
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        // 6. Send success response after cookie clearance
        res.send("User deleted successfully");
    } catch (err) {
        // 7. More appropriate status code for server errors
        console.error("Delete account error:", err);
        res.status(500).send("Cannot delete the user");
    }
});


app.patch("/updateinfo",cookieVerifier, async (req, res) => {
    
    try {
        const { email } = req.user;
        const updateFields = {};
        
        // List of allowed fields to update
        const allowedFields = ['firstName', 'lastName', 'age', 'gender', 'password'];
        
        // Prepare update object
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                // Special handling for password
                if (field === 'password') {
                    const hashPassword = await bcrypt.hash(req.body.password, 10);
                    updateFields.password = hashPassword;
                } else {
                    updateFields[field] = req.body[field];
                }
            }
        }

        // Validate age if being updated
        if (updateFields.age !== undefined) {
            const ageNum = Number(updateFields.age);
            if (isNaN(ageNum) || ageNum < 18) {
                return res.status(400).json({ error: "Age must be a number ≥ 18" });
            }
            updateFields.age = ageNum;
        }

        const updatedUser = await user.findOneAndUpdate(
            { email: email },
            { $set: updateFields },
            { 
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.send(updatedUser);
    } catch (err) {
        res.status(500).send(`Could not update the user info: ${err.message}`);
    }
});

app.post("/login",userauth, async (req, res) => {
    try {
        const {email}=req.body;
        const token = jwt.sign({ email:email }, "devTinder", { expiresIn: "1h" });

        
        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    //now note that we are sending cookie when we are logging in and in other api's we should just verify the tocken
    
});



app.get("/profile", cookieVerifier, async (req, res) => {
    try {
      // Safety check for req.user
      if (!req.user) {
        return res.status(401).json({ error: "User data missing" });
      }
  
          

      const { email } = req.user;
      const usercred = await user.findOne({ email });
  
      if (!usercred) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(usercred);
    } catch (error) {
      console.error("Profile Route Error:", error); // Critical for debugging
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  });
