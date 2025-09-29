import type { Message } from "./types"


const Eviction_Time = 5 * 60 * 1000
const Eviction_Clock_Time = 5 * 60 * 1000


export class InMeomoryStore {


    private static store: InMeomoryStore
    
    private store: Record<string,{
        messages:Message[],
        evictionTime:number

    }>

    private clock: NodeJS.Timeout


    private constructor(){
       this.store = {}
       this.clock = setInterval(()=>{
                Object.entries(this.store).forEach(([key,{evictionTime}])=>{
                    if(evictionTime>Date.now()){
                        delete this.store[key]
                    }
                })
       },Eviction_Clock_Time)
    }

    
    public destroy (){
        clearInterval(this.clock)
    }

    static getInstance (){
        if(!InMeomoryStore.store){
            InMeomoryStore.store = new InMeomoryStore()
        }
        return InMeomoryStore.store
    }

    get (converstaionId:string) : Message[] {
        return this.store[converstaionId]?.messages ?? []
    }
    
    
    add (converstaionId:string,message:Message){
        if(!this.store[converstaionId]){
            this.store[converstaionId] = {
                messages:[],
                evictionTime:Date.now() + Eviction_Time
            }
        }
        this.store[converstaionId]?.messages.push(message)
        this.store[converstaionId].evictionTime = Date.now() + Eviction_Time


    }


}

