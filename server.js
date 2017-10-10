const server = require('cnn-server');
const GoogleImages = require('google-images');
const SEARCH_ID = process.env.SEARCH_ID;
const SEARCH_KEY = process.env.SEARCH_KEY;
const HEALTHCHECK = process.env.HEALTHCHECK || '/hc';
const searchClient = new GoogleImages(SEARCH_ID, SEARCH_KEY);

let config;

if (process.env.NODE_ENV === 'production') {

    require('babel-register')({
        resolveModuleSource: require('babel-resolver')(__dirname + '/src')
    });
    
    const handleSSR = (req, res) => {
        const React = require('react');
        const ReactDOMServer = require('react-dom/server');
        const { StaticRouter } = require('react-router');
        const App = require('./src/modules/shell/index.js').default;
        const HTML = require('./src/modules/html/index.js').default;
        const assets = require('./dist/assets.json');
    
        const context = {};
    
        const html = ReactDOMServer.renderToString(
            React.createElement(StaticRouter, {
                context,
                location: req.url
            }, React.createElement(App))
        );
    
        const doc = ReactDOMServer.renderToString(
            React.createElement(HTML, {
                html,
                assets
            })
        );
    
        if (context.url) {
            res.writeHead(301, { 'Location': context.url });
            res.end();
        } else {
            res.write('<!doctype html>' + doc);
            res.end();
        }
    
    }
    
    const handleStatic = (req, res) => {
        res.sendFile('index.html', {
            root: __dirname + '/dist/'
        });
    }
    
    // Create production configuration
    config = {
        enableStatic: true,
        routes: [
            {
                path: '*',
                handler: !!process.env.DISABLE_SSR ? handleStatic : handleSSR
            }
        ]
    };
} else {
    // Use default development configuration
    config = require('cnn-starter-app/src/configuration/server.development.js');
}

function search(req, res, next) {
    console.log(req.query)
    if (!req.query) {
        res.status(403).json({code: 403, message: "Must pass in query value"});
    }

    query = req.query.q;
    searchClient.search(query)
    .then(images => {
        res.json(images);
    }, (err) => {
        console.log('ERROR => ', err.message);
        res.status(err.statusCode).json(err.message);
    });
}

function healthcheck(req, res, next) {
    res.json({code: 200, message: "healthy as can be..."});
}

server(config, (app, express) => {
    app.get('/search', search);
    app.get(HEALTHCHECK, healthcheck);
});
