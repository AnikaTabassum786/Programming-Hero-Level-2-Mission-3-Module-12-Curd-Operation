import express, { Request, Response } from "express";
import { Pool } from 'pg';
import dotenv from "dotenv";
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

const app = express()
const port = 5000

//parser
app.use(express.json())

//DB
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `)

    await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)`)
}

initDB()


app.get('/', (req: Request, res: Response) => {
    res.send('Hello Anika Tabassum!')
})


//users CRUD
//create
app.post('/users', async (req: Request, res: Response) => {
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



//get all users
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
