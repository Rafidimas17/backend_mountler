const mongoose = require("mongoose");
const {ObjectId}=mongoose.Schema;
const bankSchema = new mongoose.Schema({
  nameBank: {
    type: String,
    required: true
  },
  nomorRekening: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  itemId:{
    type:ObjectId,
    ref:"Item"
  },
 
})

bankSchema.pre('findOneAndDelete', async function (next) {
  const bank = this;

  try {
    // Hapus ID dari DetailItem
    await mongoose.model('Item').updateMany(
      { bankId: { $in: bank._id } },
      { $pull: { bankId: bank._id } }
    );
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Bank', bankSchema)