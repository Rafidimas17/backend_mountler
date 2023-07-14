const nodemailer = require('nodemailer')

exports.kirimEmail=(dataEmail)=>{
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "inccakrawala@gmail.com",
        pass: "njdnzqewefphainy",
      },
    });
   return(
    transporter.sendMail(dataEmail)
    .then(info=>console.log(`Email Terkirim : ${info.message} `))
    .catch(error=>console.log(`Terjadi kesalahan : ${error} `))
   )
}