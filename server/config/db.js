const mongoose=require("mongoose")
const dotenv=require("dotenv")

dotenv.config()

const connectdb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected")
    }
    catch(err){
        console.log("error while connecting")
    }
}

module.exports=connectdb;