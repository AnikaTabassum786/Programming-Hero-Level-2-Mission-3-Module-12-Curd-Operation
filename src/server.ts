import express, {  Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";

const app = express()
const port = config.port

//parser
app.use(express.json())

//initializing DB
initDB()

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});


app.get('/', (req: Request, res: Response) => {
    res.send('Hello Anika Tabassum!')
})


//users CRUD
//create

app.use('/users', userRoutes)

//get all users
// app.get('/users', async (req: Request, res: Response) => {
//     try {
//         const result = await pool.query(`SELECT * FROM users`);
//         res.status(200).json({
//             success: true,
//             message: "Data Fetched Successfully",
//             data: result.rows
//         })
//     }
//     catch (err: any) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         })
//     }
// })

//get user by id 
app.get('/users/:id', async (req: Request, res: Response) => {
    // console.log('This is id:',req.params.id)
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])
        //  console.log(result)
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
})


//update user
app.put('/users/:id', async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, req.params.id])
        //  console.log(result)
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
                // data: result.rows[0]
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

//DELETE user
app.delete('/users/:id', async (req: Request, res: Response) => {
    // console.log('This is id:',req.params.id)
    try {
        const result = await pool.query(`DELETE  FROM users WHERE id = $1`, [req.params.id]);
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
})

//create todos
app.post('/todos', async (req: Request, res: Response) => {
    const { user_id, title } = req.body;
    try {
        const result = await pool.query(`INSERT INTO todos(user_id,title) VALUES($1, $2) RETURNING *`, [user_id, title]);
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

//get all todos
app.get('/todos', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM todos`);
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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
