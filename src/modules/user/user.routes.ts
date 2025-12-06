import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userController } from "./user.controller";

const router = express.Router();

//localhost:5000/users/
// app.use("/users", userRoutes)


// for this "/users" , this is root '/'

router.post('/', userController.createUser)
router.get('/', userController.getUser)

export const userRoutes = router;