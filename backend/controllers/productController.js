const Product = require("../models/productModel")


//create product--Admin
exports.createProduct = async (req,res,next)=>{

    const product = await Product.create(req.body);

    res.status(200).json({
        success:true,
        product
    })
}
//get all product
exports.getAllProducts = async(req,res)=>{

    const products = await Product.find();
    res.status(200).json({
       success:true,
       products
    });
}

//get product details(or get a single product)
exports.getProductDetails = async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found"
        })
    }

    res.status(200).json({
        success:true,
        product
    })
}

//update products --Admin

exports.updateProducts = async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found",
        })
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
}

// delete product
exports.deleteProducts = async(req,res,next)=>{
    
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
    await product.remove();
    res.status(200).json({
         success:true,
         message:"product deleted successfully"
    })
}