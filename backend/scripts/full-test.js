const http = require('http');

const API = 'http://127.0.0.1:5000';
let token = '';
let userId = '';

async function makeRequest(method, path, body = null, useToken = false) {
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

async function runTests() {
  console.log('🧪 Başlıyoruz Testleri...\n');

  // 1. Kayıt Testi
  console.log('1️⃣ KAYIT TESTİ');
  const email = `test${Date.now()}@example.com`;
  const registerRes = await makeRequest('POST', '/api/auth/register', {
    firstName: 'Test',
    lastName: 'User',
    nickname: `testuser${Date.now()}`,
    email: email,
    password: 'password123'
  });
  
  if (registerRes.status === 201) {
    console.log('✅ Kayıt başarılı!');
    console.log('   Dönen veri:', registerRes.body);
    token = registerRes.body.token;
    userId = registerRes.body._id;
  } else {
    console.log('❌ Kayıt başarısız!', registerRes.body);
    return;
  }

  // 2. Giriş Testi
  console.log('\n2️⃣ GİRİŞ TESTİ');
  const loginRes = await makeRequest('POST', '/api/auth/login', {
    email: email,
    password: 'password123'
  });
  
  if (loginRes.status === 200) {
    console.log('✅ Giriş başarılı!');
    console.log('   Dönen veri:', loginRes.body);
    token = loginRes.body.token;
  } else {
    console.log('❌ Giriş başarısız!', loginRes.body);
    return;
  }

  // 3. Şiir Ekleme Testi
  console.log('\n3️⃣ ŞİİR EKLEME TESTİ');
  const poemRes = await makeRequest('POST', '/api/poems', {
    title: 'Test Şiiri',
    content: 'Bu bir test şiiridir.\nÇok güzel bir şiir.'
  }, true);

  if (poemRes.status === 201) {
    console.log('✅ Şiir eklendi!');
    console.log('   Şiir ID:', poemRes.body._id);
    var poemId = poemRes.body._id;
  } else {
    console.log('❌ Şiir eklenirken hata!', poemRes.body);
    return;
  }

  // 4. Profil Güncelleme Testi
  console.log('\n4️⃣ PROFİL GÜNCELLEME TESTİ');
  const profileRes = await makeRequest('PUT', '/api/auth/profile', {
    firstName: 'Updated',
    lastName: 'Name'
  }, true);

  if (profileRes.status === 200) {
    console.log('✅ Profil güncellendi!');
    console.log('   Yeni isim:', profileRes.body.firstName, profileRes.body.lastName);
  } else {
    console.log('❌ Profil güncellemesi başarısız!', profileRes.body);
  }

  // 5. Şiirleri Listeleme Testi
  console.log('\n5️⃣ ŞİİRLERİ LİSTELEME TESTİ');
  const poemsRes = await makeRequest('GET', '/api/poems');
  
  if (poemsRes.status === 200) {
    console.log('✅ Şiirler listelendi!');
    console.log('   Toplam şiir sayısı:', poemsRes.body.length);
  } else {
    console.log('❌ Şiirler listelenirken hata!', poemsRes.body);
  }

  // 6. Yorum Ekleme Testi
  console.log('\n6️⃣ YORUM EKLEME TESTİ');
  const commentRes = await makeRequest('POST', `/api/poems/${poemId}/comments`, {
    text: 'Çok güzel bir şiir!'
  }, true);

  if (commentRes.status === 201) {
    console.log('✅ Yorum eklendi!');
  } else {
    console.log('❌ Yorum eklenirken hata!', commentRes.body);
  }

  // 7. Şiir Silme Testi
  console.log('\n7️⃣ ŞİİR SİLME TESTİ');
  const deleteRes = await makeRequest('DELETE', `/api/poems/${poemId}`, null, true);

  if (deleteRes.status === 200) {
    console.log('✅ Şiir silindi!');
  } else {
    console.log('❌ Şiir silinirken hata!', deleteRes.body);
  }

  console.log('\n🎉 Tüm testler tamamlandı!');
}

runTests().catch(err => console.error('Hata:', err));
