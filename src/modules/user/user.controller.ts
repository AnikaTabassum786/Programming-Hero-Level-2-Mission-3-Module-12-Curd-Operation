import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {

    const { name, email, age } = req.body;

    try {
        const result = await userService.createUser(name, email, age)
        console.log(result.rows[0]);
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

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getUSer()
       
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
}

const getSingleUser = async (req: Request, res: Response) => {
    
    try {
        const result = await userService.getSingleUser(req.params.id as string);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Data Fetched Successfully",
                data: result.rows[0]
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const updateUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const result = await userService.updateUser(name, email, req.params.id as string)
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Data Updated Successfully",
                
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.deleteUser(req.params.id!);
        console.log(result)
        if (result.rowCount === 0) {
            res.status(200).json({
                success: false,
                message: "User not found"

            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Data Deleted Successfully",
                data: result.rows
            })
        }
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
    getUser,
    getSingleUser,
    updateUser,
    deleteUser
}