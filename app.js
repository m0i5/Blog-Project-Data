//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "The internet is flooded with millions of blogs, covering every topic under the sun. But the thing is, this blog is special. It's a unique and groundbreaking experience. We could talk about the intricacies of quantum physics or the complex nuances of political theory, but let's face it, not everyone finds those topics interesting. So instead, let's take a moment to appreciate the lyrical genius that is Lil Wayne. Starting with a deep-dive into some of Lil Wayne's most iconic lyrics. 'Life is a beach, I'm just playing in the sand' from his hit song '6 Foot 7 Foot' reminds us to live in the moment and enjoy the simple things in life. And who could forget the unforgettable line from 'Lollipop': 'She say I'm like a lollipop, she say I'm like a lollipop, she say I'm like a lollipop' - truly a lyrical masterpiece. So next time you're feeling bogged down by the weight of the world, just remember Lil Wayne's words of wisdom: 'Money over everything, money on my mind' (from 'Mirror'). Thanks, Lil Wayne, for always keeping it real."

const aboutContent = "I could tell you that I'm a world-renowned cheese sculptor, or that I hold the world record in 'fastest time to eat a whole watermelon without using your hands'. Now, all jokes aside, the real reason I created this blog was to gain a better understanding of embedded Javascript templating and databases. Simple as that";
const contactContent = "Blippity bloppity boo, welcome to the contact page of the intergalactic space unicorn, where we communicate through telepathy and interpretive dance. Our communication channels are powered by the farts of a thousand rainbow-colored jellyfish, which transmit your messages directly to our brains. If you prefer a more traditional approach, you can also send us a message through the quantum mailbox located in the seventh dimension, or by sending a carrier pigeon made of stardust to our headquarters on the planet Zog. Whatever your preferred method of communication, we look forward to hearing from you and joining forces to conquer the universe with the power of love and glitter.";

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
