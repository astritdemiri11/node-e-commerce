const fsLib = require('fs');

const requestHandler = (req, res) => {
    const path = req.url;
    const method = req.method;

    if(path === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write(`
            <html>
                <head>
                    <title>Enter Message</title>
                </head>

                <body>
                    <form action="/message" method="POST">
                        <input type="text" name="message">
                        <button>Send</button>
                    </form>
                </body>
            </html>
        `);

        return res.end();
    } 

    if(path === '/message' && method === 'POST') {
        const body = [];

        req.on('data', chunk => {
            console.log(chunk);
            body.push(chunk);
        });

        req.on('end', () => {
            const data = Buffer.concat(body).toString();
            const message = data.split('=')[1];

            fsLib.writeFileSync('message.txt', message, error => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            });
        });
    }

    res.setHeader('Content-Type', 'text/html');
    res.write(`
        <html>
            <head>
                <title>My first page</title>
            </head>

            <body>
                <h1>Hello from my Node.js server!</h1>
            </body>
        </html>
    `);

    return res.end();
};

module.exports = requestHandler;