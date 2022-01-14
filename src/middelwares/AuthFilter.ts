import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { AuthUserDetails, User, UserDao } from '../models/user'

const userDao = new UserDao()

 type TokenPayload = {
    user_id: number,
    username: string
}

const AuthFilter =  async (req: Request, res: Response, next: NextFunction)=>{
    //Extract token from headers
    const authorization_header: string = req.headers['authorization'] as string
    let token: string = ''
    // No authorization headers means no authenticated user, also check if the token type is a bearer token
    if(authorization_header && authorization_header.startsWith('Bearer')){
        token = authorization_header.split(' ')[1]
        if(token != '' && token !== 'undefined'){
            try {
                const secret: jwt.Secret = process.env.JWT_SECRET as jwt.Secret
                const token_details : JwtPayload = jwt.verify(token, secret) as JwtPayload
                // If token is decoded and payload is there, attach the user to the request body
                if(token_details.username) {
                    const user: User = await userDao.loadUserDetails(token_details.username)
                    if(!user) return res.status(403).json({status: 403, message: "No user associated with the access_token"})
                    req.body.authenticated = 
                    {id: user.id, first_name: user.first_name, last_name: user.last_name, username: user.username} as AuthUserDetails
                }else{
                    return res.status(403).json({status: 403, message: "Bad access_token"})
                }
            } catch (err) {
                return res.status(403).json({status: 403, message: 'Maleformed access_token'})
            }

        }
    }else{
        return res.status(403).json({status: 403, message: 'Access_token is missing'})

    }
    next()

}

export default AuthFilter