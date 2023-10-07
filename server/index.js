const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const multer=require('multer')
const path=require('path')
const UserModel=require('./models/Users')

const app=express()
app.use(cors())
app.use(express.json())
app.use(express.static('File'))


mongoose.connect("mongodb://127.0.0.1:27017/images")
.then(console.log("db is connected"))
.catch(err =>console.log(err))

const storage=multer.diskStorage({
    destination:(req,file,cb)=> {
        cb(null,'File/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname +"_"+Date.now()+path.extname(file.originalname))
    }
})

const upload=multer({
    storage:storage
})

app.post('/upload',upload.single('file'),(req,res)=> {
   UserModel.create({image:req.file.filename})
   .then(result =>res.json(result))
   .catch(err =>console.log(err))
})

app.get('/getImage',(req,res)=> {
    UserModel.find()
    .then(users =>res.json(users))
    .catch(err =>console.log(err))
})

const port=5000
app.listen(port,()=>{
    console.log("server is running on port",port)
})