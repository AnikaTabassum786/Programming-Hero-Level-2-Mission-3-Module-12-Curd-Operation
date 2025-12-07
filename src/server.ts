import express, {  Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { authRoutes } from "./modules/auth/auth.routes";

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


app.use('/users', userRoutes)


app.use('/todos', todoRoutes)

app.use('/auth', authRoutes)
//create todos
// app.post('/todos',)

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
