import request from 'supertest'
import app from '../../server'
import { Product, ProductDao } from '../../models/product'


const productDao = new ProductDao()


describe('Product Api Test', ()=>{
    const {SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD} = process.env

    it('GET: /products/index should return an array of products', async()=>{
        try {
            const res = await request(app).get('/products/index').send()
            const products : Product[] = res.body?.products as Product[]
            expect(res.status).toEqual(200)
        } catch (error) {
            throw new Error((error as Error).message)
        }
 
    })

    it('POST: /products should create new product', async()=>{
            // Authenticate admin to get the access_token back as the product creation route is protected
            const auth_response = await request(app).post('/users/authenticate')
                                        .send({username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD})
            const token = auth_response.body?.access_token
            const res = await request(app).post('/products')
            .set('Authorization', `Bearer ${token as string}`)
            .send({name: 'Samsung Galaxy', price: 500, category: 'Smartphone'})
            const product = res.body?.product as Product
            expect(product?.name as string).toEqual('Samsung Galaxy')
        
    })

    it('GET: /products?category=smartphone', async()=>{
        try {
            const product = await productDao.create({name: 'Samsung Galaxy', price: 500, category: 'Smartphone'})
            const prodid = (product as Product)?.id as number
            const res = await request(app).get('/products?category=Smartphone').send()
            const resultList = res.body?.products as Product[]
            const getProduct = resultList[0]
            expect(getProduct?.category).toEqual(product.category)
            await productDao.deleteById(prodid) 
        } catch (error) {
            throw new Error((error as Error).message)
        }

    })

    it('GET: /products/:id should return product with the id given', async()=>{
        try {
            const product = await productDao.create({name: 'Samsung Galaxy', price: 500, category: 'Smartphone'})
            const prodid = (product as Product).id as number
            const res = await request(app).get(`/products/${prodid}`).send()
            const getProduct : Product = res.body?.product as Product
            const id : number = ( product as Product)?.id as number
            expect(getProduct?.id).toEqual(id)
            await productDao.deleteById(id)
        } catch (error) {
            throw new Error((error as Error).message)

        }

    })


})