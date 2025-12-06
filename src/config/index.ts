import dotenv from "dotenv";
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

const config = {
connnection_str: process.env.CONNECTION_STR,
port:process.env.PORT
}

export default config;