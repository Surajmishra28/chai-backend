import router from "../routes/user.routes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler (async (req, res ) =>{
    // get user detail from frontend
    //validatin  - not empty
    // check if user already exists
    // check for images,check for avatar
    // upload them on cloudinary,avatar
    // create user object - create entry in db
    //remove pass and refresh token field from response
    //check for user creation
    //return for user creation
    //return res


    const {fullname, email  ,username, password}= req.body
    console.log("email: ", email);

    if ( fullname === ""){
        throw new ApiError(400, "Fullname is required")
    }
    if ( email === ""){
        throw new ApiError(400, "Email is required")
    }
    if ( username === ""){
        throw new ApiError(400, "Username is required")
    }   
    if ( password === ""){
        throw new ApiError(400, "Password is required")
    }
 const existingUser = await User.findOne({
    $or:[{email},{username}]
});
if (existingUser){
    throw new ApiError(409, "User with email or username already exists")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;
if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
}
if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is required")
}
const avatar = await uploadToCloudinary(avatarLocalPath, "avatars");
const coverImage = await uploadToCloudinary(coverImageLocalPath, "coverImages");
 if (!avatar || !avatar.secure_url) 
{
    throw new ApiError(500, "Error while uploading avatar")
}
if (!coverImage || !coverImage.secure_url) 
{
    throw new ApiError(500, "Error while uploading cover image")
}
const newUser = await User.create({
    fullname,
    avatar: avatar.secure_url,
    coverImage: coverImage.secure_url,
    email,
    password,
    username: username.toLowerCase(),
})
 User.findByIdAndUpdate(user_id)

 const CreastedUser =await User.findById(user_id).select(
    "-password -refreshToken"

 )
 if (!CreastedUser){
    throw new ApiError(500, "User creation failed")
 }
 return res.status(201).json(new ApiResponse(201, CreastedUser, "User created successfully"))

 return res.status(201).json(
    new ApiResponse(201, CreastedUser, "User created successfully")
})


export {
    registerUser,
};