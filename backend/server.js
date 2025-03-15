const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
// var cron = require('node-cron');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    // if (pathname === '/a') {
    //   app.render(req, res, '/a', query)
    // } else if (pathname === '/b') {
    //   app.render(req, res, '/b', query)
    // } else {
      // cron.schedule('* 2 * * *', function(){
      //   console.log('running a task every minute');
      // });
      handle(req, res, parsedUrl)
    // }
  }).listen(3005, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3005')
  })
})