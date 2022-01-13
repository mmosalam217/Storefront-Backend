import connection  from '../database'
import bcrypt from 'bcrypt'

export type User = {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    password: string
}



export type AuthUserDetails = {
    id?: number,
    username: string,
    first_name: string,
    last_name: string
}

export class UserDao{
    async index(): Promise<User[]> {
        try{
            const conn = await connection.connect()
            const sql = 'SELECT * FROM users;'
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }catch(err){
            throw new Error( (err as Error).message)
        }
    }

    async show(id: number): Promise<User> {
        try{
            const conn = await connection.connect()
            const sql = 'SELECT * FROM users WHERE id=$1;'
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }catch(err){
            throw new Error( (err as Error).message)
        }
    }

    async create(user: {first_name: string, last_name: string, username: string, password: string}): Promise<User> {
        try{
            // Hash the password
            const pw_hash = await bcrypt.hash(user.password, 10);
            const conn = await connection.connect()
            const sql = 'INSERT INTO users (first_name, last_name, username, password) VALUES($1, $2, $3, $4) RETURNING *;'
            const result = await conn.query(sql, [user.first_name, user.last_name, user.username, pw_hash]);
            conn.release();
            return result.rows[0];
        }catch(err){
            console.log(err)
            throw new Error( (err as Error).message)
        }
    }

    // Load userdetails by username...
    async loadUserDetails(username: string): Promise<User>{
        try{
            const conn = await connection.connect()
            const sql = 'SELECT * FROM users WHERE username=$1;'
            const result = await conn.query(sql, [username]);
            conn.release();
            return result.rows[0];
        }catch(err){
            throw new Error( (err as Error).message)
        }
    }

    // Onlz used to clear data after tests which include brute-force creating users
    async deleteAll(){
        try{
            const conn = await connection.connect()
            const sql = 'DELETE FROM users;'
            await conn.query(sql);
            conn.release();
        }catch(err){
            throw new Error( (err as Error).message)
        } 
    }
}