const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")

dotenv.config();    //so its ready to use  

mongoose.set("strictQuery", false);
mongoose.connect(
    process.env.MONGO_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true },()=> {
        console.log('connected to mongoDB');
    });

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

//so how im going to use this application I will say //8800 its going to be our port, after that just consolelog
app.listen(8800,()=> {
    console.log("backend server is ready!!!")
});  