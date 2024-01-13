const db = require("./database.js");

function adminCateNumber(user){
   return new Promise(async (resolve, reject)=>{
      try{
         let array = [];
         const arrayOfCate = await db.adminCategory('category', user, 'admin');
         array.push(arrayOfCate.length);

         const arrayOfProduct = await db.getAdminProducts(user);
         array.push(arrayOfProduct.length);

         resolve(array)
      } catch(err){
         reject(err);
      }
   })
}

adminCateNumber('mom')
.then(r=>{
   console.log(r);
})
.catch(err=>{
   console.log(err);
})

module.exports = {
   adminCateNumber
}