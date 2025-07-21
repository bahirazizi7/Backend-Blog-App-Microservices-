const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');

app.use(cors());
app.use(bodyParser.json());
const posts = {};

const eventHandler= (type, data) => {
  if(type === "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title,comments: [] };

        
    }   
  if(type ==="CommentCreated") {
        const { postId, id, content, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

  if(type === "CommentUpdated") {
        const { postId, id, comments, status } = data;  
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);
        comment.comments = comments;
        comment.status = status;
    }
}
app.post("/events", (req, res) => {
  
    const {type,data } = req.body;
    eventHandler(type, data);
    console.log(posts);
    res.send({});

})

app.get("/posts", (req, res) => {
  res.send(posts);
}); 

app.listen(4002, async() => {
  console.log('Server is running on port 4002');
  const res=await axios.get('http://localhost:4005/events')

  for(let event of res.data) {
    console.log("Processing event: ", event.type);
    eventHandler(event.type, event.data);
  } 
  

});