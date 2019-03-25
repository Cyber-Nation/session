const crypto = require( 'crypto' ) 
const jwt = require( 'jsonwebtoken' )
var Redis = require('ioredis')
var redis = new Redis(process.env.REDIS)


class User {
    constructor( user ) {
        Object.assign( this, user )
        console.log( 'created:', this )
    }

    setPassword ( password ) {
        this.salt = crypto.randomBytes( 16 ).toString( 'hex' )
        this.hash = crypto.pbkdf2Sync( password, this.salt, 10000, 512, 'sha512' ).toString( 'hex' )
    }

    validatePassword( password ) {
        const hash = crypto.pbkdf2Sync( password, this.salt, 10000, 512, 'sha512' ).toString( 'hex' )
        return this.hash === hash
    }

    generateJWT() {
        const today = new Date()
        const expirationDate = new Date( today )
        expirationDate.setDate( today.getDate() + 60 )

        return jwt.sign( {
            email: this.email,
            exp: parseInt( expirationDate.getTime() / 1000, 10 )
        }, 'my-secret' )
    }

    toAuthJSON() {
        return {
            email: this.email,
            token: this.generateJWT()
        }
    }

    async save() {
        let user = {
            email: this.email,
            hash: this.hash,
            salt: this.salt
        }
        console.log( 'save', user )
        return redis.hmset( 'user:' + this.email, user )
    }
}

class Users {
    static async findOne( email ) {
        console.log( 'find ', email )
        try { 
            const user = await redis.hgetall( 'user:' + email )
            //console.log( 'found:: ', user )
            return new User( user )
        } catch( err ) {
            console.log( 'not found', err )
        }
        return null
    }
}

module.exports = { User, Users }