import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.mjs"

export const auth= async (req,res,next) =>{
    const token = req.headers.authorization
    const data= jwt.verify(token.split(" ")[1], token, process.env.JWT_SECRET)
    const user = await UserModel.findOne({ _id: data.user.id})
    console.log(data);

if(!user){
    res.status(401).send({
        message: "Unauthorized"
    })
}


    next()
}