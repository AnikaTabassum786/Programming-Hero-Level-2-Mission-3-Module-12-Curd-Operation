import { pool } from "../../config/db"
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, unknown>) => {
    const {name, email, age,password} = payload;

    const hashPass = await bcrypt.hash(password as string,10)
    const result = await pool.query(`INSERT INTO users(name,email,age,password) VALUES($1, $2,$3,$4) RETURNING *`, [name, email, age, hashPass])
    return result
}

const getUSer = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
}

const getSingleUser = async (id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result
}

const updateUser = async (name: string, email: string, id: string) => {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, id])
    return result

}

const deleteUser = async (id: string) => {
    const result = await pool.query(`DELETE  FROM users WHERE id = $1`, [id]);
    return result;
}

export const userService = {
    createUser,
    getUSer,
    getSingleUser,
    updateUser,
    deleteUser
}