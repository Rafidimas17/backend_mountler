const mongoose=require('mongoose')

const ProfileSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    resetPassword:{
        type:String,
        default:""
    },
    tokenAktivasi:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        required:true,
    },
})

module.exports=mongoose.model("Profile",ProfileSchema)