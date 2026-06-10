const http = require('http');

async function makeRequest(method, path, body = null, useToken = false, token = '') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (useToken && token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  const user = `user${Date.now()}`;
  const email = `${user}@test.com`;

  // Kayıt
  const reg = await makeRequest('POST', '/api/auth/register', {
    firstName: 'Test',
    lastName: 'User',
    nickname: user,
    email: email,
    password: 'pass123'
  });
  
  if (reg.status !== 201) {
    console.log('❌ Kayıt hatası:', reg.body);
    return;
  }
  
  const token = reg.body.token;
  console.log('✅ Kayıt başarılı, Token:', token.slice(0, 20) + '...');

  // Şiir Ekle
  const poem = await makeRequest('POST', '/api/poems', {
    title: 'Test Poem',
    content: 'Bu bir test şiiridir.\nÇok güzel.'
  }, true, token);

  console.log('Şiir Ekleme Yanıtı:', poem.status, poem.body);

  // Şiirleri Listele
  const list = await makeRequest('GET', '/api/poems');
  console.log('Şiirler:', list.body.length, 'tane var');
  if (list.body.length > 0) {
    console.log('Son şiir:', list.body[0].title);
  }
}

test().catch(err => console.error(err));
