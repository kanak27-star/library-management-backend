const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'Borrower', required: true },
  checkoutDate: { type: Date, required: true },
  checkinDate: { type: Date, default: null },
});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);

module.exports = Borrowing;