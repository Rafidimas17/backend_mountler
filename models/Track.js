const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema;

const trackSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    province:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    village:{
        type:String,
        required:true,
    },
    itemId: {
        type: ObjectId,
        ref: 'Item'
      },
   
})
trackSchema.pre('findOneAndDelete', async function (next) {
    const track = this;
  
    try {
      // Hapus ID dari DetailItem
      await mongoose.model('Item').updateMany(
        { trackId: { $in: track._id } },
        { $pull: { trackId: track._id } }
      );
      
      next();
    } catch (error) {
      next(error);
    }
  });
module.exports=mongoose.model('Track',trackSchema)