const {check,validationResult}=require('express-validator')

exports.runValidation=(req,res,next)=>{
    const error=validationResult(req)
    if(!error.isEmpty()){
        return res.status(404).json({
            status:false,
            message:error.array()[0].msg
        })
    }
    next()
}
exports.validationDaftar=[
    check('username','username tidak boleh kosong').notEmpty(),
    check('email','email tidak boleh kosong').notEmpty().matches(/.+\@.+\..+/).withMessage('email harus ada tanda @'),
    check('password','password tidak boleh kosong').notEmpty().isLength({min:6}).withMessage('password minimal 6 karakter')
]

exports.validationLogin=[
    check('username','username tidak boleh kosong').notEmpty(),
    check('password','password tidak boleh kosong').notEmpty()
]