const express=require('express')
const http=require('http')
const cors=require('cors')
const {Server}=require('socket.io')
const path=require('path')
const rateLimiter=require('express-rate-limit')
const { fetchNotification } = require('./mail/notification')
const Search = require('./src/Search')
const {profileView} = require('./src/View')
const setup=require('./sockets/index')
const scheduleDiscussion = require('./mail/Discussion')
const app=express()
app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname,"../frontend/public")))
app.use(express.static(path.join(__dirname,'../frontend/reactcode/build')))

const limiter=rateLimiter({
    windowMs:30*60*1000,
    max:120,
    message:"Too many request from this IP"
})

app.use(limiter)

// serving html files 
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/public/index.html"))
})
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/public/login.html"))
})
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/public/signup.html"))
})


// login and signup logics
app.use('/user/aouth', require('./routes/userAuth'))
// project uploads 
app.use('/user/upload',require('./routes/ProjectUpload'))
// fetching notification for user 
app.get('/notification',(req,res)=>{
    fetchNotification(req,res)
})
// fetching user profile 
app.use('/api/user',require('./src/userProfile'))
// creating team and adding team members
app.use('/projects',require('./src/team'))
// creating project and showing it 
app.use('/projects',require('./src/project'))
// search functationality 
app.post('/search',(req,res)=>{
    Search(req,res)
})
// profile view features 
app.get('/profile',(req,res)=>{
    profileView(req,res)
})
// schedule discussion 
app.post('/scheduleDiscussion',(req,res)=>{
    scheduleDiscussion(req,res)
})
app.use('/ssh',require('./Git/ssh'))


// websocket logic 
const server=http.createServer(app)
const io=new Server(server,{
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    },
    connectionStateRecovery: {}
})
setup(io)


// starting the server 
const port=process.env.PORT || 3000;
server.listen(port,()=>{
    console.log(`Server started at port ${port}, http://localhost:${port}`)
})