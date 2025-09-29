import express from "express"
import { createChatSchema, Role } from "./types"
import { createCompletion } from "./openrouter"
import { InMeomoryStore } from "./inMemoryStore"


const app = express()


app.post("/chat",async(req,res)=>{
   
    const {success,data} = createChatSchema.safeParse(req.body)

    const converstaionId = data?.conversationId ?? Bun.randomUUIDv7()

    if(!success){
        res.status(411).json(
           { message:"Incorrect Inputs"}
        )
        return
    }

    let existingMessages = InMeomoryStore.getInstance().get(converstaionId)

    res.setHeader("Content-Type","text/event-stream; charset=utf-8")
    res.setHeader("Connection-","keep-alive")


    let message = ""
    await createCompletion([...existingMessages,{
        role:Role.User,
        content:data.message
    }],data.message,(chunk:string)=>{ 
        message += chunk,
        res.write(chunk)

    })

    res.end()

    InMeomoryStore.getInstance().add(converstaionId,{content:data.message,role:Role.User})
    InMeomoryStore.getInstance().add(converstaionId,{content:data.message,role:Role.Agent})
})


app.listen(3000)

