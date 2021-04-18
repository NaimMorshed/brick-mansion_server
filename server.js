const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
const PORT = 5000

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gw0op.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('hello world')
})

client.connect(err => {
    console.log("Database connected...");
    const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);
    const userBookings = client.db(process.env.DB_NAME).collection("userBookings");

    // Post data
    app.post('/addData', (req, res) => {
        const pd = req.body;
        collection.insertMany(pd)
            .then(result => { 
                res.send({result})
            })
            .catch(err => res.send({err}))
    })

    // Post data --userBookings
    app.post('/addBookings', (req, res) => {
        const pd = req.body;
        userBookings.insertMany(pd)
            .then(result => { 
                res.send({result})
            })
            .catch(err => res.send({err}))
    })

    // Get Data --userBookings
    app.get('/getBookings', (req, res) => {
        userBookings.find({token: req.query.token})        
            .toArray((err, doc) => {
                res.send(doc);
            })
    })

    // Get All Data --userBookings
    app.get('/getAllBookings', (req, res) => {
        userBookings.find({})        
            .toArray((err, doc) => {
                res.send(doc);
            })
    })

    // Get Data
    app.get('/getData', (req, res) => {
        collection.find({token: req.query.token})        
            .toArray((err, doc) => {
                res.send(doc);
            })
    })

    // Delete Data
    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send({result})
        })
    })

    // Update data
    app.patch('/update/:id', (req, res) => {
        userBookings.updateOne({_id: ObjectId(req.params.id)}, {
            $set: {
                status: req.body.status
            }
        })
        .then(result => {
            res.send({result});
        })
    })
});

app.listen(process.env.PORT || PORT)