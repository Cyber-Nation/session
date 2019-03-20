var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')

//BDD
var Redis = require('ioredis')
var redis = new Redis('redis://:g40rsyJZ8Zf333QofPLymV0XP0jiDBrl@redis-18663.c3.eu-west-1-2.ec2.cloud.redislabs.com:18663/cybernation')
//redis.set('foo', 10)


var app = express()

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
    redis.get('foo', function (err, result) {
        console.log(result);
        res.send('you viewed this page ' + req.session.views['/foo'] + ' times <br> foo=' + result )
    });
})

app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})

app.listen( 80)