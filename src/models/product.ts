import connection from '../database'

export type Product = {
    id?: number,
    name: string,
    price: number,
    category?: string
}

export type ProductFilter = {
    id?: number,
    name?: string,
    category?: string
}

export class ProductDao {
    async index(): Promise<Product[]> {
        try{
            const conn = await connection.connect()
            const sql = 'SELECT * FROM products;'
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }catch(err){
            throw new Error( (err as Error).message)
        }
    }

    async filter(filter: ProductFilter){
        try{
            const conn = await connection.connect()
            let sql = 'SELECT * FROM products'
            // Construct a criteria query..
            const where = [];
            if(filter.id) where.push(`id=${filter.id}`)
            if(filter.name) where.push(`name ILIKE '%${filter.name}%'`) // used ILIKE to ignore case
            if(filter.category) where.push(`category='${filter.category}'`)
            // If there are query params appended, then attach them to the query
            if(where.length > 0) sql+= ' WHERE ' + where.join(' and ') + ';'
            const result = await conn.query(sql);
            conn.release();
            return result.rows.length > 0 ? result.rows : []
        }catch(err){
            console.log(err)
            throw new Error( (err as Error).message)
        }
    }

    async show(id: number): Promise<Product> {
        try{
            const conn = await connection.connect()
            const sql = 'SELECT * FROM products WHERE id=$1;'
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }catch(err){
            throw new Error( (err as Error).message)
        }
    }

    async create(product: {name: string, price: number, category: string}): Promise<Product> {
        try{
            const conn = await connection.connect()
            const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *;'
            const result = await conn.query(sql, [product.name, product.price, product.category]);
            conn.release();
            return result.rows[0];
        }catch(err){
            console.log(err)
            throw new Error( (err as Error).message)
        }
    }

    async getByCategory(category: string): Promise<Product[]> {
        try{
            const conn = await connection.connect()
            const sql = `SELECT * FROM products WHERE category=$1;`
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
        }catch(err){
            console.log(err)
            throw new Error( (err as Error).message)
        }
    }

    async deleteById(id: number){
        try{
            const conn = await connection.connect()
            const sql = `DELETE FROM products WHERE id=$1;`
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows;
        }catch(err){
            throw new Error( (err as Error).message)
        } 
    }
    
}