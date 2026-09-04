require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const app=express()
const path=require('path')

const AdminRoutes=require('./Routes/AdminAuth')
const FoodItems=require('./Routes/FoodRoute')
const TableSettingsRoutes = require('./Routes/TableSettings');
const UserRoutes=require('./Routes/UserAuth')
const orders=require('./Routes/OrderRoute')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// Local uploads (legacy); new menu images use S3 URLs stored in MongoDB
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/admin',AdminRoutes)
app.use('/api/foods',FoodItems)
app.use('/api/tables', TableSettingsRoutes);
app.use('/api/users',UserRoutes)
app.use('/api/orders',orders)

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log('mongodb connected succesful')
    
console.log("================================");
console.log("CLOUDINARY CONFIG CHECK");
console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
  "API key exists:",
  Boolean(process.env.CLOUDINARY_API_KEY)
);
console.log(
  "API secret exists:",
  Boolean(process.env.CLOUDINARY_API_SECRET)
);
console.log("================================");
}).catch((err)=>{
    console.log(err)
})


// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  const s3Vars = ['AWS_REGION', 'AWS_S3_BUCKET_NAME', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
  const s3Missing = s3Vars.filter(k => !process.env[k]);

  const routes = [
    { method: 'POST',   path: '/api/admin/register'           },
    { method: 'POST',   path: '/api/admin/login'              },
    { method: 'POST',   path: '/api/foods/upload'             },
    { method: 'GET',    path: '/api/foods/fooditems/:adminId'  },
    { method: 'GET',    path: '/api/foods/users/fooditems/:email' },
    { method: 'GET',    path: '/api/foods/:id'                },
    { method: 'PUT',    path: '/api/foods/edit/:id'           },
    { method: 'DELETE', path: '/api/foods/:id'                },
    { method: 'GET',    path: '/api/tables'                   },
    { method: 'POST',   path: '/api/users/login'              },
    { method: 'GET',    path: '/api/orders'                   },
  ];

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: {
        status: dbStateMap[dbState] || 'unknown',
        ok: dbState === 1,
      },
      s3: {
        configured: s3Missing.length === 0,
        missingVars: s3Missing.length ? s3Missing : undefined,
        bucket: process.env.AWS_S3_BUCKET_NAME || null,
        region: process.env.AWS_REGION || null,
      },
    },
    registeredRoutes: routes,
  });
});

const PORT=5000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT} `)
    console.log(`Health check → http://localhost:${PORT}/api/health`)
})