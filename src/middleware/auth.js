const Auth = (req, res, next) => {
   // res.send("this is namskar page");
   const token = "xyz"
   const autherization = token === "xyz"
   if (!autherization) {
     return res.status(401).send("unauthorized access");
   } else {
 
     next()
   }
 }

 module.exports = Auth;