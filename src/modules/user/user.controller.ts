import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    const { name, email, age } = req.body;
    try {
        const result = await userService.createUser(name, email, age)
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
}

export const userController = {
    createUser,
}