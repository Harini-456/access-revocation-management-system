const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())

const secretCode = "ruejkdfl#$%^hfkjd"
mongoose.connect("mongodb://localhost:27017/demo-db").then(()=>{console.log("database connected")})
.catch((err)=>{console.log(err)})
/*app.get("/",(req,res) =>{
    res.send("RMS");
})*/
//user creation 
const userSchema =mongoose.Schema({
    name: String,
    email: String,
    role: String,
    age: Number,
    password: String
})


const requestSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    requestedOn: {
        type: Date,
        default: Date.now
    },
    actionTakenOn: Date,
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    requestedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    statusReceived: String
});
const Request = mongoose.model("Request",requestSchema)
const User =  mongoose.model("user",userSchema)

function auth(req,res,next){

     const authorization = req.headers.authorization;
    if(!authorization){
        return res.json({"message": "Authorization"})
    }
    try{
        const token = authorization.split(" ")[1]
        const decode = jwt.verify(token, secretCode)
        req.user = decode.user
        next()

    } catch(err){
        return res.json({"message":"Token is invaliid or expired"})
    }
}
app.post('/users/signup', async(req, res) => {
    const name = req.body.name
    const email = req.body.email
    const role = req.body.role
    const age = req.body.age
    const password = req.body.password

  if (!email || !password) {
        return res.json({"message":"invalid request"})
    }
  else if (role!= "manager" && role!= "employee"){
     return res.json({"message":"invalid request"})
  }
  else if(password.length <= 5){
     return res.json({"message":"invalid request"})
  }

  
    const userCheck = await User.findOne({email:req.body.email})
    console.log("userCheck: ",userCheck)
        if(userCheck){
            return res.json({"mesage":"email already exists"})
        }

  const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({
        name: name,
        email: email,
        password: hashPassword,
        role: role,
        age: age
    })
    await user.save()
    return res.json({"message":"success"})
})

app.post('/revoke-request/create',auth, async (req,res) => {

        const title = req.body.title;
        const description = req.body.description
        const requestedTo = req.body.requestedTo

        if(!title || !description || !requestedTo){
            return res.json({"message":"Please send all details"})
        }

        const request = Request({
            title: title,
            description: description,
            status: "PENDING",
            requestedBy: req.user,
            requestedTo:requestedTo,
        });
        await request.save()
        return res.json({message: "Request created"})

    })

app.get('/revoke-request/myrequests',auth, async(req,res) => {
    const requests = await Request.find({requestedBy: req.user})
    res.json({"requests":requests})
})
app.get('/revoke-request/myPendingrequests', auth,async(req,res) => {
    const requests = await Request.find({requestedBy: req.user,status:"PENDING"})
})
app.post("/users/login", async(req,res) => {
    console.log(req.body)
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.json({message: "Email is invalid"})
    }
    const isPasswordMatching = await bcrypt.compare(req.body.password , user.password)
    if(!isPasswordMatching){
        return res.json({"message":"password invalid"})
    }
    try{
    const token = jwt.sign(
        {user: user._id},
        secretCode,
        {expiresIn:"1h"}
    )
    return res.json({message:"login sucessfull",token: token})
}
catch(err){
    console.log(err)
    return res.json({"message":"Server error"})
}
})


app.listen(3000)