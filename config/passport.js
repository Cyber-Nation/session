const passport = require('passport')
const LocalStrategy = require('passport-local')
const { Users } = require( './../models/users' )

passport.use(new LocalStrategy( {
    usernameField: 'user[email]',
    passwordField: 'user[password]',
  }, async ( email, password, done) => {
    console.log( 'LocalStratedgy email=%s, password=%s', email, password )
    try {
      //const userDocument = await UserModel.findOne({username: username}).exec();
      const user = await Users.findOne( email )
      console.log( 'LS', user )
      //const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);
      const passwordsMatch = user.validatePassword( password )
      console.log( "passwordMatch =", passwordsMatch )
      if (passwordsMatch) {
        return done(null, user);
      } else {
        return done('Incorrect Username / Password');
      }
    } catch (error) {
      console.log( 'ERREUR', error)
      done(error);
    }
  }
) )