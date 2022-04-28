const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5055;
console.log(process.env.DB_USER)

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World! I Am Akash')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifp7e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err);
  const blogsCollection = client.db("Post").collection("post");
  const commentCollection = client.db("Post").collection("comment");
  // perform actions on the collection object
 

  app.get('/addPosts', (req, res) => {
    blogsCollection.find()
      .toArray((error, items) => {
        res.send(items)
      })
  })






  app.post('/addPosts', (req, res) => {
    const newBlogs = req.body;
    console.log('adding new blogs', newBlogs)
    blogsCollection.insertOne(newBlogs)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })


 
  app.get('/addPost/:id', (req, res) => {
    blogsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((error, items) => {
        res.send(items)
      })
  })

  app.get('/addComments', (req, res) => {
    commentCollection.find()
      .toArray((error, value) => {
        res.send(value)
      })
  })

  app.post('/addComments', (req, res) => {
    const newComments = req.body;
    console.log('adding new comments', newComments)
    commentCollection.insertOne(newComments)
      .then(result => {
        console.log('inserted count', newComments)
        res.send(result.insertedCount > 0)
      })
  })
 


  // client.close();

});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})