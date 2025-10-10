import { serve } from 'bun'

serve({
    fetch(request) {
        const url = new URL(request.url);
        if (url.pathname === '/') {
            return new Response('Hello', { status: 200 })
        } else if (url.pathname === '/user') {
            return new Response('Hello user', { status: 200 })
        }
        else {
            return new Response()({ status: 404 })
        }
    },
    port: 3000,
    hostname: '127.0.0.1'
})//server-made by bun 