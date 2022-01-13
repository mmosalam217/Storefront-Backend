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

async function generateAccessToken(user: User): Promise<string> {
    try {
        const token = jwt.sign({user_id: user.id, username: user.username} as JwtPayload, process.env.JWT_SECRET as jwt.Secret)
        return token
    } catch (error) {
        throw new Error((error as Error).message)
    }

}

function generateRandomString(){
    return Math.random().toString(16).substring(2,6)
}

describe('User Api Specs',  () => {

    it('POST: /users creates an new user', async () =>{
        const admin = await createUser()
        const token = await generateAccessToken(admin)
        const userForm = {first_name: generateRandomString(), last_name: generateRandomString(),
            username: generateRandomString(), password: 'Strong1password'}
        const res = await request(app).post('/users').set('Authorization', `Bearer ${token as string}`).send(userForm)
        const user = res.body?.user
        expect(user.username).toEqual(userForm.username)
        
    })
    
    it('GET: /index returns array of users', async () => {
            const user = await createUser()
            const token = await generateAccessToken(user)
            const res = await request(app).get('/users/index').set('Authorization', `Bearer ${token as string}`).send()
            expect(res.status).toEqual(200)
        
    })

    it('GET: /:id return user with id equals 2', async () => {
            const newUser = await createUser()
            const token = await generateAccessToken(newUser)
            const res = await request(app).get(`/users/${newUser.id}`).set('Authorization', `Bearer ${token as string}`).send()
            const user: User = res.body.user as User
            expect(user.id).toEqual(newUser.id)
        })
        
    

  

})