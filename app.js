//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "The internet is flooded with millions of blogs, covering every topic under the sun. But the thing is, this blog is special. It's a unique and groundbreaking experience";
const aboutContent = "I could tell you that I'm a world-renowned cheese sculptor, or that I hold the world record in 'fastest time to eat a whole watermelon without using your hands'." 


const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



//Connection to MongoDB database
//⁡⁢⁣⁣This line will specify the port where we will access our MongoDB Server
//⁡⁢⁣⁣Here "fruitsDB" is the name of the database where we want to connect to.⁡
mongoose.connect("mongodb+srv://daneidenbenz:4I8fUeOA6l5PkOtd@cluster0.gq9pxna.mongodb.net/test", {
  useNewUrlParser: true
});


//Creating Schema for the posts
const postSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){

  //Find all items in the Posts collection and render it into our home page.
  Post.find().then(posts => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});



app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
 });
 
 app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
 });
 
 app.get("/compose", function(req, res){
  res.render("compose");
 
 });

 

 app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })


  //We are saving the post through our compose route and redirecting 
  //back into the home route. A message will be displayed in our console 
  //when a post is being saved.
 
  post.save().then(() => {
 
    console.log('Post added to DB.');
 
    res.redirect('/');
 
  })
 
  .catch(err => {
 
    res.status(400).send("Unable to save post to database.");
 
  });
 
 
});

app.get("/posts/:postId", function(req, res){
  //We are storing the _id of our created post in a variable named requestedPostId
  const requestedPostId = req.params.postId;
 
  //Using the find() method and promises (.then and .catch), we have rendered the post into the designated page.
 
  Post.findOne({_id:requestedPostId})
  .then(function (post) {
    res.render("post", {
            title: post.title,
            content: post.content
          });
    })
    .catch(function(err){
      console.log(err);
    })

 
});
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
