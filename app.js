//create app instance
import express from 'express';
import dotenv from 'dotenv';
// import passport 
import passport from "passport";
import './src/comman/passport/jwt.strategy';
// import cookie parser
import cookieParser from "cookie-parser";
// connect with database
import db from "./src/comman/config/db";
// check if database connected successfully or not
async function checkConnection() {
    try {
        await db.raw("select 1+1 as result");
        console.log("Database connected successfully.");
    } catch (error) {
        console.log("Error while connecting to database", error);
        process.exit(1); // exit with error   
    }
}

// import routers
import apiRouter from "./src/routes/api.routes";
// import error handler middleware 
import errorHandlerMiddleware from "./src/comman/middleware/error.hanlder.middleware";
// import ejs
import path from "path";
// import express file-uploader
import fileUpload from "express-fileupload";
//import web routes
import webRouter from "./src/routes/web.routes"
//import swagger config
import swaggerConfig from "./src/comman/config/swagger.config";

const app = express(); // create app instance
const PORT = process.env.PORT || 3000; // set PORT environment

dotenv.config(); // import and configure dotenv

// Set up middleware
app.use(express.json()); // parse JSON bodies
// app.use(bodyParser.urlencoded({ extended: true })); // parse URL-encoded bodies (including form-data)
app.use(cookieParser()); // start cookie parser middleware
app.use(fileUpload({ // file upload middleware
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use("/storage/uploadImages", express.static(path.join(__dirname, "./public/storage/uploadImages")));//define static path for getting uploaded image
app.use(passport.initialize()); // initialize passport

// Check database connection
checkConnection();

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", 'views'));


// Set up routing and error handling
app.use("/api/v1", apiRouter); // use API router
app.use("/", webRouter); //use web routes
app.use("/api/documentation", swaggerConfig);//use swagger config
app.use(errorHandlerMiddleware); // error handler middleware



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
