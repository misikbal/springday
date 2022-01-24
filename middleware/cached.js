const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 300, checkperiod: 310 } );

module.exports = (req,res,next)=>{
    if(req.system.isMemory===false)
    { 
        if(!req.session.isAuthenticated){
            if (req.method != 'GET') {
                return next();
            }
        if (req.method == 'GET') {
        var cachedReponse = myCache.get(req.url);
        if (cachedReponse) {
        res.header(cachedReponse.headers);
        res.header('X-Proxy-Cache', 'HIT');
        return res.send(cachedReponse.body);
        } else {
        
        res.originalSend = res.send;
        res.send = (body) => {
            myCache.set(req.url, {
            'headers'   : res.getHeaders(),
            'body'      : body
            });
            res.header('X-Proxy-Cache', 'MISS');
            res.originalSend(body);
            if (this._cacheControl && !res.getHeader('Cache-Control')) {
                var cacheControl = 'public, max-age=' + Math.floor(this._maxage / 1000)
                debug('cache-control %s', cacheControl)
                res.setHeader('Cache-Control', cacheControl) // this line is responsible for that
                }
        };
        return next();
        }
    }

    }
    return  next();

        
    }
    else{
        return next();

    }

}

