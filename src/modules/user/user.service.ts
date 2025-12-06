import { pool } from "../../config/db"

const createUser = async (name:string, email:string, age:number) => {
    const result = await pool.query(`INSERT INTO users(name,email,age) VALUES($1, $2,$3) RETURNING *`, [name, email, age])

    return result
}

export const userService={
    createUser,
}