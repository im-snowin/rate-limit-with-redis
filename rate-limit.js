const redis = require('./redis-client')

function rateLimiter({expiresIn, allowedRequests}) {
    return  async function (req, res, next) {
        /* Get the IP from user */
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const request = await redis.incr(ip)
        
        let ttl;
        if(request === 1) {
            await redis.expire(ip, expiresIn)
            ttl = expiresIn
        }
        else ttl = await redis.ttl(ip)
    
        // Set limit to access the api
        if(request >= allowedRequests) {
            return res.status(503).json({message: "Too many requests!", ttl})
        }
    
        next()
    }
}

module.exports = rateLimiter
