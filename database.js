
const mongoose = require('mongoose'); 
const connectDB=async()=>{

    await mongoose.connect('mongodb+srv://bobademayank:AaxA3nXoCNnpnq4f@cluster0.qhqzb.mongodb.net/nodebackend1?retryWrites=true&w=majority&appName=Cluster0')

} 
module.exports = connectDB; 