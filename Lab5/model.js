let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
	title : { type : String, required : true },
    content : { type : String, required : true },
    author: { type: String, required : true },
    publishDate: { type: Date, required : true },
	id : { type : String, required : true }
});

let Post = mongoose.model( 'Post', postSchema );

let PostList = {
	get : function(){
		return Post.find()
				.then( posts => {
					return posts;
				})
				.catch( err => {
					throw Error( err );
				});
    },
    getByAuthor : function(author){
        return Post.find({
                author: author
            })
            .then( posts => {
                return posts;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    getById: function(id){
        return Post.findOne({
                id: id
            })
            .then( post => {
                return post;
            })
            .catch( err => {
                throw Error( err );
            });
    },
	post : function( newPost ){
        console.log("Received ");
        console.log(newPost);
        return Post.create( newPost )
				.then( post => {
                    console.log("Post is actually");
                    console.log(post);
					return post;
				})
				.catch( error => {
                    console.log("ERROR: ", error);
					throw Error(error);
				});
    },
    delete : function(id){
        Post.deleteOne({
                id: id
            })
            .catch( error => {
                throw Error(error);
            });
    },
    put : function(id, newPost){
        return Post.updateOne({
                id: id
            },{
                newPost
            })
            .then( post => {
                return post;
            })
            .catch( error => {
                throw Error(error);
            });
    }
};

module.exports = { PostList };