const express = require('express')
var uuid = require('node-uuid');
const morgan = require('morgan')
const mongoose = require('mongoose');
let bodyParser = require( "body-parser" );
let { PostList } = require('../model');
let { DATABASE_URL, PORT } = require('../config');

const app = express()

let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

app.use( express.static( "public" ) );
app.use( morgan( "dev" ) );

app.use(express.urlencoded({extended: true}))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});

// Array of posts
/*
posts = [
    {
        id: 1,
        title: "Artificial Intelligence and its impact on frogs",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc pulvinar sapien et ligula ullamcorper malesuada. Ut etiam sit amet nisl purus in mollis. Massa tincidunt dui ut ornare lectus sit amet. Quam quisque id diam vel.",
        author: "Sam Frogman",
        publishDate: "2019-02-12T03:09:45.234"
    },
    {
        id: 2,
        title: "How to change the molecules of your spoon to make a fork",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Imperdiet dui accumsan sit amet. Ut enim blandit volutpat maecenas volutpat blandit aliquam etiam. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et.",
        author: "Mike Silverware",
        publishDate: "2017-06-11T04:08:46.123"
    }
];
*/

function postExists(id){
    PostList.getById(id).then(res => {
        return res !== {};
    });
}

function addPost(post){
    post.id = uuid.v1();
    console.log(post);
    return PostList.post(post);
}

function retrievePost(id){
    return PostList.getById(id);
}

function retrieveByAuthor(author){
    return PostList.getByAuthor(author);
}

function deletePost(id){
    PostList.delete(id);
}

function retrieveAllPosts(){
    return PostList.get();
}

function update(post){
    return PostList.put(post.id, post);
}

app.get('/blog-posts', (req, res) => {
    let postsPromise = retrieveAllPosts(); // get()
    postsPromise.then(posts => {
        res.status(200).send(posts);
    })
})

app.get('/blog-post', (req, res) => {
    if(!req.query.author) res.status(406).send();
    let posts = retrieveByAuthor(req.query.author); // get(author)
    if(posts.length == 0) res.status(404).send();
    else res.status(200).send(posts);
})

app.post('/blog-posts', (req, res) => {
    console.log("Reached endpoint");
    let fields = ["title", "content", "author", "publishDate"];
    var missingField = false;
    var newPost = {};
    fields.forEach(field => {
        if(!req.body[field]) {
            missingField = true;
        }
        else newPost[field] = req.body[field];
    });

    if(missingField) res.status(406).send();
    else {
        newPost = addPost(newPost); // post(post)
        res.status(201).send(newPost);
    }
})

app.delete('/blog-posts/:id', (req, res) => {
    if(postExists(req.params.id)){ // getById(id)
        deletePost(req.params.id); // delete(id)
        res.status(200).send();
    }
    else{
        res.status(404).send();
    }
})

app.put('/blog-posts/:id', (req, res) => {
    let fields = ["title", "content", "author", "publishDate"];
    if(!req.body.id) res.status(406).send();
    else if(req.body.id != req.params.id) res.status(409).send();
    else if(!postExists(req.body.id)) res.status(404).send();
    else{
        var post = retrievePost(req.body.id);
        fields.forEach(field => {
            if(req.body[field]) post[field] = req.body[field];
        });
        update(post); // put(id, post)
        res.status(202).send(post);
    }
})

let server;

function runServer(port, databaseUrl){
    return new Promise( (resolve, reject) => {
        mongoose.connect(databaseUrl, res => {
            if(res) return reject(res);
            else {
                server = app.listen(port, () => {
                    console.log(`Example app listening on port ${port}!`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    return reject(err);
                })
            }
        });
    });
}

function closeServer(){
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if(err) return reject(err);
                    else resolve();
                });
            });
        });
}

runServer(PORT, DATABASE_URL)
    .catch(err => console.log(err));

module.exports = { app, runServer, closeServer };