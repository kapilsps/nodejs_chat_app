const LocalStrategy = require('passport-local').Strategy;
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User } = require('../models');


module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({
                where:{
                    email:{
                        [Op.eq]:email
                    }
                }
            })
            .then(user => {
                
                if(!user){
                    return done(null, false, {message: 'Incorrect email or email not registered.'});
                }

                bcrypt.compare(password, user.password, function(err, res){
                    if(err) throw err;

                    if(res){
                        return done(null, user);
                    }else{
                        return done(null, false, { message: 'Incorrect Password.' });
                    }

                });

            })
            .catch(err => {
                console.log(err);
            });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findByPk(id)
        .then(user => {
            if(user){
                done(null, user.get());
            }else{
                done(user.errors, null);
            }
        })
        .catch(err => {
            console.log(err);
        });
    });

};