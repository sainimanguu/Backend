import { serve } from 'bun'

serve({
    fetch(request) {
        const url = new URL(request.url);
        if (url.pathname === '/') {
            return new Response('Hello', { status: 200 })
        }
    }
})