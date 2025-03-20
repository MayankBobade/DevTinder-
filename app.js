const connectDB=require('./database.js');
const express=require('express');
const app=express();

const user=require('./schemas/user.js');
const validator=require("validator");
const{userValidation}=require("./uservalidation.js");
const bcrypt=require('bcrypt');


connectDB().then(()=>{
    app.listen(7777,()=>{
        console.log("successfully  connected to database and server is listening at port 7777");
    })
}).catch((err)=>{
    console.error("couldnot connect to the database")
})


//now writing functionalities for my application
app.use(express.json());
// on sign up page,ie creating a new user,ie adding a new user to database

app.post("/signup",async(req,res)=>{
 try{
    userValidation(req);

    const{firstName,lastName,email,password,age,gender}=req.body;
    const hashpassword=bcrypt.hash(password,10);
    
    const newUser=new user({firstName,lastName,email,hashpassword,age,gender})
    console.log(req.body);
    const mail=req.body.email;

    // below is api level validation,commented out becaue we are testing schema level validations,and uservalidationjs
    
    // if(!validator.isEmail(mail)){
    //     res.status(400).send("invalid email address")
    // }

    await newUser.save({ runValidators: true })

  res.status(201).json({
    message: "User saved successfully",
    user: newUser
  });
}catch(err){
    res.send(err.message);
}
})

// okay so now i have my users in the collection ,
// writing feed api's to fetch the users in the feed

app.get("/feed", async (req, res) => {
    const mail = req.query.email; // Changed from req.body.email to req.query.email
    try {
        const foundUser = await user.find({ email: mail });
        res.send(foundUser);
    } catch {
        res.send("could not find the user");
    }
});



//now writing an api to delete account,ie to delete the user from the database

app.delete("/deleteaccount", async (req, res) => {
    const mail = req.query.email; // Changed from req.body.email to req.query.email
    try {
        const deleteduser = await user.findOneAndDelete({ email: mail });
        res.send("user deleted successfully");
    } catch (err) {
        res.status(400).send("cannot delete the user");
    }
});


app.patch("/updateinfo", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const userupd = await user.findOneAndUpdate(
            { email: userEmail },
            { $set: { firstName: req.body.firstName } } ,
            { returnDocument:'after',runValidators:true,}
        );

        if (!userupd) {
            return res.status(404).send("User not found");
        }

        res.send(userupd);
    } catch (err) {
        res.status(500).send(`Could not update the user info: ${err.message}`);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Please enter a valid email ID" });
        }

        const usercred = await User.findOne({ email });

        if (!usercred) {
            return res.status(404).json({ error: "Could not find the user" });
        }

        const isPasswordMatched = await bcrypt.compare(password, usercred.password);

        if (!isPasswordMatched) {
            return res.status(401).json({ error: "Invalid password" });
        }

        res.status(200).json(usercred);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
