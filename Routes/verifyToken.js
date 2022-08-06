const jwt = require("jsonwebtoken");


// Confirm the token and user id
const veryfyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err, userData) => {
            if (err) {
                res.status(403).json("Token is not valid!!");
            }  else {
                req.userData = userData;
                next();
            }

            // req.userData = userData;
            // // verify user id
            // if (req.userData.id !== req.params.id) {
            //     res.status(403).json("Forbidden!! Not Allow!!")
            // } else {
            //     next();
            // }
        })
    } else {
        return res.status(401).json("You are not authenticated");
    }
};

// Confirm that user isAdmin
const verifyTokenAndAdmin = (req, res, next) => {
    veryfyToken(req, res, () => {
        if (req.userData.isAdmin) {
            next();
        } else {
            res.status(403).json("Fobidden!! You don't have the right permission to do that!!");
        }
    });

};


// const verifyAndAuthoriseToken = (req, res, next) => {
//     veryfyToken(req, res, () => {
//         if (req.userData.id === req.params.id || req.userData.isAdmin) {
//             next();
//         } else {
//             req.status(403).json("Forbidden!! Not Allow!!")
//         }
//     })
// }


module.exports = { verifyTokenAndAdmin, veryfyToken };