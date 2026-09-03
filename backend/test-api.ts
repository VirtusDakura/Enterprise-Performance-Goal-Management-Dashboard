import http from 'http';
import { createApp } from './src/app';
import { prisma } from './src/lib/prisma';

// Automated API integration tester
async function runTests() {
  console.log('--- Starting Backend API Automated Verification Suite ---');

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 5000;
  const baseUrl = `http://localhost:${port}/api`;

  let passed = 0;
  let failed = 0;

  const assert = (name: string, condition: boolean, message?: string) => {
    if (condition) {
      console.log(` PASS: ${name}`);
      passed++;
    } else {
      console.error(` FAIL: ${name} - ${message || 'Assertion failed'}`);
      failed++;
    }
  };

  try {
    // Test 1: Health Check
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert('GET /api/health returns 200 and healthy status', healthRes.status === 200 && healthData.status === 'healthy');

    // Test 2: Departments
    const deptRes = await fetch(`${baseUrl}/departments`);
    const deptData = await deptRes.json();
    assert('GET /api/departments returns departments list', deptRes.status === 200 && Array.isArray(deptData.data) && deptData.data.length > 0);

    // Test 3: Employees
    const empRes = await fetch(`${baseUrl}/employees`);
    const empData = await empRes.json();
    assert('GET /api/employees returns employees with department', empRes.status === 200 && Array.isArray(empData.data) && empData.data[0].department !== undefined);

    // Test 4: Goals List
    const goalsRes = await fetch(`${baseUrl}/goals`);
    const goalsData = await goalsRes.json();
    assert('GET /api/goals returns goals with nested employee and department', goalsRes.status === 200 && Array.isArray(goalsData.data) && goalsData.data[0].employee.department !== undefined);

    const firstGoal = goalsData.data[0];

    // Test 5: Patch Goal Progress
    const newProgress = Math.min(100, Math.max(0, (firstGoal.progress + 10) % 100));
    const patchRes = await fetch(`${baseUrl}/goals/${firstGoal.id}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: newProgress }),
    });
    const patchData = await patchRes.json();
    assert('PATCH /api/goals/:id/progress updates progress percentage', patchRes.status === 200 && patchData.data.progress === newProgress);

    // Test 6: Post Peer Review
    const reviewRes = await fetch(`${baseUrl}/goals/${firstGoal.id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewerName: 'Integration Tester',
        feedback: 'Superb dedication and attention to detail during this sprint.',
        rating: 5,
      }),
    });
    const reviewData = await reviewRes.json();
    assert('POST /api/goals/:id/reviews submits 360 review', reviewRes.status === 201 && reviewData.data.rating === 5);

    // Test 7: Create Goal
    const createRes = await fetch(`${baseUrl}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Automated Test Goal Creation',
        description: 'Verifying end-to-end goal creation with full payload validation.',
        deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
        employeeId: empData.data[0].id,
        progress: 15,
      }),
    });
    const createData = await createRes.json();
    assert('POST /api/goals creates goal and returns nested relations', createRes.status === 201 && createData.data.employee.id === empData.data[0].id);

    // Test 8: Analytics Aggregation
    const analyticsRes = await fetch(`${baseUrl}/analytics`);
    const analyticsData = await analyticsRes.json();
    assert('GET /api/analytics returns totalActiveGoals', typeof analyticsData.data.totalActiveGoals === 'number');
    assert('GET /api/analytics returns companyAverageProgress', typeof analyticsData.data.companyAverageProgress === 'number');
    assert('GET /api/analytics returns topDepartment with averageProgress', analyticsData.data.topDepartment !== null && typeof analyticsData.data.topDepartment.averageProgress === 'number');

    console.log(`\nVerification complete. Passed: ${passed}, Failed: ${failed}`);
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
    await prisma.$disconnect();
    if (failed > 0) {
      process.exit(1);
    }
  }
}

runTests();
