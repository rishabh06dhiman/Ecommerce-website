const express = require("express");
const { getAllProducts, createProduct, updateProducts, deleteProducts, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get( isAuthenticatedUser,   getAllProducts);
router.route("/products/new").post(isAuthenticatedUser,createProduct);
router.route("/products/:id").put(isAuthenticatedUser,updateProducts).delete(isAuthenticatedUser,deleteProducts).get(getProductDetails);

module.exports = router;