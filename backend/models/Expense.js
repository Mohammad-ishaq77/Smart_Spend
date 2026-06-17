const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
},

title: {
  type: String,
  required: true,
  trim: true,
},

description: {
  type: String,
  trim: true,
},

amount: {
  type: Number,
  required: true,
  min: 0,
},

category: {
  type: String,
  lowercase: true, 
  enum: [
    'food',
    'transport',
    'entertainment',
    'shopping',
    'utilities',
    'health',
    'other',
    'education',
  ],
  default: 'other',
},

paymentMethod: {
  type: String,
  enum: [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Mobile Wallet',
    'Bank Transfer',
  ],
  default: 'Cash',
},

date: {
  type: Date,
  default: Date.now,
},

},
{
timestamps: true,
}
);

module.exports = mongoose.model('Expense', expenseSchema);