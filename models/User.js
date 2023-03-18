const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type:String,
            require: true,
            min:3,      //minimum three character for name
            max:20,
            unique:true
        },
        email:{
            type:String,
            required:true,
            max:50,
            unique:true,
        },
        password: {
            type:String,
            required:true,
            min:6,
        },
        profilePicture:{
            type:String,
            default:"",
    
        },
        coverPicture:{
            type:String,
            default:"",
        },
        followers:{
            type:Array,     //because we are going to keep users ids inside of this 
            default:[],
        },
        followings:{
            type:Array,     //because we are going to keep users ids inside of this 
            default:[],
        },
        isAdmin:{
            type:Boolean,
            default: false,     //when we create a user its not going to be admin, its going to be false
        },
        desc:{
            type:String,
            max:50,
        },
        city:{
            type:String,
            max:50,
        },
        from:{
            type:String,
            max:50,
        },
        relationship:{
            type:Number,
            enum:[1,2,3]           //1.single 2. married
        },
    },
    {timestamps:true},
    );

module.exports = mongoose.model("User", UserSchema);    //indise this write model name("User") and UserSchema,now lets create timestamps. whenever you create user or update it, its going to automaticallu update our timestamps

