const jwt =  require("jsonwebtoken") ;

export const tokenCreate = (data, key, expiresIn)=> {
    const token = jwt.sign(data, key, { expiresIn });
    return token;
};