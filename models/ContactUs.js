const mongoose = require('mongoose');

const ContactUsSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
  
const ContactUs = mongoose.model('ContactUs', ContactUsSchema);
  
module.exports = ContactUs;