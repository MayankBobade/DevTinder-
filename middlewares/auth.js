const jwt =require("jsonwebtoken");
const validator=require("validator");
const bcrypt=require("bcrypt")

const userauth=async(err,req,res,next)=>{
const {email,password}=req.body;
useremail=email;
//now once we have found the email and password we need to check if the user exist in the database and then compare the passsword
if(!validator.isEmail(email)){
    res.status(400).send("please enter the valid emailId")
}

const userdata=await userauth.findOne({email});
const userpassword=userdata.password;
const IsCorrectPassword=await bcrypt.compare(userpassword,password);
if(!IsCorrectPassword){
    res.status(401).send("Incorrect pasword, Please enter the correct passwprd")
}
next();
}

module.exports={userauth};
