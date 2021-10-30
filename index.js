const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.686iy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('travelBooking');
        const servicesCollection = database.collection('services');
        const myBookingCollection = database.collection('myBookings');
        //GET service API
        app.get('/services', async(req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET MYBOOKING API
        app.get('/myBookings', async(req, res)=>{
            const cursor = myBookingCollection.find({});
            const myBookings = await cursor.toArray();
            res.send(myBookings);
        })
        //POST SERVICE API
        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log('hit the post API',service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);

        
        })

        //POST myBooking API
    app.post('/myBookings', async(req, res)=>{
        const myBooking = req.body;
        const data = await myBookingCollection.insertOne(myBooking);
        res.json(data);
    })

    //DELETE myBooking API
    app.delete('/myBookings/:id', async(req, res)=>{
        const id = req.params.id;
        const query={_id:ObjectId(id)}
        const result = await myBookingCollection.deleteOne(query);
        console.log('delete id',result);
        res.json(result);
    });

    //DELETE userBooking API
    app.delete('/myBookings/:id', async(req, res)=>{
        const id = req.params.id;
        const query={_id:ObjectId(id)}
        const result = await myBookingCollection.deleteOne(query);
        console.log('delete id',result);
        res.json(result);
    });

    }
    finally{}
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Hello World');
})

app.listen(port, ()=>{
    console.log('Running Server Port',port);
})