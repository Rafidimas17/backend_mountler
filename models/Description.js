const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema;
const DescriptionSchema=mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    itemId:{
        type:ObjectId,
        ref:"Item",
    }
})
module.exports=mongoose.model('Description',DescriptionSchema)