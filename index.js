const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');


const app = express();
const port = 5000;

//middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// user name : mydbuser604
// password: 1n4g0sajj20DsgRc


const uri = "mongodb+srv://mydbuser604:1n4g0sajj20DsgRc@cluster0.kf5gj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('familyMembers');
        const membersCollection = database.collection('members');

        // GET API
        app.get('/users', async (req,res)=>{
            const cursor = membersCollection.find({});
            const members = await cursor.toArray();
            res.send(members)
        });

        // UPDATE API
        app.get('/users/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const member = await membersCollection.findOne(query);
            res.send(member);
        })

        // POST API
        app.post('/users', async (req, res) => {
            console.log(req.body)
            const newMember = req.body;
            const result = await membersCollection.insertOne(newMember)
            console.log('getting the users');
            console.log(result)
            res.json(result)
        })

        //DELETE API
        app.delete('/users/:id', async (req,res)=>{
            const id = req.params.id;
            console.log('deleting user with an id', id);
            const query = {_id: ObjectId(id)};
            const result = await membersCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('Hitting the database.');
//   client.close();
// });

app.listen(port, () => {
    console.log(`App is listening from port ${port}`);
});