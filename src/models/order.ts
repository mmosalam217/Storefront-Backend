import connection from "../database";

export type Order = {
    id: number,
    user_id: number,
    order_items: Array<OrderProductDto>,
    status: string,

}

export type OrderProductDto = {
    product_id: number,
    qty: number
}

export type OrderProduct = {
    order_id: number,
    product_id: number,
    qty: number
}



export type Cart = {
    user_id: number,
    products:Array<OrderProductDto>
}
export class OrderDao{

    async place(cart: Cart): Promise<Order> {
        // Create the connection
        const conn = await connection.connect();
        try {
            // Wrap all into transaction to rollback everything if the order or order_products resulted in a failure
            await conn.query('BEGIN') 
            // Create the order
            let orderQuery = `INSERT INTO orders(user_id, status) VALUES($1, 'active') RETURNING *`
            const orderResult = await conn.query(orderQuery, [cart.user_id])
            const order = orderResult.rows[0]
            // Add products
           // Collect promises from results at once
            const promises = []
            for(let i: number = 0; i < cart.products.length; i++){
               // add new entry for each product in the cart
               let query = 'INSERT INTO order_products(order_id, product_id, qty) VALUES($1, $2, $3) RETURNING product_id, qty;'
               promises.push(conn.query(query, [order.id, cart.products[i].product_id, cart.products[i].qty]))
            }
            const addProductsToOrdersResult = await Promise.all(promises)
            // Commit transaction if entries added successfully
            await conn.query('COMMIT')
            // Cast result row for each order_product query result into a dto
            const prods : OrderProductDto[] = addProductsToOrdersResult.map(r => r.rows[0] as OrderProductDto) as Array<OrderProductDto>
            // collect the new inserted products to spare running a new query
            order.order_items = prods
            return order as Order
        } catch (err) {
            //rollback transaction if error occured
            await conn.query('ROLLBACK')
            console.log(err)
            throw new Error(`Error placing order, ${(err as Error).message}`)
        }
    }


    async getUserCurrentOrder(user_id: number) : Promise<Order> {
        const conn = await connection.connect();
        try {
            let query = `SELECT MAX(o.id) as id, o.user_id, o.status,
                         JSON_AGG(json_build_object('product_id', p.id, 'qty', op.qty)) as order_items FROM orders as o
                         INNER JOIN order_products as op ON op.order_id = o.id
                         INNER JOIN products as p ON p.id = op.product_id
                         WHERE o.user_id=$1 AND o.status='active' GROUP BY o.id, o.user_id;
            `
            const result = await conn.query(query, [user_id])
            conn.release()
            const order = result.rows[0]
            return order
        } catch (err) {
            console.log(err)
            throw new Error(`Error creating order, ${(err as Error).message}`)
        }
    }

    async getCompletedOrders(user_id: number): Promise<Order[]> {
        const conn = await connection.connect();
        try {
            let query = `SELECT o.id as id, o.user_id as user_id, o.status as status,
                         JSON_AGG(json_build_object('product_id', p.id, 'qty', op.qty)) as order_items 
                         FROM orders as o
                         INNER JOIN order_products as op ON op.order_id = o.id
                         INNER JOIN products as p ON p.id = op.product_id
                         WHERE o.user_id=$1 AND o.status = 'completed' GROUP BY o.id, o.user_id;
            `
            const result = await conn.query(query, [user_id])
            conn.release()
            const orders = result.rows
            return orders
        } catch (err) {
            console.log(err)
            throw new Error(`Error creating order, ${(err as Error).message}`)
        }
    }
    
    
    async setOrderCompleted(id: number): Promise<void>{
        const conn = await connection.connect();
        try {
            let query = `UPDATE orders SET status='completed' WHERE id=$1;`
            await conn.query(query, [id])
            conn.release()
        } catch (err) {
            console.log(err)
            throw new Error(`Error creating order, ${(err as Error).message}`)
        }
    }
}