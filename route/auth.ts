import { Router } from "express"
import { sendMail } from "../nodemailer"
import { CreateUser, SignIn } from "../types"
import speakeasy from "speakeasy"
import jwt from "jsonwebtoken"


const router = Router()

const speakEasySecret = process.env.SPEAK_EASY_SECRET_KEY!

const otpCache = new Map<string,string>()

router.post("/signup/initiate",async(req,res)=>{

  try {
      const {success,data} = CreateUser.safeParse(req.body)
  
      if(!success){
       res.status(400).json({ message: "Invalid input" })
       return
      }
  
  
      const otp =  speakeasy.totp({ secret:speakEasySecret,encoding:"base32"})
      console.log("GENERATED OTP:",otp);
  
     
  
       
    await sendMail(data.email,otp)     

     otpCache.set(data.email, otp)
  
      res.status(200).json({ message: "Check your email for otp" })
      
  
  
  } catch (error) {
    console.log(error);
    res.status(500).json({
        message:"Internal server error",
        success:false
    })
    
  }

})


router.post("/signin",(req,res)=>{

    
        const {success,data} = SignIn.safeParse(req.body)
    
        if(!success){
            res.status(400).json("Invalid Input")
            return
        }
        
        if(otpCache.get(data.email) !=data.otp){
         console.log("Invalid otp");         
        }

        const userId = "hammad"
        jwt.sign({
            userId
        },process.env.JSON_WEB_TOKEN_SECRET!)


})

export default router