export const config = { runtime: 'edge' };

export default async function handler(req) {
    // هندل کردن ارور CORS مرورگر
    if (req.method === 'OPTIONS') {
        return new Response('OK', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': '*',
            }
        });
    }

    // لینک اصلی API گوگل
    const target = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

    // کپی کردن هدرها (مثل API Key) و حذف هاست ورسل
    const newHeaders = new Headers(req.headers);
    newHeaders.delete('host');

    try {
        const response = await fetch(target, {
            method: req.method,
            headers: newHeaders,
            body: req.body
        });

        const resHeaders = new Headers(response.headers);
        resHeaders.set('Access-Control-Allow-Origin', '*');

        // برگردوندن جواب (حتی حالت استریم) به سایت خودت
        return new Response(response.body, {
            status: response.status,
            headers: resHeaders
        });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}