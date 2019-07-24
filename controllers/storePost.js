const path = require('path')
const Post = require('../database/models/Post')
const cloudinary = require('cloudinary')



module.exports = (req, res)=>{
    const { image } = req.files;
    const imagePath = path.resolve(__dirname, '..','public/posts', image.name)
    image.mv(imagePath, (err)=>{
        cloudinary.v2.uploader.upload(imagePath, (err, result)=>{
            if(err){
                return res.redirect('/')
            }
            console.log(req.session);
            
            Post.create({
                ...req.body,
                image: result.secure_url,
                author: req.session.userId
            }, (err, post)=>{
                console.log(post)
                res.redirect('/')
            })
        })
        
    })
}