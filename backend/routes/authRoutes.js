import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { User } from '../controllers/UserController.js';
import { Categories } from '../controllers/CategorieController.js';
import { Products } from '../controllers/ProductController.js';


import checkToken from '../helpers/checkToken.js';

const router = express.Router();


//AUTH
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.post("/auth/getcode", AuthController.getCode);
router.post("/auth/resetPassword", AuthController.reset);

router.post("/auth/checkToken", checkToken, AuthController.index);


//USER
router.get("/user/:id", checkToken, User.get);
router.get("/user/", checkToken, User.getAll);


//Categories
router.post("/products/", checkToken, Products.register);

router.patch("/products/:id", checkToken, Products.update);

router.get("/products/", checkToken, Products.getAll);

router.get("/products/:id", checkToken, Products.get);


//CATEGORIES

router.post("/categories/", checkToken, Categories.register);

router.patch("/categories/:id", checkToken, Categories.update);

router.get("/categories/", checkToken, Categories.getAll);

router.get("/categories/:id", checkToken, Categories.index);




export default router;
