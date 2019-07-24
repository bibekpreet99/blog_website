require('dotenv').config()
const express = require('express');
const expressEdge = require('express-edge')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo') // to keep user logged in after restarting server
const connectFlash = require('connect-flash')
const edge = require('edge.js') 
const cloudinary = require('cloudinary')


// mongodb connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });


const app = express();

// cloudinary
cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})


// session
const mongoStore = connectMongo(expressSession) 



// controllers

const homePage = require('./controllers/homePage')
const singlePost = require('./controllers/singlePost')
const storePost = require('./controllers/storePost')
const createPost = require('./controllers/createPost')
const userRegister = require('./controllers/userRegister')
const storeUser = require('./controllers/storeUser')
const login = require('./controllers/login')
const loginUser = require('./controllers/loginUser.js')
const logout = require('./controllers/logout')

// middlewares
app.use(expressEdge);
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}))
app.use(connectFlash())

// custom middlewares

const validateUploadedImage = require('./middleware/storePost')
const auth = require('./middleware/auth')
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')

app.use('/posts/store', validateUploadedImage)
app.use('*', (req, res, next)=>{
    edge.global('auth', req.session.userId)
    next()
})


// view engine(edgejs)
app.set('views', `${__dirname}/views`);


// routes
app.get('/', homePage)
app.get('/post/:id', singlePost)
app.get('/posts/new',auth, createPost)
app.get('/auth/login',redirectIfAuthenticated, login)
app.post('/users/login',redirectIfAuthenticated, loginUser)
app.post('/posts/store', auth, storePost)
app.get('/auth/register',redirectIfAuthenticated, userRegister)
app.post('/users/register',redirectIfAuthenticated, storeUser)
app.get('/auth/logout', auth, logout)
app.use((req,res)=>res.render('not-found'))


app.listen(process.env.PORT, ()=>{
    console.log(`listening to ${process.env.PORT}`)
})