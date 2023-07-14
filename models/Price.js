const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema;
const PriceSchema=mongoose.Schema({
    price:{
        type:Number,
        required:true
    },
    itemId:{
        type:ObjectId,
        ref:"Item",
    }
})
module.exports=mongoose.model('Price',PriceSchema)