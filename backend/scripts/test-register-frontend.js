const http = require('http');

const data = JSON.stringify({ firstName: 'WebTest', lastName: 'User', nickname: 'webtestnick', email: `webtest${Date.now()}@example.com`, password: 'password' });

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Origin': 'http://localhost:5173'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => { console.log('BODY:', body); });
});

req.on('error', (e) => { console.error(`problem with request: ${e.message}`); });

req.write(data);
req.end();
