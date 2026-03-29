import mongoose from "mongoose"

import bcrypt from "bcrypt"

import jwt from "jwt"


const UserSChema = new mongoose.Schema(
    {
        username:{
            type:String,
            required: true,
            lowecase: true,
            trim: true,
            index: true,
            unique: true,
        },
        emial:{
            type:String,
            required: true,
            lowecase: true,
            trim: true,
            unique: true,
        },
        fullname:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar:{
            type:String, //cloudnary url
            required: true,

        },
        coverImage:{
            type: String, //cloudnary url
            required: true,
        },
        watchHistory:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }],
        password:{
            type: String,
            required:[true,'password is required']
        },
        refreshToken:{
            type:String,
        }
},{
    timestamps:true
}
)

UserSChema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password =  await bcrypt.hash(this.password, 10)
    next()
})
UserSChema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
UserSChema.methods.generateAccessToken = function () {
    return jwt.sigh(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {  
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY


        }
    )

}
UserSChema.methods.generateRefreshToken = function () {
    return jwt.sigh(
        {
            _id: this._id,
            email: this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET,
        {  
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY


        }
    )
}


export const User = mongoose.model("User", UserSChema)
