//jshing esversion:6
require('dotenv').config();
const express = require("express");
//const ejs = require("ejs");
const bodyParser = require("body-parser");
const db = require("./database.js");
const lib = require("./library.js");
const cors = require('cors');
//const { response } = require('express');
const path = require('path');
const { regexpToText } = require('nodemon/lib/utils');

const app = express();
app.use(express.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(3000, ()=>{
   console.log('server has started on port 3000');
})




app.route('/admin')

.get((req, res)=>{
   res.sendFile("D:/WORK FLOW/front and back/front/adminPages/logIn.html");
})

.post((req, res)=>{
   const name = req.body.userName;
   const password = req.body.password;
   db.getItem("password", "admin", name)
   .then(result=>{
      const passwordReturned = result;
      if(passwordReturned===-1){ 
         res.json({response: -1}); } 
      else{ 
            if(password===passwordReturned){
               lib.generateToken(name).then(token=>{
                  res.json({ response: 'authorized', token: token });
               })
            } else{
               res.json({response: 0});               
            }
      }

   }).catch(err=>{
      console.log("something went wrong", err);
   })

})


app.get("/admin/dashboard", lib.authorization, (req, res)=>{
   console.log(req.user);
   res.render('dashboard', {
      user: 'nathan' //req.user.adminId
   });
 
 });




//front customer page server set up here
const displayCapacity = 5; //the display capacity goes here

app.route('/')
.get((req, res)=>{
   let holder = [];
   db.getList(0, 'product', displayCapacity)
   .then(list=>{
      holder[0]=list;
     })
   .catch(err=>{
      console.log('error on the list response', err);
   })

   //to get the catagory list as the second element in the arry

   .then(()=>{
      db.getList(0, 'category', Number.MAX_SAFE_INTEGER)
      .then(list=>{
         holder[1]=list;
         db.itemCount('product')
         .then(result=>{
            result>displayCapacity? holder[2]=true : holder[2]=false;
            res.json(holder);
         })
      })
      .catch(err=>{
      console.log('error on the catagory response', err);
   })
   })
   .catch(err=>{
      console.log('error on the all response', err);
   })
   
})

app.get('/category', (req, res)=>{
   const category = req.query.category;
   let holder = [];
   db.getCategory(displayCapacity, 0, category)
   .then(list=>{
      holder[0]=list;

      db.getCategory(Number.MAX_SAFE_INTEGER, 0, category)
      .then(result=>{
         result.length>displayCapacity? holder[1]=true : holder[1]=false;
         res.json(holder);
      })
      .catch(error=>{
         console.log('error retrieving the max element of category', error);
      })
   })
   .catch(err=>{
      console.log(err);
   })
})

app.get('/search', (req, res)=>{
   const input = req.query.input;
   let holder = [];
   db.searchItem('product', input)
   .then(list=>{
      holder[0]=list;
      holder[0].length>displayCapacity? holder[1]=true : holder[1]=false;
      res.json(holder);
   })
   .catch(error=>{
      console.log(error); 
   })
})