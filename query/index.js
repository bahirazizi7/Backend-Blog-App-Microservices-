const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
const posts = {};
app.post("/events", (req, res) => {
  
    const {type,data } = req.body;
    if(type === "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title,comments: [] };

        
    }   
  if(type ==="CommentCreated") {
        const { postId, id, comments, status } = data;
        const post = posts[postId];
        post.comments.push({ id, comments, status });
    }
    console.log(posts);
    res.send({});

})

app.get("/posts", (req, res) => {
  res.send(posts);
}); 

app.listen(4002, () => {
  console.log('Server is running on port 4002');
});