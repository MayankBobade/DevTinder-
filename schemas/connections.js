const mongoose=require('mongoose')
const validator=require('validator')
mongoose.connect('mongodb+srv://bobademayank:AaxA3nXoCNnpnq4f@cluster0.qhqzb.mongodb.net/nodebackend1?retryWrites=true&w=majority&appName=Cluster0')

const connectionSchema=new mongoose.Schema({
    fromuserid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'user', 
    },
    touserid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user',
    },
    status:{
        type:String,
        enum: ["ignored", "interested", "accepted", "rejected"], 
    }
})

const connection=mongoose.model("connections",connectionSchema);

connectionSchema.pre("save",function(){
    if (this.fromuserid.equals(this.touserid)){
        throw new Error("You cannot connect with yourself")
    }
})

connectionSchema.index({fromuserid:1, touserid:1})
module.exports=connection;