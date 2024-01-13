//jshing esversion:6
require('dotenv').config();
const express = require("express");
//const ejs = require("ejs");
const bodyParser = require("body-parser");
const db = require("./database.js");
const lib = require("./library.js");
const tool = require("./tools.js");
const cors = require('cors');
//const { response } = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { regexpToText } = require('nodemon/lib/utils');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(3000, ()=>{
   console.log('server has started on port 3000');
})




app.route('/login')
.get((req, res)=>{
   res.render('login.ejs');
})
.post((req, res)=>{
   const name = req.body.userName;
   const password = req.body.password;
   const maxAgeOfCookie = 3600000;//max age of the cookie is set here, and the token needs chage if wanted to change this   
   db.getItem("password", "admin", name)
   .then(result=>{
      const passwordReturned = result;      
      if(result){ //here i want it to hash, bycrypt compare, i want it to be hashed
            if(password===passwordReturned){
               lib.generateToken(name)
               .then(token=>{
                  res.cookie('tokenCookie', token, {maxAge: maxAgeOfCookie});
                  res.json({ response: 'authorized'});
               })
            } else{
               res.json({response: 0});               
            }
      }
   })
   .catch(()=>{
      res.json({response: -1});
   })
})

//dashboard route handlers start here
app.get('/logout', (req, res)=>{
   res.cookie('tokenCookie', '', { maxAge: 1});
   res.redirect('/login');
})

app.route('/dashboard')
.get(lib.validateCookie, (req, res)=>{
   let display = null;
   if(req.user.status === 'owner'){
      display = 'flex';
   } else{
      display = 'none';
   }

   tool.adminNumber(req.user.adminId)
   .then(result=>{
      res.render('dashboard', { 
         presentContent: 'dashboardContent.ejs' ,
         displayValue: display, 
         totalCate: result[0],
         totalPro: result[1],
         totalVisit: result[2],
         totalRedirect: result[3],
         userName: req.user.adminId, 
         userStatus: req.user.status
      });
   })
   .catch(err=>{
      console.log(err);
   })

   // res.render('dashboard', { 
   //    presentContent: 'dashboardContent.ejs' ,
   //    displayValue: display, userName: req.user.adminId, 
   //    userStatus: req.user.status
   // });
})

app.route('/dashboard/categories')
.get(lib.validateCookie, (req, res)=>{
   let display = null;
   if(req.user.status === 'owner'){
      display = 'flex';
   } else{
      display = 'none';
   }

   db.adminCategory('category', req.user.adminId, 'admin')
   .then(list=>{
      if(list.length===0){
         return res.render('dashboard', { presentContent: 'category.ejs', list: list,displayValue: display, userName: req.user.adminId, userStatus: req.user.status, noneNote: 'block' });
      }
      const promises = [];

      for(let i = 0; i<list.length; i++){
         const promise = db.getTotalRedirect(list[i].name)
         .then(res=>{
            list[i].totalVisit = res;
         })
         .catch(error=>{
            console.log('error while getting the total count', error);
         })          
         promises.push(promise);
      }
      Promise.all(promises)
      .then(()=>{
         res.render('dashboard', { presentContent: 'category.ejs', list: list,displayValue: display, userName: req.user.adminId, userStatus: req.user.status, noneNote: 'none' });
      })
      .catch(err=>{
         console.log(err);
      })      
   })
   .catch(err=>{
      console.log(err);
   })
})
//the adding new category is handled here
.post(lib.validateCookie, (req, res)=>{
   const name = req.body.Name;
   db.isNameAvailable('category', name)
   .then(result=>{
      if(result===false){
         res.json(result)
      } else{
         db.addNewCategory(name, req.user.adminId)
         .then(result=>{
            if(result.affectedRows){
               res.json(true);
            } else{
               res.json(false);
            }
         })
         .catch(error=>{
            console.log(error);
         })
      }
   })
})

app.route('/dashboard/products')
.get(lib.validateCookie, (req, res)=>{
   let display = null;
   if(req.user.status === 'owner'){
      display = 'flex';
   } else{
      display = 'none';
   }
   db.getAdminProducts(req.user.adminId)
   .then(list=>{
      if(list.length===0){
         return res.render('dashboard', { presentContent: 'product.ejs', list: list,displayValue: display, userName: req.user.adminId, userStatus: req.user.status, noneNote: 'block' });
      }
      res.render('dashboard', { presentContent: 'product.ejs', list: list,displayValue: display, userName: req.user.adminId, userStatus: req.user.status, noneNote: 'none' });
   })
   .catch(err=>{
      console.log(err);
   })

   // res.render('dashboard', { presentContent: 'product.ejs' ,displayValue: display, userName: req.user.adminId});
})
.post(lib.validateCookie, (req, res)=>{
   const data = req.body;
   console.log(data);
})





app.route('/dashboard/account')
.get(lib.validateCookie, (req, res)=>{
   let display = null;
   if(req.user.status === 'owner'){
      display = 'flex';
   } else{
      display = 'none';
   }

   res.render('dashboard', { presentContent: 'account.ejs' ,displayValue: display, userName: req.user.adminId, userStatus: req.user.status,});
})

app.get('/tool/getcategory', lib.validateCookie, (req, res)=>{
   db.adminCategory('category', req.user.adminId, 'admin')
   .then(result=>{
      res.json(result)
   })
   .catch(err=>{
      console.log(err);
   })
})
//admin server ends here








//front customer page server set up here
const displayCapacity = 3; //the display capacity goes here

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