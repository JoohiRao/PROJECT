const User=require("../models/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


exports.registerUser=async(req,res)=>{
    try{
        const {name,email,password,role}=req.body
        const user=await User.findOne({email})
        if(user) return res.status(400).json({ message: "User already exists" });

        const hashedpwd=await bcrypt.hash(password,10)
        const newuser=new User({name,email,password:hashedpwd,role})
        await newuser.save()

        res.status(201).json({ message: "User registered successfully" });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
      }

}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({ 
      token, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tasksAssigned: user.tasksAssigned
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};