const express=require("express")
const dotenv=require("dotenv")
const cors=require("cors")
const connectdb=require("./config/db")
const authRoutes=require("./routes/authRoutes")
const teamRoutes = require("./routes/teamRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes=require("./routes/userRoutes")
const viewRoutes=require("./routes/viewRoutes")


dotenv.config()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

connectdb()

app.get("/",(req,res)=>{
    res.send("ehyyy")
})

app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes)
app.use("/api/admin", adminRoutes);
app.use("/api/user",userRoutes);
app.use("/api/t",viewRoutes)
app.listen(5000)

