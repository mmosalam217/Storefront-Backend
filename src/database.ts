import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const {PG_DATABASE, PG_DATABASE_TEST, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, ENV} = process.env;

const connection = new Pool({
        database: ENV === 'dev'? PG_DATABASE : PG_DATABASE_TEST,
        user: PG_USER,
        password: PG_PASSWORD,
        host: PG_HOST,
        port: (PG_PORT as unknown) as number // make typescript read it as a number, we must convert it as unkown first
    })




export default connection