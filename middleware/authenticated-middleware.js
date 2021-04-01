exports.index = (req, res, next) => {    
    if(req.isAuthenticated()){
        res.locals.authenticated = true;
        next();
    }else{
        req.flash('fail', 'Unauthorized user.');
        res.redirect('/login');
    }
};