import express, {Request, Response} from 'express'
import { User, UserDao } from '../models/user'
import AuthFilter from '../middelwares/AuthFilter'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'


const userDao = new UserDao();



async function findAll(req: Request, res: Response) {
    try {
        const users = await userDao.index()
        return res.status(200).json({status: 200, users})
    } catch (err) {
        return res.status(500).json({status: 500, message: 'Error fetching users'})
    }
}

async function findById(req: Request, res: Response) {
    const id = (req.params.id as unknown) as number
    try {
        const user = await userDao.show(id)
        if(user){
            return res.status(200).json({status: 200, user})
        }else{
            return res.status(404).json({status: 404, message: `User not found with id ${id}`})
        }
    } catch (err) {
        return res.status(500).json({status: 500, message: 'Error fetching user'})
    }
}

async function create(req: Request, res: Response) {
    const userDto = {
        first_name: req.body.first_name as string,
        last_name: req.body.last_name as string,
        username: req.body.username as string,
        password: req.body.password as string
    }
    // Validate inputs
    if(userDto.first_name.trim().length < 3 || userDto.last_name.trim().length < 3) 
    return res.status(400).json({status: 400, message: `First- and lastname should be at least 3 characters length`})
    // Check if user already exists..
    const userExists =  await userDao.loadUserDetails(userDto.username)
    if(userExists) return res.status(400).json({status: 400, message: 'Username already exists or wrong'})
    // Check if password is 8 chars length, contains at least one number, one uppercase char and one lowercase char
    const strongPasswordCriteria = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    if(!strongPasswordCriteria.test(userDto.password))
    return res.status(400).json({
        status: 400, 
        message: `Password must be at least 8 chars length, contains at least one number, one uppercase char and one lowercase char`
    });
    // Create the user...
    try {
        const user = await userDao.create(userDto);
        return res.status(200).json({status: 200, user})
    } catch (err) {
        return res.status(500).json({status: 500, message: 'Error creating user'})

    }
    

}

async function authenticate(req: Request, res: Response) {
   const credentials:{username: string, password: string} = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        const user: User = await userDao.loadUserDetails(credentials.username);
        if(!user) return res.status(404).json({status: 404, message: "User does not exist, please register or enter right credentials"})
        // Check if the credentials are right
        const isAuthenticated = await bcrypt.compare(credentials.password, user.password)
        if(!isAuthenticated) return res.status(403).json({status: 403, message: 'Bad credentials'})
        // Return a jwt access_token if user is authenticated..
        const secret: jwt.Secret = process.env.JWT_SECRET as jwt.Secret
        const expiresIn = Date.now() + 60 * 60 // for an hour as a starter
        const payload: JwtPayload = {user_id: user.id, username: user.username}
        const access_token = await jwt.sign(payload, secret, {expiresIn})
        if(access_token) return res.status(200).json({status: 200, message: 'Login success', user_id: user?.id, access_token, expires_in: expiresIn})
    } catch (err) {
        return res.status(500).json({status: 500, message: 'Error occured during authentication'})
    }
}

export const user_route = (app: express.Application)=> {
    app.get('/users/index', AuthFilter, findAll)
    app.get('/users/:id', AuthFilter, findById)
    app.post('/users', AuthFilter, create)
    app.post('/users/authenticate', authenticate)
}