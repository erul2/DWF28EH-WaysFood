const express = require("express");
// import dotenv and call config function to load environment
require("dotenv").config();

const router = express.Router();

// Controller
const { login, register, checkAuth } = require("../controllers/auth");
const {
  getUsers,
  deleteUser,
  editUser,
  getRestos,
} = require("../controllers/user");
const {
  getProducts,
  getProduct,
  getDetailProduct,
  addProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/product");
const {
  getTransactions,
  getDetailTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
  getUserTransactions,
} = require("../controllers/transaction");

// Middlewares
const { auth, authPartner } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Routes
router.post("/login", login); // Login -> send token
router.post("/register", register); // Register -> send token

// user routes
router.get("/users", getUsers); // Get all users
router.delete("/user/:id", deleteUser); // delete a user
router.put("/user", auth, uploadFile("image"), editUser); // edit user data / profile

// product routes
router.get("/products", getProducts); // get all products
router.get("/products/:userId", getProduct); // Get all products by partnerId
router.get("/product/:productId", getDetailProduct); // Get the detail product
router.post("/product", authPartner, uploadFile("image"), addProduct); // Add product, need auth (token)(partner)
router.put(
  "/product/:productId",
  authPartner,
  uploadFile("image"),
  editProduct
); // Edit a product need auth (token) (partner)
router.delete("/product/:productId", authPartner, deleteProduct); // delte product

// transaction routes
router.get("/transactions/:userId", authPartner, getTransactions); // get trx filter by partner
router.get("/transaction/:transactionId", auth, getDetailTransaction); // get detail
router.post("/transaction", auth, addTransaction); // add transaction
router.put("/transaction/:transactionId", auth, editTransaction); // edit transaction
router.delete("/transaction/:transactionId", auth, deleteTransaction); // delete transaction
router.get("/my-transactions", auth, getUserTransactions); // get users transaction

// get resto
router.get("/restos", getRestos);
// check auth
router.get("/check-auth", auth, checkAuth);
module.exports = router;
