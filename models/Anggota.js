// Anggota.js

const mongoose = require('mongoose');

const anggotaSchema = new mongoose.Schema({
  memberName: String,
  memberAddress: String,
  memberId: String,
  memberPhone: String,
  members: {
    memberName: String,
    memberAddress: String,
    memberId: String,
    memberPhone: String,
  },
});

const Anggota = mongoose.model('Anggota', anggotaSchema);

module.exports = Anggota;
