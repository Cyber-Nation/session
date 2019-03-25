require('dotenv').config()
console.log( process.env.NODE_ENV)
console.log( process.env.REDIS)

var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var morgan = require( 'morgan' )
var bodyParser = require( 'body-parser' )
const jwt = require('jsonwebtoken');

//PASSPORT
/*var passport = require( 'passport' )
var LocalStrategy = require( 'passport-local' ).Strategy
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;*/

//BDD
//var Redis = require('ioredis')
//var redis = new Redis(process.env.REDIS)
//redis.set('foo', 10)


var app = express()

app.use( morgan( 'dev') )
app.use( express.static( 'public' ) )
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json() )
app.use(session({
  secret: 'my-secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}))

//Models & routes
require( './models/users' )
require( './config/passport' )
app.use(require( './routes' ) )



/*
passport.use(new LocalStrategy( {
    usernameField: 'email',
    passwordField: 'firstname',
  }, async (username, password, done) => {
    console.log( 'LocalStratedgy username=%s, password=%s', username, password )
    try {
      //const userDocument = await UserModel.findOne({username: username}).exec();
      const user = await redis.hgetall( 'user:'+username )
      console.log( user )
      //const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);
      const passwordsMatch = password === user.firstname
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

passport.serializeUser(function(user, cb) {
  console.log( 'serialize', user)
  cb(null, user.email);
});

passport.deserializeUser(function(id, cb) {
  console.log( 'deserialize', id)
  //cb( null, id )
  redis.hgetall( "user:"+id ).then( 
    result => 
    {
      console.log( result )
      cb( null, result)

    },
    error => cb( error ) )
    .catch( err => cb( error ) )

  
  /*db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });*/
//});

/*
passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: 'my-secret',
  },
  (jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done('jwt expired');
    }

    return done(null, jwtPayload);
  }
) )

app.use(passport.initialize());
app.use(passport.session());

*/

// app.use(bodyParser.urlencoded({
//   extended: true
// }))



/*
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

  next()
})
*/

/*
app.get('/foo', function (req, res, next) {
    redis.incr( 'foo' )
    // redis.get('user:1', function (err, result) {
    //     console.log(result);
    //     res.send('you viewed this page ' + req.session.views['/foo'] + ' times <br> user=' + result )
    // });
    redis.get('foo', function (err, result) {
        console.log(result);
        res.send('you viewed this page ' + req.session.views['/foo'] + ' times <br> foo=' + result )
    });
  })

app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})
*/

//API
//var jsonParser = bodyParser.json()

/*
app.post( '/api/user', async function( req, res, next) {
  console.log( JSON.stringify(req.body.email) )
  var result = await redis.hmset( `user:${req.body.email}`, req.body )
  res.status( 200 ).send(JSON.stringify( { result: 'OK' }))
} )
*/

//LOGIN
/*app.post(
  '/login',
  passport.authenticate(
    'local',
    { /*failureRedirect: '/'} ),
    /*
    { session: false },
    (error, user) => {
      console.log( 'ERROR=%s, USER=%s', error, user)
      if (error || !user) {
        res.status(400).json({ error });
      }

      // This is what ends up in our JWT 
      const payload = {
        //username: user.username,
        username: user.email,
        expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
      };

      // assigns payload to req.user 
      req.login(payload, {session: false}, (error) => {
        if (error) {
          res.status(400).send({ error });
        }

        // generate a signed json web token and return it in the response 
        const token = jwt.sign(JSON.stringify(payload), 'my-secret');

        // assign our jwt to the cookie 
        res.cookie('jwt', jwt, { httpOnly: true, secure: true });
        res.status(200).send({ user });
      });
    }*/
  
/*  (req, res) => {
    console.log( 'authentification OK')
    res.status( 200 ).send( 'Authentifié' ) 
  } 
)
*/

//TEST
app.get('/test',
  /*passport.authenticate('local'),*/
  (req, res) => {
    const { user } = req;

    res.status(200).send({ user });
  });

//LOGOUT
app.get( '/logout', ( req, res) => {
  req.logout()
  res.redirect( '/test' )
})

/*app.get('/protected',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    //const { user } = req;

    res.status(200).send( "aut");
  });

//Fallback

/*app.get( '*', function (req, res, next) {
  // get the url pathname
  var pathname = parseurl(req).pathname
  res.send('you viewed this page ' + req.session.views[pathname] + ' times')
})*/




app.listen( 80)