const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


//create product--Admin
exports.createProduct = catchAsyncErrors(async (req,res,next)=>{

    // req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(200).json({
        success:true,
        product
    })
});
//get all product
exports.getAllProducts = catchAsyncErrors(async(req,res)=>{
    const resultPerPage = 5;
    const productCount  = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
       success:true,
       products
    });
});

//get product details(or get a single product)
exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        product,
        productCount
    })
})

//update products --Admin

exports.updateProducts =  catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
});

// delete product
exports.deleteProducts = catchAsyncErrors(async(req,res,next)=>{
    
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    await product.remove();
    res.status(200).json({
         success:true,
         message:"product deleted successfully"
    })
});