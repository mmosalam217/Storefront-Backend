import app from "../../server";
import request from 'supertest'
import { UserDao, User } from '../../models/user'
import jwt, { JwtPayload } from 'jsonwebtoken'

const userDao = new UserDao()

async function createUser() : Promise<User>{
    const userForm = {first_name: generateRandomString(), last_name: generateRandomString(),
                      username: generateRandomString(), password: 'Strong1password'}
    try {
        const user = await userDao.create(userForm)
        return user;  
    } catch (error) {
        throw new Error((error as Error).message)
    }

}



function generateRandomString(){
    return Math.random().toString(16).substring(2,6)
}

describe('User Api Specs',  () => {
    const {SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD} = process.env

    it('POST: /users creates an new user', async () =>{
        // Authenticate admin to get the access_token back as the user creation route is protected
        const auth_response = await request(app).post('/users/authenticate')
                            .send({username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD})
        const token = auth_response.body?.access_token

        const userForm = {first_name: generateRandomString(), last_name: generateRandomString(),
            username: generateRandomString(), password: 'Strong1password'}
            
        const res = await request(app).post('/users').set('Authorization', `Bearer ${token as string}`).send(userForm)
        const user = res.body?.user
        expect(user?.username).toEqual(userForm.username)
        
    })
    
    it('GET: /index returns array of users', async () => {
        // Authenticate admin to get the access_token back as the user creation route is protected
        const auth_response = await request(app).post('/users/authenticate')
                            .send({username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD})
        const token = auth_response.body?.access_token
        const res = await request(app).get('/users/index').set('Authorization', `Bearer ${token as string}`).send()
        expect(res.status).toEqual(200)
        
    })

    it('GET: /:id return user with id', async () => {
            // Authenticate admin to get the access_token back as the user creation route is protected
            const auth_response = await request(app).post('/users/authenticate')
                                        .send({username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD})
            const token = auth_response.body?.access_token
            // Hard user creation to get an actual id registerd into DB..
            const newUser = await createUser()
            const res = await request(app).get(`/users/${newUser.id}`).set('Authorization', `Bearer ${token as string}`).send()
            const user: User = res.body?.user as User
            expect(user?.id).toEqual(newUser?.id)
        })
        
    

  

})