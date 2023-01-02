const redis = require('./redis-client')

export default function rateLimiter({expiresIn, allowedRequests}) {
    return  async function (req, res, next) {
        /* Get the IP from user */
        const ip = req.headers['x-forward-for'] || req.socket.remoteAddress;
    
        if(!ip || ip !== 'undefined') return new Error('IP not found')
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
