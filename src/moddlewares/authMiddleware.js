const jwt = require("jsonwebtoken");
const accessTokenKey = process.env.JWT_SECRET;

const isLogIn = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        // let token = req.cookies.token
        if (!token) {
            token = req.cookies.token
        }

        if (!token) {
            return res.status(401).json({
                status: "fail",
                msg: "Unauthorized user"
            });
        }



        // Verify the token

        const decode = jwt.verify(token, accessTokenKey);

        if (!decode) {
            return res.status(401).json({
                status: "fail",
                msg: "Invalid token, please log in"
            });
        }



        let id = decode.id;
        req.headers.id = id;
        let email = decode.email;
        req.headers.email = email;
        let role = decode.role;
        req.headers.role = role;
        next();


    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: error.message
        });
    }
};

const isLogOut = (req, res, next) => {
    try {
        let token = req.headers.token
        if (token) {
            let decode = jwt.verify(token, accessTokenKey);
            if (decode) {
                return res.status(409).json({
                    status: "fail",
                    msg: "You have already login"
                })
            } else {
                return res.status(401).json({
                    status: "fail",
                    msg: "User token expired"
                });
            }
        }
        next();
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: error.toString()
        });
    }
};

const isAdmin = (req, res, next) => {
    try {
        let role = req.headers.role;
        if (role !== "admin") {
            return res.status(403).json({
                status: "fail",
                msg: "You have not permission"
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: error.toString()
        })
    }
};

const isUser = (req, res, next) => {
    try {
        let role = req.headers.role;
        if (role !== "user") {
            return res.status(403).json({
                status: "fail",
                msg: "You have not permission"
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: error.toString()
        })
    }
};



module.exports = { isLogIn, isLogOut, isAdmin,isUser };