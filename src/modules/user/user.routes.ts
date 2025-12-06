import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userController } from "./user.controller";

const router = express.Router();

//localhost:5000/users/
// app.use("/users", userRoutes)


// for this "/users" , this is root '/'
router.post('/', userController.createUser)

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);
        // console.log(result);
        res.status(200).json({
            success: true,
            message: "Data Fetched Successfully",
            data: result.rows
        })
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

export const userRoutes = router;