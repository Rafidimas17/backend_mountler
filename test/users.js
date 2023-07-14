const assert = require("chai").assert;
const request = require("supertest");
const app = require("../app"); 

describe("Users API Test", function () {
  it("should create a new user", function (done) {
    const userData = {
      username: "wahyudarmawan01",
      email: "example@example.com",
      password: "password123",
    };

    request(app)
      .post("/api-v1/signup")
      .send(userData)
      .end(function (err, res) {
        if (res.status === 200) {
          assert.equal(res.body.message, "Berhasil diakses");
        } else if (res.status === 402) {
          assert.equal(res.body.message, "Username Telah Tersedia");
        } else if (res.status === 404) {
          assert.equal(res.body.message, "Email Telah Tersedia");
        } else {
          done(err);
        }
        done();
      });
  });
  it("Should user login", (done) => {
    const loginData = {
      username: "wahyudarmawan01",
      password: "password123",
    };
    request(app)
    .post('/api-v1/login')
    .send(loginData)
    .end((err,res)=>{
        if(res.status===200){
            assert.equal(res.body.message,"Berhasil")
        }
        else if(res.status === 402){
            assert.equal(res.body.message,"Email belum terverifikasi")
        }
        else if(res.status === 404){
            assert.equal(res.body.message,"Periksa kembali password anda")
        }
        else if(res.status === 401){
            assert.equal(res.body.message,"username atau email anda tidak tersedia")
        }
        else{
            done(err)
        }
        done()
    })
  });
  it('Should user verify email',(done)=>{
    const tokenAktif="2738d6c32e18eee33a360f955390a66f930e41f56dc8f9dd75ac3cd7e453817001263796e7c6753a9311328c41dedaed8a9f4fe720ba0a879bf0c91d16d5edec"
    request(app)
    .get(`/api-v1/verify-email/${tokenAktif}`)
    .end((err,res)=>{
    if(res.status===200){
        assert.equal(res.body.message,'Email verified successfully')
    }else if(res.status === 500){
        assert.equal(res.body.message,"Internal Server Error")
    }else{
        done(err)
    }
    done()
    })
  })
  
  
  it('Should user forgot password',(done)=>{
    const email={email:"example@example.com"}
    request(app)
    .put('/api-v1/forgot-password')
    .send(email)
    .end((err,res)=>{
      if(res.status === 404){
        assert.equal(res.body.message,'Email tidak tersedia')
      }
      else if(res.status === 200){
        assert.equal(res.body.message,'Link berhasil terkirim')
      }
      else{
        done(err)
      }
      done()
    })
  })
  // it('should reset user password', function (done) {
  //   const mockUser = {
  //     resetPassword: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjAyM2Q4N2ZiOGQ5M2U0YzFlMTJlZSIsImlhdCI6MTY4OTI2NzQ2NH0.1dctMcuTkL0CNy23-9MdEEPRrArW8If8rpM9GIKdHLg",
  //   };
  //   const newPassword = 'newPassword123';

  //   // Simulasikan query yang mengembalikan user dengan resetPassword yang cocok
  //   const Users = {
  //     findOne: function (query) {
  //       if (query.resetPassword === mockUser.resetPassword) {
  //         return Promise.resolve(mockUser);
  //       }
  //       return Promise.resolve(null);
  //     },
  //   };

  //   // Simulasikan fungsi hash password
  //   const bcrypt = {
  //     hash: function (password, saltRounds) {
  //       return Promise.resolve('qwewweffe32534534425445gtrrtgrtgrthrh33534');
  //     },
  //   };

  //   // Simulasikan fungsi save() pada model User
  //   const saveMock = function () {
  //     return Promise.resolve();
  //   };
  //   mockUser.save = saveMock;

  //   // Mengganti implementasi asli dengan mock object
  //   const originalUsers = app.locals.Users;
  //   const originalBcrypt = app.locals.bcrypt;
  //   app.locals.Users = Users;
  //   app.locals.bcrypt = bcrypt;

  //   // Mengirim permintaan reset password
  //   request(app)
  //     .put('/api-v1/reset-password')
  //     .send({
  //       password: newPassword,
  //       token: mockUser.resetPassword,
  //     })
  //     .end(function (err, res) {
  //       // Mengembalikan implementasi asli
  //       app.locals.Users = originalUsers;
  //       app.locals.bcrypt = originalBcrypt;

  //       if (err) {
  //         done(err);
  //       } else {
  //         assert.equal(res.status, 200);
  //         assert.equal(res.body.status, true);
  //         assert.equal(res.body.message, 'Password berhasil diganti');
  //         done();
  //       }
  //     });
  // });
  
});
