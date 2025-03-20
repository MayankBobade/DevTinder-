const mongoose=require('mongoose');
const validator=require("validator");
mongoose.connect('mongodb+srv://bobademayank:AaxA3nXoCNnpnq4f@cluster0.qhqzb.mongodb.net/nodebackend1?retryWrites=true&w=majority&appName=Cluster0')
const userschema=new mongoose.Schema({
    firstName:{
        type:String,
        maxLength:25,
    },
    lastName:{
        type:String,
        maxLength:25,
    },
    email:{
        type:String,
        Lowercase:true,
        require:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw newError("ERROR not a valid mail")
            }
        },
       
    },
    password:{
        type:String,
        // validate(value){
        //     if(!validator.isStrongPassword(value)){
        //         throw newError("ERROR: "+err.message)
        //     }
        // }

    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    },

});

const usermodule=mongoose.model("user",userschema); //name of the collection, schema of the collection
module.exports=usermodule;

