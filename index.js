const express = require("express")
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

// use middleware
app.use(cors());
app.use(express.json())

//user: dbuser1
//password: f6kAfQTYhsJrvlnT


const uri = "mongodb+srv://dbuser1:f6kAfQTYhsJrvlnT@cluster0.iaanr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// async function run(){
//     try{
//         await client.connect();
//         const userCollection = client.db("foodExpress").collection("user");
//         const user = {name: 'Musleh', email: 'musleh@gmail.com'};
//         const result = await userCollection.insertOne(user);
//         console.log(`user inserted with id: ${result.insertedId}`);
//     }
//     finally{

//     }
// }
// run().catch(console.dir)

async function run(){
    try{
        await client.connect();
        const userCollection = client.db('foodExpress').collection('user');

        //get user
        app.get('/user', async(req, res) =>{
            const query = { };
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })

        app.get('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        //POST user: add a new user
        app.post('/user', async(req, res) =>{
            const newUser = req.body;
            console.log('add new user', newUser)
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        });

        // update user 
        app.put('/user/:id', async(req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        //delete a user
        app.delete('/user/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) =>{
    res.send('Running my node curd server');
})
app.listen(port,() =>{
    console.log('curd server is running');
})