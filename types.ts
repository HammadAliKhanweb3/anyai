import {z} from "zod"


const MAX_TOKEN = 1000

const SUPPORTER_MODELS=["x-ai/grok-4-fast:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "deepseek/deepseek-chat-v3.1:free",
    "openai/gpt-oss-120b:free"]
   

export const createChatSchema = z.object({
conversationId:z.uuid(), 
message: z.string().max(MAX_TOKEN),
model:z.enum(SUPPORTER_MODELS)

})


export type Message =  {
content:string,
role:Role
}

export type Messages = Message[]

export enum Role {
    Agent = "assistant",
    User = "user",

}

export type Model = typeof SUPPORTER_MODELS[number]
   
   
