require('dotenv').config()
console.log( process.env.NODE_ENV)
console.log( process.env.REDIS)

var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var morgan = require( 'morgan' )

//BDD
var Redis = require('ioredis')
var redis = new Redis(process.env.REDIS)
//redis.set('foo', 10)


var app = express()

app.use( morgan( 'dev') )

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

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


app.get( '*', function (req, res, next) {
  // get the url pathname
  var pathname = parseurl(req).pathname
  res.send('you viewed this page ' + req.session.views[pathname] + ' times')
})

app.listen( 80)