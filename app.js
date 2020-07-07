//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);
///////////////////////////// target all items ////////////////////////
app.route("/articles")
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})
.post(function(req, res){
    Article.find(function(err, foundArticles){
        console.log();
        console.log();
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("Succesfully added new article!");
            } else {
                res.send(err);
            }
        });
    });
})
.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("succesfully delete all artciles!");
        } else {
            res.send(err);
        }
    });
});

//////////////////////// target a specific item /////////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(!err){
            res.send(foundArticle);
        } else {
            res.send("no matches with this article");
        }
    });
})
.put(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if (!err){
          res.send("Successfully updated the content of the selected article.");
        } else {
          res.send(err);
        }
      });
})
.patch(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if (!err){
          res.send("Successfully updated the title of the selected article.");
        } else {
          res.send(err);
        }
      });
})
.delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if (!err){
          res.send("Successfully deleted this article.");
        } else {
          res.send(err);
        }
    });
});

//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});