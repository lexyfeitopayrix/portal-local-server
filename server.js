const express = require('express');
const path = require('path');
const port = process.env.PORT || 4200;
const app = express();
const {createProxyMiddleware} = require('http-proxy-middleware');

let folderPath = '';
const pathIndex = process.argv?.indexOf('-p');
if (pathIndex !== -1) {
    folderPath = process.argv[ + 1];
    console.log(folderPath);
}

if (!folderPath) {
    console.error('folder path required');
    process.exit();
}

const apiProxy = createProxyMiddleware({
    target: 'http://localhost:3000/api', // The target server to proxy to
    pathRewrite: {},
    headers: {
        Host: "portal-test.payrix.com",
        "X-Forwarded-Proto": "https"
    },
    secure: false,
    logLevel: "debug",
    changeOrigin: false,
    cookieDomainRewrite: ''
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


app.use(express.static(folderPath));

app.use(function(req, res, next) {
    if (!req.url.includes('/api/')) {
        res.sendFile(`${folderPath}/index.html`);
    }
    else {
        next();
    }
});

app.use('/api', apiProxy);

app.listen(port);
console.log("server started on port " + port);