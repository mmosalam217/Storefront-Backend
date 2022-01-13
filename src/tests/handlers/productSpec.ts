import request from 'supertest'
import app from '../../server'
import { Product, ProductDao } from '../../models/product'
import { UserDao, User } from '../../models/user'
import jwt, { JwtPayload } from 'jsonwebtoken'

const productDao = new ProductDao()
const userDao = new UserDao()

async function generateAccessToken(): Promise<string> {
    const userForm =  {first_name: generateRandomString(), last_name: generateRandomString(), username: generateRandomString(), password: 'Strong1password'}

    try {
        const user = await userDao.create(userForm)
        const token = jwt.sign({user_id: user.id, username: user.username} as JwtPayload, process.env.JWT_SECRET as jwt.Secret)
        //const authenticated =  await request(app).post('/users/authenticate').send({username: user.username, password: user.password})
        //const access_token = authenticated.body.access_token as string
        return token
    } catch (error) {
        throw new Error((error as Error).message)
    }

}

function generateRandomString(){
    return Math.random().toString(16).substring(2,6)
}
describe('Product Api Test', ()=>{

    it('GET: /products/index should return an array of products', async()=>{
        try {
            const res = await request(app).get('/products/index').send()
            const products : Product[] = res.body.products as Product[]
            expect(res.status).toEqual(200)
        } catch (error) {
            console.log(error)
            throw new Error((error as Error).message)
        }
 
    })

    it('POST: /products should create new product', async()=>{
        generateAccessToken().then(async(token: string)=>{
            const res = await request(app).post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({name: 'Samsung Galaxy', price: 500, category: 'Smartphone'})
            const product = res.body.product as Product
            expect(product.name as string).toEqual('Samsung Galaxy')
        }).catch(err=>{
            console.log(err)
            throw new Error((err as Error).message)

        })
    })

    it('GET: /products?category=smartphone', async()=>{
        try {
            const product = await productDao.create({name: 'Samsung Galaxy', price: 500, category: 'Smartphone'})
            const prodid = (product as Product).id as number
            const res = await request(app).get('/products?category=Smartphone').send()
            const resultList = res.body?.products as Product[]
            const getProduct = resultList[0]
            expect(getProduct.category).toEqual(product.category)
            await productDao.deleteById(prodid) 
        } catch (error) {
            console.log(error)
            throw new Error((error as Error).message)
        }

    })

    it('GET: /products/:id should return product with the id given', async()=>{
        try {
            const product = await productDao.create({name: 'Samsung Galaxy', price: 500, category: 'Smartphone'})
            const prodid = (product as Product).id as number
            const res = await request(app).get(`/products/${prodid}`).send()
            const getProduct : Product = res.body.product as Product
            const id : number = ( product as Product).id as number
            expect(getProduct.id).toEqual(id)
            await productDao.deleteById(id)
        } catch (error) {
            console.log(error)
            throw new Error((error as Error).message)

        }

    })


})