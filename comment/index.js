const express=require('express')
const bodyParser=require("body-parser")
const {randomBytes}=require("crypto")
const cors=require("cors")
const axios=require("axios")
const { type } = require('os')


const app=express()
app.use(bodyParser.json())
app.use(cors())

const commentByPostId={}

app.get("/post/:id/comment", (req, res)=>{
    res.send(commentByPostId[req.params.id] || [])
})

app.post("/post/:id/comment", async (req, res)=>{
    const {content}=req.body
    const commentId=randomBytes(4).toString("hex")

    const comments=commentByPostId[req.params.id] || []
    comments.push({id:commentId,content})
    commentByPostId[req.params.id]=comments
    await axios.post("http://localhost:4005/events",
        {
            type:"CommentCreated",
            data:{
                id:commentId,
                comments, 
                postId:req.params.id
            }

        }
    )
    res.status(201).send(comments)

})
app.post("/events",(req, res)=>{
  console.log(req.body.type)
  res.send({})
})

app.listen(4001, ()=>{
    console.log("Server listeing on port 4001")
})