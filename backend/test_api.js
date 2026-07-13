async function testApi() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@assetflow.com', password: 'AssetFlow@123' })
    });
    const loginData = await loginRes.json();
    
    if (!loginData.data || !loginData.data.token) {
       console.log('Login failed', loginData);
       return;
    }
    const token = loginData.data.token;
    
    const usersRes = await fetch('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usersData = await usersRes.json();
    
    console.log(JSON.stringify(usersData, null, 2));
  } catch (error) {
    console.error(error);
  }
}

testApi();
