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
        //because of some unnessearry objects are in postman like isAdmin, password elc let manage those
        const {password, updateAt, ...other} = user._doc    //it says user and document. user._doc carries our all objects here. like in the postman.so what we are going to do is send the other. we will not use password or updatedAt 
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(err)
    }
})
//FOLLOW A USER
router.put('/:id/follow', async (req,res)=> {
    if(req.body.userId !== req.params.id){
        try {
            //we are going to find user that has /:id => this id
            const user = await User.findById(req.params.id); //and also we are going to find the current user
            const currentUser = await User.findById(req.body.userId);//now we are going to controll something here
            if(!user.followers.includes(req.body.userId)){
                //if its not? 
                await user.updateOne({$push:{followers:req.body.userId}})   //because we are going to push id's from follorwers
                await currentUser.updateOne({$push:{followings:req.params.id}})  // going to do the same for current users
                res.status(200).json('user has beed followed')
            }else{
            req.status(403).json("you are already following")  //if the user that we are going to follow already in current user? we will give some other error here 
            }
        }catch (err) {
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("you can not follow yourself");
    
    }
});
//UNFOLLOW A USER

router.put('/:id/unfollow', async (req,res)=> {
    if(req.body.userId !== req.params.id){
        try {
            //we are going to find user that has /:id => this id
            const user = await User.findById(req.params.id); //and also we are going to find the current user
            const currentUser = await User.findById(req.body.userId);//now we are going to controll something here
            if(user.followers.includes(req.body.userId)){
                //if its not? 
                await user.updateOne({$pull:{followers:req.body.userId}})   //because we are going to pull id's from follorwers
                await currentUser.updateOne({$pull:{followings:req.params.id}})  // going to do the same for current users
                res.status(200).json('user has beed unfollowed')
            }else{
            req.status(403).json("you are not following")  //if the user that we are going to unfollow already in current user? we will give some other error here 
            }
        }catch (err) {
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("you can not unfollow yourself");
    
    }
});




//to use it index file lets export it
module.exports = router;