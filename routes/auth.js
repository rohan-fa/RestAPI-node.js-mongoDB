const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");   //it is a async function

//REGISTER
router.post("/register", async (req, res) => {
    try{
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
          });
    
        //save user and return response
        const user = await newUser.save();
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
});

//LOGIN
router.post("/login", async (req, res)=> {
    //so iam going to find this user here postname, email and password. next line we will use model User and will say findOne=> there is only one document inside in postman. So lets pass an object here ({email:req.body.email}). nextline we will say if there is no user like that && i am gonna say res.status(404). and i will say send("user not found").this part should be try and catch block.
    try {
        const user = await User.findOne({email:req.body.email})
        !user && res.status(404).json("user not found")
        
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(404).json("wrong password")

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})



//to use it index file lets export it
module.exports = router; 