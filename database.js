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
      const rows = await connection.query('SELECT * FROM ?? WHERE name LIKE ? OR description LIKE ?', [table, `%${input}%`, `%${input}%`]);
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
      resolve(rows[0]['COUNT(*)']);
    } catch(error){
      reject(error);
    }
  })
}



 
 module.exports = {
   getItem,
   getList,
   getCategory,
   searchItem,
   itemCount
 }