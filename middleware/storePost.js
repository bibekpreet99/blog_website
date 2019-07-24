module.exports = (req,res,next)=>{
    if(!req.files){
        
        return res.redirect('/posts/new')
    }
    next()
}