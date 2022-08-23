//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');


const homeStartingContent = "Hi! This is Chandrima here. Your friendly neighbourhood programmer. And this is my journal.";
const aboutContent = "I love cold-coffee. I love MARVEL movies.";


const app = express();
var ObjectId = mongoose.Types.ObjectId;

mongoose.connect("mongodb+srv://charocho99:123op@cluster0.ce9tafw.mongodb.net/blogDB");
const postSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  content: String
})
const Post = mongoose.model("Post",postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get('/',function(req,res){
  Post.find({},function(err,posts){
    res.render('home',{startingContent:homeStartingContent,posts:posts});
  })
})

app.get('/about',function(req,res){
  res.render('about',{aboutContent:aboutContent});
})

app.get('/contact',function(req,res){
  res.render('contact');
})

app.get('/compose',function(req,res){
  res.render('compose');
})

app.get('/posts/:postId',function(req,res){
  // console.log(req.params.postId);
  const requestedPostId= req.params.postId;
  // console.log(requestedPostId);
  Post.findOne({_id:requestedPostId},function(err,post){
    res.render('post',{a1:post.title,b1:post.content});
  });
})

app.get('/update',function(req,res){
  Post.find({},function(err,posts){
    res.render('update',{posts:posts});
  })
})

app.post('/compose',function(req,res){
  // console.log(req.body.postTitle);
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  })
  post.save(function(err){
    if(!err){
      res.redirect('/');
    }
  });
  
})

app.post('/update',function(req,res){
  var deleteItemId = req.body.updateButton;
  // console.log(deleteItemId);
  Post.findByIdAndRemove(ObjectId(deleteItemId),function(err,docs){
    if(!err){
        // console.log("successfully deleted");
        res.redirect('/');
    }else{
      console.log(err);
    }
})
})




let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, function() {
  console.log("Server started on port "+port);
});
