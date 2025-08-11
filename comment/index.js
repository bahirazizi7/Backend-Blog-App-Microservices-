const express=require('express')
const bodyParser=require("body-parser")
const {randomBytes}=require("crypto")
const cors=require("cors")
const axios=require("axios")
const { type } = require('os')
const { stat } = require('fs')


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
    comments.push({id:commentId,content,status:"pending"})
    commentByPostId[req.params.id]=comments
    await axios.post("http://event-bus-srv:4005/events",
        {
            type:"CommentCreated",
            data:{
                id:commentId,
                content, 
                postId:req.params.id,
                status:"pending"
            }

        }
    )
    res.status(201).send(comments)

})
app.post("/events",async (req, res)=>{

    const {type, data}=req.body
    console.log("Received event: ", type)
    if(type==="CommentModerated"){
        const {id, postId, status,content}=data
        const comments=commentByPostId[postId]
        const comment=comments.find(comment=>comment.id===id)
        comment.status=status

        axios.post("http://event-bus-srv:4005/events", {
            type:"CommentUpdated",
            data:{
                id, postId, status, content
            }
        })
    }   
  res.send({})
})

app.listen(4001, ()=>{
    console.log("Server listeing on port 4001")
})