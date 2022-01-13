import { ProductDao, Product, ProductFilter } from "../../models/product";


const productDao = new ProductDao()

describe('Product Model Spec', ()=>{

    it('should create a new product', async () => {
        const productDetails = {name: 'Nokia', price: 10, category: 'Smartphone'}
        const product : Product = await productDao.create(productDetails) as Product
        expect(product.name).toBe(productDetails.name)
    })

    it('should return array of products', async () => {
        const products: Product[] = await productDao.index() as Product[]
        expect(products).toBeInstanceOf(Array)
    })

    it('should return a product with a given id', async () => {
        const productDetails = {name: 'Nokia', price: 10, category: 'Smartphone'}
        const product : Product = await productDao.create(productDetails) as Product
        const newProduct : Product = await productDao.show(product.id as number) as Product
        expect(newProduct).toEqual(product)
    })

    it('should return products by category', async () => {
        const products : Product[] = await productDao.filter({category: 'Smartphone'} as ProductFilter) as Product[]
        expect(products[0].category).toEqual('Smartphone')
    })

})