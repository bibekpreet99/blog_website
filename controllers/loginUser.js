const User = require('../database/models/User')
const bcrypt = require('bcrypt')

module.exports = (req, res)=>{
    const { email, password } = req.body

    User.findOne({email}, (err, user)=>{
        if(err) throw err
        else if(user){
            bcrypt.compare(password, user.password, (error, same)=>{
                if(error) throw error
                else if(same){
                    req.session.userId = user._id
                    res.redirect('/')
                }
                else{
                    res.redirect('/auth/login')
                }
            })
        }
        else{
            res.redirect('/auth/login')
        }
    })
}