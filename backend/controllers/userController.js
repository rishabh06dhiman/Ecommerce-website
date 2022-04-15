const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

// register a user function
exports.registerUser = catchAsyncError(
    async(req,res,next)=>{
        const {name, email, password} = req.body;
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "this is a sample id",
                url: "profileUrl",
            },
        });
        
        sendToken(user, 201, res);
        
    }
);

exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email, password} = req.body;
    
    // checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email or password", 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or passsword",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched ){
        return next(new ErrorHandler("Invalid Email or passsword",401));
    }

    sendToken(user, 200, res);

});

// logout user function 
exports.logout = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null, {
        expires: new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged out"
    });
}); 

// forgot password
exports.forgotpassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return  next(new ErrorHandler("user not found",404));
    }

    //get resetpassword token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then,
     please ignore it`;

     try {

        await sendEmail({
            email:user.email,
            subject:`Ecommerce password recovery`,
            message,
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });

         
     } catch (error) {
         user.resetPasswordToken = undefined;
         user.resetPasswordExpire = undefined;

         await user.save({validateBeforeSave:false});

         return next(new ErrorHandler(error.message, 500));
     }
});