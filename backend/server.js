const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()
const app=express()
const path=require('path')

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log('mongodb connected succesful')
}).catch((err)=>{
    console.log(err)
})

const PORT=5000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT} `)
})