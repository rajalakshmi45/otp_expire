const client = require('mongodb').MongoClient;
const otp = require('otp-generator');
const UserConstants = require('./util.service').UserConstants;
const nodemailer = require('nodemailer');
var otp_pass=" ";
var time=" ";
var expiretime=" ";

class userservice{

    constructor(){
        this.smtpSetup = {

            service : 'gmail',

            auth :{

                user : 'sraji.kum@gmail.com',

                pass : '1Shiva3shakthy5'

            }
     }
     this.mailer = nodemailer.createTransport(this.smtpSetup);
  }
  
generateotp(){
    otp_pass = otp.generate(7,{specialChars:false});
   this.generatedate();
   return otp_pass;
}

generatedate(){
    var date = new Date();
     time = date.getMinutes();
    var expire = time + 60000;
    console.log(time,expire);
   const _url = UserConstants.mongo.url + UserConstants.mongo.port;
    client.connect(_url,{ useNewUrlParser: true },(err,connection)=>{
        connection.db(UserConstants.mongo.db).collection(UserConstants.mongo.collections.user).insert({time : time}); 
    });
    return time;
 }
verify(otp)
{
    var date = new Date();
    var presenttime = date.getMinutes();
    expiretime = time+1;
     console.log('welcome');
    // console.log(otp);
     console.log(time);
     console.log(presenttime);
     console.log(expiretime);
    if(otp==otp_pass)
    {
     if(expiretime<presenttime)
     {
         console.log('expire');
        
     }else{
         console.log('not expire');
     }
    }
}

  add(_user,callback)
    {
            // update password
           // _user.password = this.generateHash(_user.password);
            const _url = UserConstants.mongo.url + UserConstants.mongo.port;
            client.connect(_url,{ useNewUrlParser: true },(err,connection)=>{
                if (err) {
                    console.error('An error occurred connecting to MongoDB: ', err);
                } else{
                connection.db(UserConstants.mongo.db).collection(UserConstants.mongo.collections.user).insert(_user,(err,response)=>{
                    callback(err,response);
                });
              }
            });
        let userObj ={
            subject : "One Time Password generated",
            body : `<div>${_user.name}, your OTP has been generated <b>${this.generateotp()}.</b> and is valid only for 10minutes.</div>`,
            from : null,
            to : _user.email
        }


        if(userObj.from == null){

            userObj.from = "sraji.kum@gmail.com"

        }

        this.mailer.sendMail({

            from : userObj.from,

            to : userObj.to,

            subject : userObj.subject,

            html : userObj.body

        },(err,response)=>{

            if(err){

                console.log(err);

                return "Unable to send email";

            }else{

                console.log('Email Sent');

                return "Email Sent Successfully";

            }

        })

    }

} 
module.exports =
{
    userservice
}