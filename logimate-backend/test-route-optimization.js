const fetch = require('node-fetch');

async function testRouteOptimization() {
  try {
    const response = await fetch('http://localhost:3001/api/routes/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start: 'New York, NY',
        end: 'Boston, MA',
        waypoints: ['Hartford, CT', 'Providence, RI']
      })
    });

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRouteOptimization();
