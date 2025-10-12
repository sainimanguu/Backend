import http from 'http'

const hostname = '127.0.0.1'

const port = 8000

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/plain')
        res.end("Hello world!")
    }
    else if (req.url === '/user') {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/plain')
        res.end("Hello user!")
    }
    else {
        res.statusCode = 404;
        res.setHeader('Content-type', 'text/plain')
        res.end("Not found!")
    }
})

server.listen(port, hostname, () => {
    console.log(`Server is listening at https://${hostname}:${port}`)
})