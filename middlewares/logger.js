function log(req, res, next){
    let logs = {
        ip: req.ip,
        method: req.method,
        originalUrl : req.originalUrl,
        params: req.params,
        protocol: req.protocol,
        payload: req.body
    }
    console.log(logs);
    next();
}

module.exports = log;