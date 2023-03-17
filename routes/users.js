const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
//in the user roots we are going to add some request title here

//UPDATE USER
//router and its going to be put because it is an updating process, lets say / and then id. it will allow us to choose any id's here, any user id
router.put("/:id", async(req,res)=>{
    //fistly we are going to varify if the user id does not match with this id, we are going to return some error. In the block if the user id === matches with /:id and i will check wether its admin or not, req.user.isAdmin. we know a user can update any information in UserSchema. But you remember? we have password issues here so for that
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
           //if user try to update password, i am gonna try and generate this password
            try{
                const salt = await bcrypt.genSalt(10);
                //and after that we are going to update the password
                res.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(404).json("sorry")
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body})    //inside we will give user id=>(req.params.id). {$set:req.body})=> its going set all inputs inside this body. 
            res.status(200).json("account has been updated")
        }catch(err){
            return res.status(500).json("err");
        }
    
    }else{
        return res.status(403).json("You can update only your account")
    }
})
//DELETE USER
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
            
        try{
            await User.findByIdAndDelete(req.params.id)     
            res.status(200).json("account has been deleted")
        }catch(err){
            return res.status(500).json("err");
        }
    
    }else{
        return res.status(403).json("You can delete only your account")
    }
})
//GET USER
router.get("/:id", async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(err)
    }
})
//FOLLOW A USER
//UNFOLLOW A USER





//to use it index file lets export it
module.exports = router;