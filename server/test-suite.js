const http = require('http');

function apiCall(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log(' VICEVERSE AUTOMATED TEST SUITE');
  console.log(' Testing all endpoints, RBAC, cart & checkout flow');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(` ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(` ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Healthcheck
  await test('GET /api/health', async () => {
    const res = await apiCall({ host: '127.0.0.1', port: 5000, path: '/api/health', method: 'GET' });
    if (res.status !== 200 || res.data.status !== 'ONLINE') throw new Error(`Status ${res.status}`);
  });

  // 2. Login Admin
  let adminToken = '';
  await test('POST /api/auth/login (Admin)', async () => {
    const res = await apiCall(
      { host: '127.0.0.1', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'admin@viceverse.gg', password: 'ViceAdmin2026!' }
    );
    if (res.status !== 200 || !res.data.token || res.data.user.role !== 'admin') {
      throw new Error(`Login failed: ${JSON.stringify(res.data)}`);
    }
    adminToken = res.data.token;
  });

  // 3. Login Creator
  let creatorToken = '';
  await test('POST /api/auth/login (Creator - Maya Torres)', async () => {
    const res = await apiCall(
      { host: '127.0.0.1', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'neon@viceverse.gg', password: 'CreatorPass123!' }
    );
    if (res.status !== 200 || !res.data.token || res.data.user.role !== 'creator') {
      throw new Error(`Creator login failed`);
    }
    creatorToken = res.data.token;
  });

  // 4. Login Gamer / User
  let userToken = '';
  await test('POST /api/auth/login (Gamer - Alex Mercer)', async () => {
    const res = await apiCall(
      { host: '127.0.0.1', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'player1@viceverse.gg', password: 'GamerPass123!' }
    );
    if (res.status !== 200 || !res.data.token) {
      throw new Error(`Gamer login failed`);
    }
    userToken = res.data.token;
  });

  // 5. Registration
  await test('POST /api/auth/register (New Creator)', async () => {
    const testUsername = `streamer_${Date.now()}`;
    const res = await apiCall(
      { host: '127.0.0.1', port: 5000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {
        full_name: 'Test Streamer',
        username: testUsername,
        email: `${testUsername}@viceverse.gg`,
        password: 'Password123!',
        role: 'creator'
      }
    );
    if (res.status !== 201 || !res.data.token) {
      throw new Error(`Registration failed: ${JSON.stringify(res.data)}`);
    }
  });

  // 6. Get Creators
  await test('GET /api/creators', async () => {
    const res = await apiCall({ host: '127.0.0.1', port: 5000, path: '/api/creators', method: 'GET' });
    if (res.status !== 200 || !Array.isArray(res.data.creators) || res.data.creators.length < 8) {
      throw new Error(`Expected at least 8 creators, got ${res.data.creators?.length}`);
    }
  });

  // 7. Get Single Creator by Username
  await test('GET /api/creators/neonvalkyrie', async () => {
    const res = await apiCall({ host: '127.0.0.1', port: 5000, path: '/api/creators/neonvalkyrie', method: 'GET' });
    if (res.status !== 200 || res.data.creator.username !== 'neonvalkyrie' || !Array.isArray(res.data.creator.portfolio)) {
      throw new Error(`Failed to load creator profile`);
    }
  });

  // 8. Update Creator Profile
  await test('PUT /api/creators/profile/update (Protected)', async () => {
    const res = await apiCall(
      {
        host: '127.0.0.1',
        port: 5000,
        path: '/api/creators/profile/update',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${creatorToken}`
        }
      },
      {
        tagline: 'Vice City Premier Broadcaster & 3D Artist',
        featured_game: 'GTA VI Definitive'
      }
    );
    if (res.status !== 200 || !res.data.success) {
      throw new Error(`Update profile failed`);
    }
  });

  // 9. Add Portfolio Item
  let createdPortfolioId = null;
  await test('POST /api/creators/portfolio', async () => {
    const res = await apiCall(
      {
        host: '127.0.0.1',
        port: 5000,
        path: '/api/creators/portfolio',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${creatorToken}`
        }
      },
      {
        title: 'Leonida Vice Skyline 16K Test Render',
        description: 'Raytraced reflections over Biscayne Bay at twilight',
        image_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
        category: '3D Artwork',
        tags: 'GTA VI, Sunset, 16K'
      }
    );
    if (res.status !== 201 || !res.data.item) throw new Error('Add portfolio failed');
    createdPortfolioId = res.data.item.id;
  });

  // 10. Delete Portfolio Item
  await test('DELETE /api/creators/portfolio/:id', async () => {
    const res = await apiCall({
      host: '127.0.0.1',
      port: 5000,
      path: `/api/creators/portfolio/${createdPortfolioId}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${creatorToken}` }
    });
    if (res.status !== 200 || !res.data.success) throw new Error('Delete portfolio failed');
  });

  // 11. Categories
  await test('GET /api/products/categories', async () => {
    const res = await apiCall({ host: '127.0.0.1', port: 5000, path: '/api/products/categories', method: 'GET' });
    if (res.status !== 200 || res.data.categories.length < 5) {
      throw new Error(`Expected at least 5 categories, got ${res.data.categories?.length}`);
    }
  });

  // 12. Products
  await test('GET /api/products', async () => {
    const res = await apiCall({ host: '127.0.0.1', port: 5000, path: '/api/products', method: 'GET' });
    if (res.status !== 200 || res.data.products.length < 12) {
      throw new Error(`Expected at least 12 products, got ${res.data.products?.length}`);
    }
  });

  // 13. Single Product
  await test('GET /api/products/vice-lights-8k-oled-wallpaper-pack', async () => {
    const res = await apiCall({ host: '127.0.0.1', port: 5000, path: '/api/products/vice-lights-8k-oled-wallpaper-pack', method: 'GET' });
    if (res.status !== 200 || !res.data.product) throw new Error('Failed to load product');
  });

  // 14. Add to Cart
  await test('POST /api/cart/add', async () => {
    const res = await apiCall(
      {
        host: '127.0.0.1',
        port: 5000,
        path: '/api/cart/add',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      },
      { productId: 1, quantity: 1 }
    );
    if (res.status !== 200) throw new Error(`Add to cart failed: ${res.status}`);
  });

  // 15. Get Cart
  let cartItemId = null;
  await test('GET /api/cart', async () => {
    const res = await apiCall({
      host: '127.0.0.1',
      port: 5000,
      path: '/api/cart',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (res.status !== 200 || !res.data.cart.items.length) throw new Error('Cart is empty');
    cartItemId = res.data.cart.items[0].cart_item_id;
  });

  // 16. Demo Checkout (Place Simulated Order)
  let demoOrderId = null;
  await test('POST /api/orders/checkout (Demo Checkout)', async () => {
    const res = await apiCall(
      {
        host: '127.0.0.1',
        port: 5000,
        path: '/api/orders/checkout',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      },
      {
        customer_name: 'Alex Mercer',
        customer_email: 'player1@viceverse.gg',
        payment_method: 'demo_vice_credits',
        promo_code: 'VICE20'
      }
    );
    if (res.status !== 201 || !res.data.order || !res.data.order.orderNumber) {
      throw new Error(`Demo checkout failed: ${JSON.stringify(res.data)}`);
    }
    demoOrderId = res.data.order.id;
  });

  // 17. User Orders History
  await test('GET /api/orders/my-orders', async () => {
    const res = await apiCall({
      host: '127.0.0.1',
      port: 5000,
      path: '/api/orders/my-orders',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.orders)) throw new Error('Failed to get user orders');
  });

  // 18. Admin Stats
  await test('GET /api/admin/stats (Admin Only)', async () => {
    const res = await apiCall({
      host: '127.0.0.1',
      port: 5000,
      path: '/api/admin/stats',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !res.data.stats) throw new Error('Admin stats failed');
  });

  // 19. Admin Users Table
  await test('GET /api/admin/users', async () => {
    const res = await apiCall({
      host: '127.0.0.1',
      port: 5000,
      path: '/api/admin/users',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !res.data.users.length) throw new Error('Admin users failed');
  });

  // 20. Admin Orders Table
  await test('GET /api/admin/orders', async () => {
    const res = await apiCall({
      host: '127.0.0.1',
      port: 5000,
      path: '/api/admin/orders',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !res.data.orders.length) throw new Error('Admin orders failed');
  });

  console.log('\n====================================================');
  console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
