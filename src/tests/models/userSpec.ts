import { UserDao, User } from "../../models/user";

const userDao = new UserDao()


function generateRandomString(){
    return Math.random().toString(16).substring(2,6)
}

describe('User Model Specs', ()=>{
    it('should create a new user', async()=>{
        const username = generateRandomString()
        const userForm  = {first_name: 'Test', last_name: 'User', username, password: 'Strong1password'  }

            userDao.create(userForm).then((user:User)=>{
                expect(user.username).toEqual(username)
            })

    
 
  
    })

    it('should return an array of users', async()=>{
        const users : User[] = await userDao.index() as User[]
        expect(users).toBeInstanceOf(Array)
    })

    it('should return user by id', async()=>{
        const username = generateRandomString()
        userDao.create({first_name: 'Test', last_name: 'User', username, password: 'Strong1password'  })
        .then((user1: User)=>{
            userDao.show(user1.id).then((user2:User)=>{
                expect(user2.username).toEqual(username)
    
            })
        })
      
    })

})