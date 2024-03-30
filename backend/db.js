const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  const userSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 40
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength:13
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 7,
        maxLength: 30
    },
    hobbies: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const User = mongoose.model('User', userSchema);

module.exports={
    User
};