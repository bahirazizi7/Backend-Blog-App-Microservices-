const express=require('express')
const bodyParser=require("body-parser")
const {randomBytes}=require("crypto")
const cors=require("cors")

const app=express()
app.use(bodyParser.json())
app.use(cors())

const commentByPostId={}

app.get("/post/:id/comment", (req, res)=>{
    res.send(commentByPostId[req.params.id] || [])
})

app.post("/post/:id/comment", (req, res)=>{
    const {content}=req.body
    const commentId=randomBytes(4).toString("hex")

    const comments=commentByPostId[req.params.id] || []
    comments.push({id:commentId,content})
    commentByPostId[req.params.id]=comments

    res.status(201).send(comments)

})

app.listen(4001, ()=>{
    console.log("Server listeing on port 4001")
})