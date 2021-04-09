exports.index = (req, res, next) => {    
    if(req.isAuthenticated()){
        res.locals.authenticated = true;
        res.redirect('/users/dashboard');
    }else{
        next();
    }
};