const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

dotenv.config();    //so its ready to use

//so how im going to use this application I will say //8800 its going to be our port, after that just consolelog
app.listen(8800,()=> {
    console.log("backend server is ready!!!!")
}); 