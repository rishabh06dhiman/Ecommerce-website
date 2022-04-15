const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");

const errorMiddleware = require("./middleware/error")

app.use(express.json());
app.use(cookieparser());

// all routes import here
const product = require("./routes/productRoute");
const user = require("./routes/userRoute")
app.use("/api/v1",product);
app.use("/api/v1",user);

//middleware for error
app.use(errorMiddleware);


module.exports = app;