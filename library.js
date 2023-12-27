const jwt = require("jsonwebtoken");
const db = require("./database.js");

function generateToken(adminId) {
   return new Promise((resolve, reject) => {
     db.getItem('status', 'admin', adminId)
       .then((response) => {
         const status = response;
         const payload = { adminId, status };
         const secretKey = process.env.secret_key;
         const options = { expiresIn: '1h' }; // Token expiration time, e.g., 1 hour
 
         const token = jwt.sign(payload, secretKey, options);
         resolve(token);
       })
       .catch((err) => {
         reject(err);
       });
   });
 }

 function verifyToken(header) {
  return new Promise((resolve, reject) => {
    if (header) {
      const token = header.split(' ')[1];
      jwt.verify(token, process.env.secret_Key, (err, decoded) => {
        if (err) {
          reject(-1);
        } else {
          resolve(decoded);
        }
      });
    } else {
      reject(-1);
    }
  });
}
 
  
function authorization(req, res, next) {
  const authHeader = req.headers.authorization;
  //console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  if(token==null){ 
      console.log('lib section in the token null');
      return res.sendStatus(401);
      }
      jwt.verify(token, process.env.secret_Key, (err, decoded) => {
        if (err) {
          return res.sendStatus(401);
        } else {
          req.user = decoded;
          next();
        }
      });
  }


 function getAuthorizationHeader(req) {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.authorization;
    //console.log(authHeader);
    if (authHeader) {
      resolve(authHeader);
    } else {
      reject(new Error('Authorization header not found'));
    }
  });
}


 module.exports = {
   generateToken,
   verifyToken,
   authorization,
   getAuthorizationHeader
 }