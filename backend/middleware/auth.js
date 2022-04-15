const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.isAuthenticatedUser = catchAsyncErrors( async(req,res,next)=>{

    const {token}  = req.cookies;
    if(!token){
        return next(new ErrorHandler("please login to use this resources", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData._id);
    next();
});

// exports.authorizeRoles = (...roles) => {
//     return (req,res,next)=>{
//         if(!roles.includes(req.user.role)){
//             return next(new ErrorHandler(
                
//                 `Role: ${req.user.role} is not allowed to access this resources`,
//                 403
//             ));
//         }
        
//         next();
        
//     };
// };

exports.authorizeRoles = (...roles) => {
    return(req,res,next)=>{
        if(!roles.includes(req.body.user.role)){
            return next( new ErrorHandler(
                `Role: ${req.body.user.role} is not alowed to access this resources`,403
            ));
        }

        next();
    };
};