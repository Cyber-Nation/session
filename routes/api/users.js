const passport = require( 'passport' )
const router = require( 'express' ).Router()
const auth = require( '../auth' )
const { User, Users } = require( '../../models/users' )

// Home
router.post( '/', auth.optional, ( req, res ) => {
    const { body: { user } } = req 

    if ( !user.email ) {
        return res.status( 422 ).json( {
            errors: {
                email: 'is required'
            }
        } )
    }

    if ( !user.password ) {
        return res.status( 422 ).json( {
            errors: {
                password: 'is required'
            }
        } ) 
    }

    const finalUser = new User( user )

    finalUser.setPassword( user.password )

    return finalUser.save().then( () => 
        res.json( { user: finalUser.toAuthJSON() } )
    )
} )

// Login
router.post( '/login', auth.optional, ( req, res, next ) => {
    const { body: { user } } = req 

    if ( !user.email ) {
        return res.status( 422 ).json( {
            errors: {
                email: 'is required'
            }
        } )
    }

    if ( !user.password ) {
        return res.status( 422 ).json( {
            errors: {
                password: 'is required'
            }
        } ) 
    }
    
    return passport.authenticate( 'local', /*{ session: false },*/ (err, passportUser, info ) => {
        if ( err )
            return next( err )

        if ( passportUser ) {
            const user = passportUser
            user.token = passportUser.generateJWT()

            return res.json( { user: user.toAuthJSON() } )
        }

        return status( 400 )
    } )( req, res, next )
    
} )

// Current
router.get( '/current', auth.required, ( req, res, next ) => {
    console.log( 'get /current' )
    const { payload: { email } } = req

    return Users.findOne( email ).then( user => {
        //console.log( 'found--', user )
        if ( !user )
            return res.sendStatus( 400 )
        
        return res.json( { user: user.toAuthJSON() } )
    } )
} )

// Test
router.get( '/test', auth.required, ( req, res ) => {
    console.log( 'get /test' )

    return res.status( 200 ).send( 'hello ' + req.payload.email )
} ) 

module.exports = router