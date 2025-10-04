import nodemailer from "nodemailer"




export const  sendMail = async(email:string,otp:string): Promise<void> =>{

    const transporter = nodemailer.createTransport(
        {
            service:"gmail",
            auth:{
                user:'khan302hammad@gmail.com',
                pass:"Khan@580459"
            }
        }
    )

    const info = await transporter.sendMail(
        {
            from: "anyai Verfication",
            to:email,
            subject:"Your OTP Code",
            text:`your OTP is: ${otp}`
        }
    )

    console.log("Message sent:",info.messageId);
}




 





