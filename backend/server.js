const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()
const app=express()
const path=require('path')

const AdminRoutes=require('./Routes/AdminAuth')
const FoodItems=require('./Routes/FoodRoute')
const TableSettingsRoutes = require('./Routes/TableSettings');
const UserRoutes=require('./Routes/UserAuth')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/admin',AdminRoutes)
app.use('/api/foods',FoodItems)
app.use('/api/tables', TableSettingsRoutes);
app.use('/api/users',UserRoutes)

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