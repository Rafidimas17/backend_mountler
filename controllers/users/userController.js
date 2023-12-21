require("dotenv").config();
const Users = require("../../models/Profile");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const { kirimEmail } = require("../../helpers/UserHelpers");

module.exports = {
  DaftarUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const usernameFind = await Users.findOne({ username: username });
      const emailFind = await Users.findOne({ email: email });
      if (usernameFind) {
        return res.status(402).json({
          message: "Username telah tersedia",
        });
      }

      if (emailFind) {
        return res.status(404).json({
          message: "Email telah tersedia",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const tokenAktivasi = crypto.randomBytes(64).toString("hex");
      const createUsers = {
        username,
        email,
        password: hashPassword,
        tokenAktivasi,
        isVerified: false,
      };
      // html:`<a href=${process.env.CLIENT_URL}/verify-email/${tokenAktivasi}>Aktivasi Email</a>`
      await Users.create(createUsers);
      const templateEmail = {
        from: "Cakrawala",
        to: email,
        subject: "Aktivasi Email",
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
          <html>
            <head>
              <!-- Compiled with Bootstrap Email version: 1.3.1 -->
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta http-equiv="x-ua-compatible" content="ie=edge">
              <meta name="x-apple-disable-message-reformatting">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
              <style type="text/css">
                body,table,td{font-family:Helvetica,Arial,sans-serif !important}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}*{color:inherit}a[x-apple-data-detectors],u+#body a,#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}img{-ms-interpolation-mode:bicubic}table:not([class^=s-]){font-family:Helvetica,Arial,sans-serif;mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;border-collapse:collapse}table:not([class^=s-]) td{border-spacing:0px;border-collapse:collapse}@media screen and (max-width: 600px){.w-full,.w-full>tbody>tr>td{width:100% !important}.w-24,.w-24>tbody>tr>td{width:96px !important}.w-40,.w-40>tbody>tr>td{width:160px !important}.p-lg-10:not(table),.p-lg-10:not(.btn)>tbody>tr>td,.p-lg-10.btn td a{padding:0 !important}.p-3:not(table),.p-3:not(.btn)>tbody>tr>td,.p-3.btn td a{padding:12px !important}.p-6:not(table),.p-6:not(.btn)>tbody>tr>td,.p-6.btn td a{padding:24px !important}*[class*=s-lg-]>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-4>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-6>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}.s-10>tbody>tr>td{font-size:40px !important;line-height:40px !important;height:40px !important}}
              </style>
            </head>
            <body class="bg-light" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
              <table class="bg-light body" valign="top" role="presentation" border="0" cellpadding="0" cellspacing="0" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
                <tbody>
                  <tr>
                    <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0;" align="left" bgcolor="#f7fafc">
                      <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tbody>
                          <tr>
                            <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
                              <!--[if (gte mso 9)|(IE)]>
                                <table align="center" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td width="600">
                              <![endif]-->
                              <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
                                <tbody>
                                  <tr>
                                    <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                                      <table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                        <tbody>
                                          <tr>
                                            <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
                                              &#160;
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table class="ax-center" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                        <tbody>
                                          <tr>
                                            <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                                              <img class="w-24" src="https://www.mountler.com/images/logo.png" style="height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; width: 96px; border-style: none; border-width: 0;" width="96">
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                        <tbody>
                                          <tr>
                                            <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
                                              &#160;
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table class="card p-6 p-lg-10 space-y-4" role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;" bgcolor="#ffffff">
                                        <tbody>
                                          <tr>
                                            <td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px;" align="left" bgcolor="#ffffff">
                                              <h1 class="h3 fw-700" style="padding-top: 0; padding-bottom: 0; font-weight: 700 !important; vertical-align: baseline; font-size: 28px; line-height: 33.6px; margin: 0;" align="center">
                                                Aktivasi akun 
                                              </h1>
                                              <table class="s-4 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                <tbody>
                                                  <tr>
                                                    <td style="line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left" width="100%" height="16">
                                                      &#160;
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <p class="" style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="center">
                                                Halo, ${username} <span>&#128075;</span>
                                                </p>
                                                <p class="" style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="center">
                                                Kami mengirim email ini karena kami perlu mengaktifkan akun kamu. Klik tombol di bawah ini untuk mengaktifkan akunmu:
                                                </p>
                                              <table class="s-4 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                <tbody>
                                                  <tr>
                                                    <td style="line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left" width="100%" height="16">
                                                      &#160;
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <table class="btn btn-red-300 rounded-full fw-800 text-5xl py-4 ax-center  w-full w-lg-80" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="border-radius: 9999px; border-collapse: separate !important; width: 320px; font-size: 48px; line-height: 57.6px; font-weight: 800 !important; margin: 0 auto;" width="320">
                                                <tbody>
                                                  <tr>
                                                    <td style="line-height: 24px; font-size: 16px; border-radius: 9999px; width: 320px; font-weight: 800 !important; margin: 0;" align="center" bgcolor="#00ace3" width="320">
                                                      <a href=${process.env.CLIENT_URL}/verify-email/${tokenAktivasi} style="color: #FFFF; font-size: 16px; font-family: Poppins; text-decoration: none; border-radius: 9999px; line-height: 20px; display: block; font-weight: 800 !important; white-space: nowrap; background-color: #00ace3; padding: 16px 12px; border: 1px solid #00ace3;">Aktivasi Akun</a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <p class="" style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; margin-top:10px;" align="center">
                                                      Aktivasi akun kamu dan mari kita mulai petualangan seru pendakian kamu. 
                                                      </p>
                                                      <p style="line-height: 20px; font-size: 16px; width: 100%; margin: 0;" align="center"><strong>Cakrawala Team</strong></p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                        <tbody>
                                          <tr>
                                            <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                              &#160;
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if (gte mso 9)|(IE)]>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                              <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </body>
          </html>
          `,
      };
      kirimEmail(templateEmail);

      return res.status(200).json({
        message: `Email aktivasi telah terkirim ke ${email} `,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  LoginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if username is empty
      if (!username) {
        return res
          .status(400)
          .json({ message: "Username atau email tidak boleh kosong" });
      }

      const user = await Users.findOne({
        $or: [{ username: username }, { email: username }],
      });

      // Check if user exists
      if (!user) {
        return res
          .status(400)
          .json({ message: "Username atau email tidak tersedia" });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const userData = {
          id: user._id,
          username: user.username,
        };

        // Check if user is verified and token is null
        if (user.isVerified == true && user.tokenAktivasi == null) {
          const token = await jsonwebtoken.sign(
            userData,
            process.env.JSWT_SECRET,
            { expiresIn: "1d" }
          );
          return res.status(200).json({
            message: "Berhasil",
            token: token,
          });
        } else {
          return res.status(200).json({
            message: "Email belum terverifikasi",
          });
        }
      } else {
        return res.status(200).json({
          status: false,
          message: "Password tidak sesuai",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getSingleUser: async (req, res) => {
    const { id } = req.query;
    try {
      const user = await Users.findOne({ _id: id });
      // console.log(user)
      if (!user) {
        return res.status(404).json({
          message: "Data Tidak Ditemukan",
        });
      }
      return res.status(200).json({
        message: "Data Ditemukan",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error Internal Server",
        error: error.message,
      });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const callEmail = await Users.findOne({ email: email });
    if (!callEmail) {
      return res.status(404).json({
        status: false,
        message: "Email tidak tersedia",
      });
    }
    const token = jsonwebtoken.sign(
      {
        id: callEmail._id,
      },
      process.env.JSWT_SECRET
    );

    await callEmail.updateOne({ resetPassword: token });

    const templateEmail = {
      from: "Cakrawala",
      to: email,
      subject: "Link Reset Password",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html>
      <head>
        <!-- Compiled with Bootstrap Email version: 1.3.1 -->
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="x-apple-disable-message-reformatting">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
        <style type="text/css">
          body,table,td{font-family:Helvetica,Arial,sans-serif !important}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}*{color:inherit}a[x-apple-data-detectors],u+#body a,#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}img{-ms-interpolation-mode:bicubic}table:not([class^=s-]){font-family:Helvetica,Arial,sans-serif;mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;border-collapse:collapse}table:not([class^=s-]) td{border-spacing:0px;border-collapse:collapse}@media screen and (max-width: 600px){.w-full,.w-full>tbody>tr>td{width:100% !important}.w-24,.w-24>tbody>tr>td{width:96px !important}.w-40,.w-40>tbody>tr>td{width:160px !important}.p-lg-10:not(table),.p-lg-10:not(.btn)>tbody>tr>td,.p-lg-10.btn td a{padding:0 !important}.p-3:not(table),.p-3:not(.btn)>tbody>tr>td,.p-3.btn td a{padding:12px !important}.p-6:not(table),.p-6:not(.btn)>tbody>tr>td,.p-6.btn td a{padding:24px !important}*[class*=s-lg-]>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-4>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-6>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}.s-10>tbody>tr>td{font-size:40px !important;line-height:40px !important;height:40px !important}}
        </style>
      </head>
      <body class="bg-light" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
        <table class="bg-light body" valign="top" role="presentation" border="0" cellpadding="0" cellspacing="0" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
          <tbody>
            <tr>
              <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0;" align="left" bgcolor="#f7fafc">
                <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                  <tbody>
                    <tr>
                      <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
                        <!--[if (gte mso 9)|(IE)]>
                          <table align="center" role="presentation">
                            <tbody>
                              <tr>
                                <td width="600">
                        <![endif]-->
                        <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
                          <tbody>
                            <tr>
                              <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                                <table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
                                        &#160;
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table class="ax-center" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                  <tbody>
                                    <tr>
                                      <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                                        <img class="w-24" src="https://assets.bootstrapemail.com/logos/light/square.png" style="height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; width: 96px; border-style: none; border-width: 0;" width="96">
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
                                        &#160;
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table class="card p-6 p-lg-10 space-y-4" role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;" bgcolor="#ffffff">
                                  <tbody>
                                    <tr>
                                      <td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 40px;" align="left" bgcolor="#ffffff">
                                        <h1 class="h3 fw-700" style="padding-top: 0; padding-bottom: 0; font-weight: 700 !important; vertical-align: baseline; font-size: 28px; line-height: 33.6px; margin: 0;" align="center">
                                          Atur ulang kata sandi 
                                        </h1>
                                        <table class="s-4 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                          <tbody>
                                            <tr>
                                              <td style="line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left" width="100%" height="16">
                                                &#160;
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <p class="" style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="center">
                                        Halo, ${callEmail.username} <span>&#128075;</span>
                                        </p>
                                        <p class="" style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="center">
                                        Kami mengirim email ini karena kamu meminta pengaturan ulang kata sandi. Klik tombol atur kata sandi baru di bawah ini untuk membuat kata sandi baru:
                                        </p>
                                        <table class="s-4 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                          <tbody>
                                            <tr>
                                              <td style="line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left" width="100%" height="16">
                                                &#160;
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <table class="btn btn-red-300 rounded-full fw-800 text-5xl py-4 ax-center  w-full w-lg-80" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="border-radius: 9999px; border-collapse: separate !important; width: 320px; font-size: 48px; line-height: 57.6px; font-weight: 800 !important; margin: 0 auto;" width="320">
                                          <tbody>
                                            <tr>
                                              <td style="line-height: 24px; font-size: 16px; border-radius: 9999px; width: 320px; font-weight: 800 !important; margin: 0;" align="center" bgcolor="#cd2013" width="320">
                                                <a href=${process.env.CLIENT_URL}/resetpassword/${token} style="color: #FFFF; font-size: 16px; font-family: Poppins; text-decoration: none; border-radius: 9999px; line-height: 20px; display: block; font-weight: 800 !important; white-space: nowrap; background-color: #cd2013; padding: 16px 12px; border: 1px solid #cd2013;">Atur ulang</a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <p class="" style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; margin-top:10px;" align="center">
                                                Jika kamu merasa tidak mengajukan pengaturan ulang kata sandi, kamu bisa mengabaikan email ini. Kata sandimu tidak akan berubah
                                                </p>
                                                <p style="line-height: 20px; font-size: 16px; width: 100%; margin: 0;" align="center"><strong>Cakrawala Team</strong></p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                        &#160;
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                        <![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
    `,
    };
    kirimEmail(templateEmail);
    res.status(200).json({
      status: true,
      message: "Link berhasil terkirim",
    });
  },
  resetPassword: async (req, res) => {
    const { password, token } = req.body;
    const user = await Users.findOne({ resetPassword: token });
    if (user) {
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
      await user.save();
      return res.status(200).json({
        status: true,
        message: "Password berhasil diganti",
      });
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const token = req.params.tokenAktif;
      const user = await Users.findOne({ tokenAktivasi: token });
      const removeToken = null;
      await user.updateOne({ tokenAktivasi: removeToken, isVerified: true });
      res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};
