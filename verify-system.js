import WebSocket from './backend/node_modules/ws/index.js';

async function verifyFullSystem() {
  console.log('--- Step 1: Healthcheck ---');
  const healthRes = await fetch('http://localhost:3001/api/health');
  if (!healthRes.ok) throw new Error('Healthcheck failed');
  console.log('✅ Healthcheck passed:', await healthRes.json());

  console.log('--- Step 2: Auth Login (admin/password) ---');
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'password' }),
  });
  const loginJson = await loginRes.json();
  if (!loginRes.ok || !loginJson.token) throw new Error('Login failed');
  console.log('✅ Login passed. Token acquired for:', loginJson.user.name);
  const token = loginJson.token;

  console.log('--- Step 3: Auth Session Validate ---');
  const valRes = await fetch('http://localhost:3001/api/auth/validate', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!valRes.ok) throw new Error('Validation failed');
  console.log('✅ Session validated:', await valRes.json());

  console.log('--- Step 4: Summary Telemetry (Periodic Endpoint) ---');
  const sumRes = await fetch('http://localhost:3001/api/dashboard/summary', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!sumRes.ok) throw new Error('Summary fetch failed');
  const sumJson = await sumRes.json();
  console.log('✅ Summary telemetry retrieved:', {
    avgAmbient: sumJson.summary.avgAmbientTemp,
    totalPackages: sumJson.summary.totalPackagesToday,
    zonesCount: sumJson.zones.length,
  });

  console.log('--- Step 5: Alerts (Search & Filter) ---');
  const alertsRes = await fetch('http://localhost:3001/api/dashboard/alerts?severity=CRITICAL', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!alertsRes.ok) throw new Error('Alerts fetch failed');
  const alertsJson = await alertsRes.json();
  console.log('✅ Filtered alerts count:', alertsJson.alerts.length);

  console.log('--- Step 6: History (Chart Data) ---');
  const histRes = await fetch('http://localhost:3001/api/dashboard/history?range=24h', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!histRes.ok) throw new Error('History fetch failed');
  const histJson = await histRes.json();
  console.log('✅ History samples retrieved:', histJson.history.length);

  console.log('--- Step 7: WebSocket Live Telemetry Streaming ---');
  await new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:3001/live');
    let frameCount = 0;

    ws.on('open', () => {
      console.log('WebSocket connection opened.');
    });

    ws.on('message', (msg) => {
      const data = JSON.parse(msg.toString());
      if (data.metrics) {
        frameCount++;
        console.log(`Frame #${frameCount} received:`, {
          ambientTemp: data.metrics.ambientTemperature,
          coldStorage: data.metrics.coldStorageTemperature,
          conveyorLoad: data.metrics.conveyorLoad,
          status: data.status,
          event: data.event,
        });

        if (frameCount === 1) {
          console.log('Sending pause command to WebSocket server...');
          ws.send(JSON.stringify({ action: 'pause' }));
          setTimeout(() => {
            console.log('Sending resume command to WebSocket server...');
            ws.send(JSON.stringify({ action: 'resume' }));
          }, 500);
        } else if (frameCount >= 2) {
          ws.close();
          console.log('✅ WebSocket streaming and interactive command test passed.');
          resolve(true);
        }
      }
    });

    ws.on('error', (err) => reject(err));
    setTimeout(() => {
      if (frameCount === 0) reject(new Error('WebSocket timeout'));
    }, 5000);
  });

  console.log('\n🌟 ALL FULL-STACK SYSTEM VERIFICATIONS PASSED SUCCESSFULLY!');
}

verifyFullSystem()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  });
