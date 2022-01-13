# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
### Products
- **Index**: *Show a list of all products*
    **GET**: */products/index*
    **Response**: *{ status: 200, products: [] }*

- **Show** *(args: product id): Show a product by id*
    **GET**: */products/:id*
    **@Param id**: *number*
    **Response**: 
        *Success* => *{status: 200, product}*
        *Failure* => *{status: 404, message: string}*

- **Create** *(args: Product)[token required]: Create a new product*
    **POST**: */products*
    **Headers**: *('Authorization', 'Bearer TOKEN')*
    **Payload**: *{name: string, price: number, category: string}*
    **Response**: 
        *Success => {status: 200, user}*
        *Failure => {status: 400, message: string}*

- [OPTIONAL] *Products by category (args: product category): Browse products by category or any other product field*
    **GET**: */products?criteria=value (ex: /products?category=category_name || /products?id=value || /products?name=product_name)*
    **@Query** *name: string*
    **Response**: *{status: 200, products : []}*

### Users
- **Index [token required]**: *Show a list of all users*
    **GET**: */users/index*
    **Headers**: *('Authorization', 'Bearer TOKEN')*
    **Response**: *{ status: 200, users: [] }*

- **Show (args: id)[token required]**: *Show a user by id*
    **GET**: */users/:id*
    **@Param** *id: number*
    **Response**: 
        *Success => {status: 200, user}*
        *Failure => {status: 404, message: string}*

- **Create (args: User)[token required]**: *Create a new User*
    **POST**: */users*
    **Headers**: *('Authorization', 'Bearer TOKEN')*
    **Payload**: 
             {first_name: string, 
              last_name: string, 
              username: string, 
              password: string(MUST contain one uppercase, one lowercase letter, a number and at least 8 characters length)
              }
    **Response**: 
        *Success => {status: 200, user}*
        *Failure => {status: 400, message: string}*

### Orders
- **Current Order by user (args: user id)[token required]**
    **GET**: */orders/current?user_id=id*
    **@Query** *user_id : number*
    **Headers**: *('Authorization', 'Bearer TOKEN')*
    **Response**: 
        *Success => { status: 200, order}*
        *Failure => {status: 404, message: string}*

- [OPTIONAL] **Completed Orders by user (args: user id)[token required]**
    **GET**: */orders/completed?user_id=id*
    **@Query** *user_id : number*
    **Headers**: *('Authorization', 'Bearer TOKEN')*
    **Response**: *{ status: 200, orders: []}*

- [EXTRA] **Place a new order**
    **POST**: */orders/place*
    **Headers**: *('Authorization', 'Bearer TOKEN')*
    **Payload**: *array of objects containing product_id and qty - MUST at least include one product*
    **Response**:
        *Success => {status: 200, order}*
        *Failure => {status: 400, message: string}*

## Data Shapes
### Product
-  id
- name
- price
- [OPTIONAL] category

#### Database Table : products
- id: serial (primary key)
- name: varchar
- price: number
- category: varchar

### User
- id
- firstName
- lastName
- password

#### Database Table : users
- id : serial (primary key)
- username: varchar (unique)
- first_name: varchar
- last_name: varchar
- password: varchar

### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

#### Database Tables : orders + order_products

##### orders table:
- id: serial (primary key)
- user_id: serial (foreign key to table users)
- status: varchar
##### order_products table:
- order_id: serial (forein key to table orders)
- product_id: serial (forein key to table products)
- qty: number

