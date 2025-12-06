import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo =  async (req: Request, res: Response) => {
    const { user_id, title } = req.body;
    try {
        const result = await todoService.createTodo(user_id,title);
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

const getTodo = async (req: Request, res: Response) => {
    try {
        const result = await todoService.getTodo();
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

export const todoController={
    createTodo,
    getTodo
}