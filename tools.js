const db = require("./database.js");

function adminNumber(user){
   return new Promise(async (resolve, reject)=>{
      try{
         let array = [];
         const arrayOfCate = await db.adminCategory('category', user, 'admin');
         array.push(arrayOfCate.length);

         const arrayOfProduct = await db.getAdminProducts(user);
         array.push(arrayOfProduct.length);

         const totalVisit = await db.AdminTotalVisit(user);
         array.push(totalVisit);

         const totalRedirect = await db.AdminTotalRedirect(user);
         array.push(totalRedirect);

         resolve(array)
      } catch(err){
         reject(err);
      }
   })
}

// adminCateNumber('nati')
// .then(r=>{
//    console.log(r);
// })
// .catch(err=>{
//    console.log(err);
// })

module.exports = {
   adminNumber
}