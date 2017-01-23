var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcryptjs'),
    userModel = require('.././db/index.js').User;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
        (username, password, done) => {
            Model.User.findOne({
                where: {'username': username}}
            ).then( (user) => {
                if (user === null) {
                    return done(null, false, {message: 'Wrong user/password'});
                }

                var hashedPassword = bcrypt.hashSync(password, user.salt);
                if(user.password === hashedPassword){
                    return done(null, user);
                }

                return done(null, false, {message: 'Wrong user/password'});
            });
        }
    ));

    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( (id, done) => {
        Model.User.findOne({
            where: {
                'id': id
            }
        }).then( (user) => {
            if (user === null) {
                done(new Error('Wrong user id'))
            }

            done(null, user);
        });
    });
}
