const express = require("express");
const { getAllProducts, createProduct, updateProducts, deleteProducts, getProductDetails, createProductReview, getProductReviews, deleteReview } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get( isAuthenticatedUser,   getAllProducts);
router.route("/admin/products/new").post(isAuthenticatedUser,createProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser,updateProducts).delete(isAuthenticatedUser,deleteProducts);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview);
module.exports = router;