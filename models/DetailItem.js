const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema;
const DetailItemSchema=mongoose.Schema({
    itemId:[{
        type:ObjectId,
        ref:"Item"
    }],
    userId:{
        type:ObjectId,
        ref:"Users"
    },
    trackId:[{
        type:ObjectId,
        ref:"Track"
    }],
    memberId:[{
        type:ObjectId,
        ref:"Member"
    }],
    bankId:[{
        type:ObjectId,
        ref:"Bank"
    }],
    categoryId:[{
        type:ObjectId,
        ref:"Category"
    }]
})
module.exports=mongoose.model('DetailItem',DetailItemSchema)