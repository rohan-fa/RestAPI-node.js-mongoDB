const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//create a post

router.post("/",async (req,res) =>{
    const newPost = new Post(req.body);  //inside this post we can say req.body
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update a post
router.put("/:id", async (req,res)=>{
   try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.updateOne({$set:req.body});
        res.status(200).json("the post has been updated");
    }else{
        res.status(403).json("you can update only your post");
    }
   } catch (err) {
    res.status(500).json(err)
   }
    
});
//delete a post
router.delete("/:id", async (req,res)=>{
   try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.deleteOne({$set:req.body});
        res.status(200).json("the post has been deleted");
    }else{
        res.status(403).json("you can not delete your post");
    }
   } catch (err) {
    res.status(500).json(err)
   }
    
});
//like a post and dislike
router.put('/:id/like', async (req,res)=>{
    //and im going to find this post again
    try {
        const post = await Post.findById(req.params.id);
    //after finding the post we are going to check wether this post like array includes this user or not
        if(!post.likes.includes(req.body.userId)){
                //im going to updateOne push this userId
            await post.updateOne({$push:{likes:req.body.userId}});
            //and after that we will send this 
            res.status(200).json("the post has been liked")
        //we are going to make dislike in this same function, if this post.likes.inlcudes this userId then we can just pull item from this array 
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("this post has been disliked")
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//get a post
router.get("/:id", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id); //after finding this post
        res.status(200).json(post);
    } catch (err) {
        req.stale(500).json(err)
    }
})
//get timeline posts
router.get("/timeline/all", async(req,res)=>{

    try {
        //we are going to do something different here, instead of await=> we will use promise because we will have multiple promises,
        //firstly we will find the current user, 
        const currentUser = await User.findById(req.body.userId);
        //after that we will find all posts of this current user, to this postArray, 
        const userPosts = await Post.find({ userId: currentUser._id}); //becasue in the post model we have user id here means PostSchema, we will just try to find all post of this user
        //after that find all post of this followings, Promise.all()=> because will use map here
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId});   //retuen because it going to returen each post in this array
            })
        );
        //now we can concat this two array's
        res.json(userPosts.concat(...friendPosts)); //its going to take all posts from friend, and concat with this post
    } catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router;