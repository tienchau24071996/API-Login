const User = require('../model/User')
const {registerValidation,loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function routes (fastify,options){
    // const users = [{
    //         id: 1,
    //         name: "Richard Hendricks",
    //         email: "richard@piedpiper.com",
    //     },
    //     {
    //         id: 2,
    //         name: "Bertram Gilfoyle",
    //         email: "gilfoyle@piedpiper.com",
    //     },
    // ];
    
    // fastify.get('/db', async (req,res) =>{
    //     res.send(users)
    // })

    //Register
    fastify.post('/register',async (req,res) => {
        
        //LETS VALIDATION THE DATA BEFORE WE A USER
        const {error} = registerValidation(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        //Checking if the user is already in the database
        const emailExist = await User.findOne({email:req.body.email})
        if(emailExist) return res.status(400).send('Email already exists')

        //Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)

        //CREATE A NEW USER
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword
        })
        try{
            const savedUser = await user.save();
            res.send({user : user._id});
        } catch(err){
            
            res.status(400).send(err);
        }
    })    

    //Login
    fastify.post('/login', async (req,res) => {

        //LETS VALIDATION THE DATA BEFORE WE A USER
        const {error} = loginValidation(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        //Checking if the email exists
        const user = await User.findOne({email:req.body.email})
        if(!user) return res.status(400).send('Email is not found')

        //Password is correct
        const validPass = await bcrypt.compare(req.body.password,user.password)
        if(!validPass) return res.status(400).send('Invalid password')
        
        res.send('Logged in!')
        //Create and assign a token
        // const token = jwt.sign({_id : user._id},process.env.TOKEN_SECRET)
        // res.header('auth-token',token).send(token)
    
    })
}

module.exports = routes;