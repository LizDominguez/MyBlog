var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser");
    

mongoose.connect('mongodb://localhost/blog_app', {
  useMongoClient: true,
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));



var blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
    created:  {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } 
        else {
            res.render("index", {blogs: blogs}); 
        }
    })
});

app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create({}, function(err, newBlog){
       console.log(newBlog);
      if(err){
          res.render("new");
      } 
      else {
          res.redirect("/blogs");
      }
   });
});

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
      if(err){
          res.redirect("/");
      } 
      else {
          res.render("show", {blog: blog});
      }
   });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } 
      else {
          res.render("edit", {blog: foundBlog});
      }
   });
});

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      } 
      else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blogs");
      } 
      else {
          res.redirect("/blogs");
      }
   });
});


app.listen(process.env.PORT, process.env.IP);