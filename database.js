const { promiseImpl } = require('ejs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
   host: process.env.local_host, 
   user: process.env.user, 
   password: process.env.password,
   database: process.env.db
 });

 pool.getConnection((err, connection) => {
   if (err) {
     console.error('Error connecting to the database:', err);
     return;
   }
   console.log('Connected to the database!');
   connection.release();
 });




 
//function to get the password here
function getItem(target, table, pk) {
   return new Promise(async (resolve, reject) => {
     try {
       const connection = await pool.getConnection();
       const [rows] = await connection.query('SELECT ?? FROM ?? WHERE name = ?', [target, table, pk]);
       connection.release(); 
       if (rows.length === 0) {
        reject(new Error('The user name is invalid!'));
       } else {
         resolve(rows[0][target]); // Return the target
       }
     } catch (error) {
       reject(error);
     }
   });
 }

 //to get all the products in the database and fetch it to the home page
function getList(page, table, limit) {
   return new Promise(async (resolve, reject) => {
     try {
       const connection = await pool.getConnection();
       const rows = await connection.query('SELECT * FROM ?? LIMIT ? OFFSET ?;', [table, limit, page]);
       connection.release();
        resolve(rows[0]); // Return the list
     } catch (error) {
       reject(error);
     }
   });
 }

 //to get the items with a catagory choosen
 function getCategory(limit, page, name){
  return new Promise(async (resolve, reject) => {
    if(name==='All'){
      try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM product LIMIT ? OFFSET ? ;', [limit, page]);
        connection.release();
        resolve(rows[0]);
      } catch(error){
        reject(error);
      }
    }
    try {
      const connection = await pool.getConnection();
      const rows = await connection.query('SELECT * FROM product WHERE category=? LIMIT ? OFFSET ? ;', [name, limit, page])
      connection.release();
      resolve(rows[0]); // Return the list
    } catch (error) {
      reject(error);
    }
  });
 }

 //searching item function
function searchItem(table, input){
  return new Promise(async (resolve, reject)=>{
    try{
      const connection = await pool.getConnection();
      const rows = await connection.query('SELECT * FROM ?? WHERE name LIKE ?', [table, `%${input}%`, `%${input}%`]);
      connection.release();
      resolve(rows[0]);
    } catch(error){
      reject(error);
    }
  })
}

//page opperation 
function itemCount(table){
  return new Promise(async (resolve, reject)=>{
    try{
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT COUNT(*) FROM ??;',[table]);
      connection.release();
      resolve(rows[0]['COUNT(*)']);
    } catch(error){
      reject(error);
    }
  })
}

//function to get all the categroies of a user
function adminCategory(table, name, target){
  return new Promise(async (resolve, reject)=>{
    try{
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM ?? WHERE ?? = ?;',[table, target, name]);
      connection.release();
      resolve(rows);
    } catch(error){
      reject(error);
    }
  })
}

//function to get the totall redirect of the products in a category
function getTotalRedirect(category){
  return new Promise(async (resolve, reject)=>{
    try{
      const connection = await pool.getConnection();
      const [row] = await connection.query('SELECT SUM(visit) AS total_visits FROM product WHERE category = ?;',[category]);
      connection.release();
      resolve(Number(row[0].total_visits));
    } catch(error){
      reject(error);
    }
  })
}

//function that gets all the products related to the admin
function getAdminProducts(admin){
  const queryString = 'SELECT Product.name, Product.Category, Product.Price, Product.Qunitity, Product.visit FROM Product INNER JOIN category ON Product.Category = category.name INNER JOIN admin ON category.Admin = admin.name WHERE admin.name = ?;'
  return new Promise(async (resolve, reject)=>{
    try{
      const connection = await pool.getConnection();
      const [row] = await connection.query(queryString,[admin])
      connection.release();
      resolve(row);
    } catch(err){
      reject(err);
    }
  })
}

//adding new category
function addNewCategory(category, admin){
  return new Promise(async (resolve, reject)=>{
    try{
      const connection = await pool.getConnection();
      const [row] = await connection.query('insert into category values(?,?,0);',[category, admin]);
      connection.release();
      resolve(row);
    } catch(error){
      reject(error);
    }
  })
}

//function to check if the name is available
function isNameAvailable(table, name){
  return new Promise(async (resolve, reject)=>{
    try{
      const connection = await pool.getConnection();
      const [row] = await connection.query('select * from ?? where name = ?',[table, name]);
      connection.release();
      row.length === 0 ? resolve(true) : resolve(false);
    } catch(error){
      reject(error);
    }
  })
}


// isNameAvailable('category', 'drug')
// .then(res=>{
//   console.log(res)
// })
// .catch(err=>{
//   console.log(err)
// })

 
 module.exports = {
   getItem,
   getList,
   getCategory,
   searchItem,
   itemCount,
   adminCategory,
   getTotalRedirect,
   getAdminProducts,
   addNewCategory,
   isNameAvailable
 }