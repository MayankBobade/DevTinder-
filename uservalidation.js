//all the api level validations are now offloaded to this file 
const validator=require("validator");
const userValidation=(req)=>{
    const{firstName,lastName,email,password,age,gender}=req.body;

    if(!firstName||!lastName){
        throw newError("please enter the complete credentials");
    }
    if(!validator.isEmail(email)){
        throw newError("please enter the correct emailID");
    }
    if(!validator.isStrongPassword(password)){
        throw newError("please enter a strong password,containing atleast one lowercase,uppercase,special character");
    }
    if(age<18){
        throw newError("minimum age to register on our paltform is : 18 years ");
    }
    if(!gender){
        throw newError("please enter the complete credentials");
    }
}

module.exports={userValidation}