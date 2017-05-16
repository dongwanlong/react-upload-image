var http = require('http');
var https = require('https');
var httpProxy = require('http-proxy');
var url = require('url');
var fs = require('fs');
var path = require('path');
var log4js = require('log4js');

var proxy = httpProxy.createProxyServer({});
var logger = log4js.getLogger();
logger.setLevel('INFO');
var config=JSON.parse(fs.readFileSync('tools/config.json'));
var mime = config.contentType;

var staticPath = "src";
var options = {
    key: fs.readFileSync('tools/certificate/ssl.key'),
    cert: fs.readFileSync('tools/certificate/ssl.crt')
}

var app = function(req, res) {
    var urlPath = url.parse(req.url).pathname;
    var realPath = staticPath + urlPath;
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    if(ext === 'unknown'){
        logger.info(urlPath+ ' request from '+ config.backendHost);
        proxy.web(req, res, { target: "http://"+config.backendHost });
        proxy.on('error', function(e) {
            logger.error('error occurs on request to ' + config.backendHost + '. details:' + JSON.stringify(e));
        });
    }else{
        fs.exists(realPath, function (exists) {
            if (!exists) {
                logger.warn(realPath+' request from local,but not found ');
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write("This request URL " + urlPath + " was not found on this server.");
                res.end();
            } else {
                fs.readFile(realPath, "binary", function(err, file) {
                    var contentType = mime[ext] || "text/plain";
                    if (err) {
                        logger.error(realPath+' request from local error ');
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err);
                    } else {
                        logger.info(realPath+' request from local success ');
                        res.writeHead(200, {'Content-Type': contentType});
                        res.write(file, "binary");
                        res.end();
                    }
                });
            }
        });
    }
};

https.createServer(options,app).listen(443,function(){
    logger.info("https listening on port 0.0.0.0:443")
});
http.createServer(app).listen(80,function(){
    logger.info("http listening on port 0.0.0.0:80")
});
