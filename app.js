const express = require('express');
const server = express();
const parser = require('body-parser');
const cors = require('cors');
 
const userApi = require('./apis/user.api').userApi;


server.use(parser.json());
server.use(cors());

server.use('/users',userApi);
//server.use('/auth',securityApi);



server.listen(9876,()=>{
    console.log('server is started at 9876')
})
