const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter username']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter password']
    }
})

userSchema.pre('save', function(next){
    const user = this
    console.log(user)
    bcrypt.hash(user.password, 10, (err, encryptpass)=>{
        user.password = encryptpass
        next()
    })
})


const User = mongoose.model('User', userSchema)

module.exports = User