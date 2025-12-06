import express, { Request, Response } from "express";
import { pool } from "../../config/db";

const router = express.Router();

//localhost:5000/users/
// app.use("/users", userRoutes)


// for this "/users" , this is root '/'
router.post('/', async (req: Request, res: Response) => {
    const { name, email, age } = req.body;
    try {
        const result = await pool.query(`INSERT INTO users(name,email,age) VALUES($1, $2,$3) RETURNING *`, [name, email, age])
        console.log(result.rows[0]);
        // res.send({message: "Data Inserted"})
        res.status(201).json({
            success: true,
            message: "Data Inserted Successfully",
            data: result.rows[0]
        })
    }

    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

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