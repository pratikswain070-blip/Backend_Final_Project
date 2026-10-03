/**
 * EnergySaver - Simplified Frontend Controller
 * Direct 1:1 mapping with backend REST APIs and Socket.io
 */

// Production & Local Auto-Detection
const isSameOrigin = window.location.port === '5003' || window.location.hostname !== 'localhost';
const API_BASE = isSameOrigin ? '/api' : 'http://localhost:5003/api';
const SOCKET_BASE = isSameOrigin ? window.location.origin : 'http://localhost:5003';

// App state
let token = localStorage.getItem('token') || '';
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let currentHomeId = '';
let homes = [];
let devices = [];
let chart = null;

// ==========================================
// 1. API Helper (Calls Backend with JWT)
// ==========================================
async function api(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    showToast(data.message || 'API request failed', true);
    throw new Error(data.message);
  }
  return data;
}

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.borderColor = isError ? 'var(--danger)' : 'var(--primary)';
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// ==========================================
// 2. Initialization & Socket.io Setup
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupSocket();
  setupModals();

  if (!token || !currentUser) {
    // Auto-login as default demo homeowner
    await login('pratik@example.com', 'password123');
  } else {
    updateUserDisplay();
    await loadInitialData();
  }
});

function setupSocket() {
  const socketPill = document.getElementById('socketStatus');
  try {
    const socket = io(SOCKET_BASE);

    socket.on('connect', () => {
      socketPill.textContent = '● Live Socket Active';
      socketPill.style.color = 'var(--primary)';
      if (currentHomeId) socket.emit('join-home', currentHomeId);
    });

    socket.on('disconnect', () => {
      socketPill.textContent = '○ Socket Disconnected';
      socketPill.style.color = 'var(--danger)';
    });

    // Real-time IoT reading received
    socket.on('new-reading', (reading) => {
      showToast(`⚡ Real-time Reading received: ${reading.energyConsumed} kWh`);
      loadReadings();
    });
  } catch (err) {
    socketPill.textContent = '○ Socket Offline';
  }
}

// ==========================================
// 3. Authentication (POST /api/auth/login)
// ==========================================
async function login(email, password) {
  try {
    const res = await api('/auth/login', 'POST', { email, password });
    token = res.data.token;
    currentUser = res.data.user;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(currentUser));

    updateUserDisplay();
    showToast(`Logged in as ${currentUser.name} (${currentUser.role})`);
    await loadInitialData();
  } catch (err) {
    console.error('Login error:', err);
  }
}

function updateUserDisplay() {
  document.getElementById('currentUserName').textContent = currentUser?.name || 'User';
  document.getElementById('currentUserRole').textContent = currentUser?.role || 'user';

  // Toggle admin portal visibility
  const adminSection = document.getElementById('adminSection');
  if (currentUser?.role === 'admin') {
    adminSection.style.display = 'block';
    loadAdminData();
  } else {
    adminSection.style.display = 'none';
  }
}

// ==========================================
// 4. Homes Management (GET/POST /api/homes)
// ==========================================
async function loadInitialData() {
  await loadHomes();
  await loadDevices();
  await loadReadings();
  await loadLimits();
  await loadAlerts();
  await loadComparison();
  await loadReports();
  await loadTips();
}

async function loadHomes() {
  try {
    const res = await api('/homes');
    homes = res.data || [];

    const select = document.getElementById('homeSelect');
    select.innerHTML = '';

    if (homes.length === 0) {
      select.innerHTML = '<option value="">No homes registered. Please add one below.</option>';
      return;
    }

    homes.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h._id;
      opt.textContent = `${h.name} (${h.neighborhood || h.city})`;
      select.appendChild(opt);
    });

    currentHomeId = homes[0]._id;
    updateHomeAddress();

    select.onchange = (e) => {
      currentHomeId = e.target.value;
      updateHomeAddress();
      loadDevices();
      loadComparison();
    };
  } catch (err) {}
}

function updateHomeAddress() {
  const current = homes.find(h => h._id === currentHomeId);
  const textElem = document.getElementById('homeAddressText');
  if (current && textElem) {
    textElem.textContent = `${current.address}, ${current.city}`;
  }
}

// Form: Add Home (POST /api/homes)
document.getElementById('addHomeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('homeName').value;
  const address = document.getElementById('homeAddress').value;
  const city = document.getElementById('homeCity').value;
  const neighborhood = document.getElementById('homeNeighborhood').value;

  try {
    await api('/homes', 'POST', { name, address, city, neighborhood });
    showToast(`Home "${name}" registered successfully`);
    e.target.reset();
    await loadHomes();
  } catch (err) {}
});

// ==========================================
// 5. Smart Devices (GET/POST/PUT/DELETE /api/devices)
// ==========================================
async function loadDevices() {
  try {
    const res = await api('/devices');
    devices = res.data || [];

    const tbody = document.getElementById('devicesTableBody');
    const readingSelect = document.getElementById('readingDeviceSelect');
    const limitScope = document.getElementById('limitScope');

    readingSelect.innerHTML = '';
    limitScope.innerHTML = '<option value="home">Whole Home</option>';

    if (devices.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No devices added for this home.</td></tr>';
      return;
    }

    // Populate Device Selects
    devices.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d._id;
      opt.textContent = `${d.name} (${d.type})`;
      readingSelect.appendChild(opt);

      const limitOpt = document.createElement('option');
      limitOpt.value = d._id;
      limitOpt.textContent = `Appliance: ${d.name}`;
      limitScope.appendChild(limitOpt);
    });

    // Populate Table
    tbody.innerHTML = devices.map(d => `
      <tr>
        <td><strong>${d.name}</strong></td>
        <td><span class="badge" style="background:#1e293b; border:1px solid #475569;">${d.type}</span></td>
        <td>${d.brand || 'Generic'}</td>
        <td style="font-family:var(--mono);">${d.powerRating} W</td>
        <td>
          <button class="btn btn-sm ${d.status === 'on' ? 'btn-primary' : 'btn-outline'}" onclick="toggleDevice('${d._id}', '${d.status === 'on' ? 'off' : 'on'}')">
            ${d.status.toUpperCase()}
          </button>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteDevice('${d._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {}
}

// Form: Add Device (POST /api/devices)
document.getElementById('addDeviceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentHomeId) return showToast('Please select or create a home first', true);

  const name = document.getElementById('deviceName').value;
  const type = document.getElementById('deviceType').value;
  const brand = document.getElementById('deviceBrand').value;
  const powerRating = Number(document.getElementById('devicePower').value);

  try {
    await api('/devices', 'POST', { home: currentHomeId, name, type, brand, powerRating });
    showToast(`Device "${name}" added`);
    e.target.reset();
    await loadDevices();
  } catch (err) {}
});

// Update Device Status (PUT /api/devices/:id)
window.toggleDevice = async function(deviceId, newStatus) {
  try {
    await api(`/devices/${deviceId}`, 'PUT', { status: newStatus });
    showToast(`Device turned ${newStatus.toUpperCase()}`);
    await loadDevices();
  } catch (err) {}
};

// Delete Device (DELETE /api/devices/:id)
window.deleteDevice = async function(deviceId) {
  if (!confirm('Are you sure you want to remove this device?')) return;
  try {
    await api(`/devices/${deviceId}`, 'DELETE');
    showToast('Device removed');
    await loadDevices();
  } catch (err) {}
};

// ==========================================
// 6. Energy Readings (GET/POST /api/readings)
// ==========================================
async function loadReadings() {
  try {
    const res = await api('/readings');
    const readings = res.data || [];

    const tbody = document.getElementById('readingsTableBody');
    if (readings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No readings recorded yet.</td></tr>';
      return;
    }

    // Populate Table (Latest 10)
    tbody.innerHTML = readings.slice(0, 10).map(r => {
      const devName = r.device?.name || 'Smart Device';
      const powerW = Math.round((r.voltage || 230) * (r.current || 0));
      const time = new Date(r.timestamp).toLocaleTimeString();

      return `
        <tr>
          <td><strong>${devName}</strong></td>
          <td style="font-family:var(--mono); color:var(--primary); font-weight:700;">${r.energyConsumed} kWh</td>
          <td>${r.voltage || 230} V</td>
          <td>${r.current || 0} A</td>
          <td style="font-family:var(--mono);">${powerW} W</td>
          <td class="text-muted">${time}</td>
        </tr>
      `;
    }).join('');

    renderChart(readings);
  } catch (err) {}
}

// Form: Transmit Reading (POST /api/readings)
document.getElementById('addReadingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const device = document.getElementById('readingDeviceSelect').value;
  const energyConsumed = Number(document.getElementById('readingKwh').value);
  const voltage = Number(document.getElementById('readingVoltage').value);
  const current = Number(document.getElementById('readingCurrent').value);

  if (!device) return showToast('Please select a device', true);

  try {
    await api('/readings', 'POST', { device, energyConsumed, voltage, current });
    showToast('Reading transmitted successfully!');
    await loadReadings();
  } catch (err) {}
});

document.getElementById('refreshReadingsBtn').addEventListener('click', loadReadings);

// Render Chart.js Graph
function renderChart(readings) {
  const ctx = document.getElementById('readingsChart');
  if (!ctx) return;

  const recent = [...readings].reverse().slice(-10);
  const labels = recent.map(r => new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const kwhData = recent.map(r => r.energyConsumed);

  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = kwhData;
    chart.update();
    return;
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Energy Consumed (kWh)',
        data: kwhData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#10b981' } }
      },
      plugins: {
        legend: { labels: { color: '#94a3b8' } }
      }
    }
  });
}

// ==========================================
// 7. Limits & Alerts (GET/POST /api/limits & /api/alerts)
// ==========================================
async function loadLimits() {
  try {
    const res = await api('/limits');
    const limits = res.data || [];
    const container = document.getElementById('limitsListContainer');

    if (limits.length === 0) {
      container.innerHTML = '<p class="text-muted">No limits configured yet.</p>';
      return;
    }

    container.innerHTML = limits.map(l => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid var(--card-border);">
        <div>
          <strong>${l.device ? (l.device.name || 'Appliance') : 'Whole Home'}</strong>
          <span class="badge" style="background:#1e293b; margin-left:6px;">${l.limitType}</span>
          <div class="text-muted" style="font-size:0.75rem;">Alert at ${l.alertPercentage}%</div>
        </div>
        <div style="font-family:var(--mono); font-size:1.1rem; font-weight:700; color:var(--primary);">
          ${l.limitValue} kWh
        </div>
      </div>
    `).join('');
  } catch (err) {}
}

// Form: Set Limit (POST /api/limits)
document.getElementById('addLimitForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentHomeId) return showToast('Please select a home', true);

  const scope = document.getElementById('limitScope').value;
  const limitType = document.getElementById('limitType').value;
  const limitValue = Number(document.getElementById('limitValue').value);
  const alertPercentage = Number(document.getElementById('alertPercentage').value);

  const payload = { home: currentHomeId, limitType, limitValue, alertPercentage };
  if (scope !== 'home') payload.device = scope;

  try {
    await api('/limits', 'POST', payload);
    showToast('Usage limit saved!');
    await loadLimits();
  } catch (err) {}
});

async function loadAlerts() {
  try {
    const res = await api('/alerts');
    const alerts = res.data || [];
    const container = document.getElementById('alertsListContainer');
    const badge = document.getElementById('alertCountBadge');

    badge.textContent = `${alerts.length} Alerts`;

    if (alerts.length === 0) {
      container.innerHTML = '<p class="text-muted">All clear. No threshold alerts triggered.</p>';
      return;
    }

    container.innerHTML = alerts.map(a => `
      <div style="padding:10px 14px; background:rgba(239,68,68,0.08); border-left:3px solid var(--danger); margin-bottom:8px; border-radius:4px;">
        <div style="display:flex; justify-content:space-between;">
          <strong style="color:var(--text);">${a.message}</strong>
          <span class="text-muted">${new Date(a.createdAt).toLocaleTimeString()}</span>
        </div>
        <div class="text-muted" style="font-size:0.8rem; margin-top:4px;">
          Usage: ${a.currentUsage} kWh (Limit: ${a.limitValue} kWh)
        </div>
      </div>
    `).join('');
  } catch (err) {}
}

// Button: Check Alerts (POST /api/alerts/check)
document.getElementById('runAlertCheckBtn').addEventListener('click', async () => {
  try {
    const res = await api('/alerts/check', 'POST');
    showToast(res.message || 'Alert check completed');
    await loadAlerts();
  } catch (err) {}
});

// ==========================================
// 8. Reports & Comparison
// ==========================================
async function loadComparison() {
  try {
    // Neighborhood Comparison (GET /api/compare/neighborhood)
    const res = await api('/compare/neighborhood');
    const d = res.data;
    if (d) {
      document.getElementById('compUserUsage').textContent = `${(d.userUsage || 0).toFixed(1)} kWh`;
      document.getElementById('compNeighborUsage').textContent = `${(d.neighborhoodAverage || 0).toFixed(1)} kWh`;
      document.getElementById('compMessage').textContent = d.message || 'Comparison completed.';
    }

    // Average across homes (GET /api/compare/average)
    const avgRes = await api('/compare/average');
    if (avgRes.data) {
      document.getElementById('avgHomesUsage').textContent = `${(avgRes.data.averageConsumption || 0).toFixed(1)} kWh`;
    }
  } catch (err) {}
}

async function loadReports() {
  try {
    // Monthly (GET /api/reports/monthly)
    const res = await api('/reports/monthly');
    if (res.data) {
      document.getElementById('monthlyTotal').textContent = `${(res.data.totalUsage || 0).toFixed(1)} kWh`;
      const container = document.getElementById('monthlyBreakdownContainer');
      if (res.data.byDevice && res.data.byDevice.length > 0) {
        container.innerHTML = res.data.byDevice.map(dev => `
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
            <span>${dev.deviceName}</span>
            <span style="font-family:var(--mono); color:var(--primary);">${dev.totalUsage} kWh</span>
          </div>
        `).join('');
      } else {
        container.innerHTML = '<span class="text-muted">No appliance breakdown yet.</span>';
      }
    }

    // Savings (GET /api/reports/savings)
    const savRes = await api('/reports/savings');
    if (savRes.data) {
      const sav = savRes.data;
      document.getElementById('savingsKwh').textContent = `${sav.savingsKwh >= 0 ? '-' : '+'}${Math.abs(sav.savingsKwh)} kWh`;
      document.getElementById('savingsKwh').style.color = sav.savingsKwh >= 0 ? 'var(--primary)' : 'var(--warning)';
      document.getElementById('savingsMessage').textContent = sav.message || '';
    }
  } catch (err) {}
}

// ==========================================
// 9. Tips & Admin Portal
// ==========================================
async function loadTips() {
  try {
    const res = await api('/tips');
    const tips = res.data || [];
    const container = document.getElementById('tipsContainer');

    if (tips.length === 0) {
      container.innerHTML = '<p class="text-muted">No energy tips available.</p>';
      return;
    }

    container.innerHTML = tips.map(t => `
      <div class="card" style="padding:14px;">
        <span class="badge" style="background:rgba(16,185,129,0.1); color:var(--primary);">${t.category.toUpperCase()}</span>
        <h4 style="margin:8px 0 4px;">${t.title}</h4>
        <p class="text-muted">${t.description}</p>
      </div>
    `).join('');
  } catch (err) {}
}

async function loadAdminData() {
  try {
    // GET /api/admin/devices
    const devsRes = await api('/admin/devices');
    const body = document.getElementById('adminDevicesBody');
    if (body && devsRes.data) {
      body.innerHTML = devsRes.data.map(d => `
        <tr>
          <td><strong>${d.name}</strong></td>
          <td>${d.type}</td>
          <td>${d.home?.name || 'Home'}</td>
          <td>${d.powerRating} W</td>
          <td><span class="badge" style="background:#1e293b;">${d.status}</span></td>
        </tr>
      `).join('');
    }
  } catch (err) {}
}

// Form: Add Template (POST /api/admin/templates)
document.getElementById('addTemplateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('templateName').value;
  const type = document.getElementById('templateType').value;
  const defaultPowerRating = Number(document.getElementById('templatePower').value);
  const description = document.getElementById('templateDesc').value;

  try {
    await api('/admin/templates', 'POST', { name, type, defaultPowerRating, description });
    showToast(`Template "${name}" created!`);
    e.target.reset();
  } catch (err) {}
});

// ==========================================
// 10. Modals & Tab Switching
// ==========================================
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.remove('active');
        if (c.id === targetId) c.classList.add('active');
      });
    });
  });
}

function setupModals() {
  const modal = document.getElementById('authModal');
  document.getElementById('switchUserBtn').addEventListener('click', () => modal.classList.add('open'));
  document.getElementById('closeAuthModal').addEventListener('click', () => modal.classList.remove('open'));

  document.getElementById('loginPratikBtn').addEventListener('click', async () => {
    await login('pratik@example.com', 'password123');
    modal.classList.remove('open');
  });

  document.getElementById('loginAdminBtn').addEventListener('click', async () => {
    await login('admin@example.com', 'password123');
    modal.classList.remove('open');
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    token = '';
    currentUser = null;
    localStorage.clear();
    location.reload();
  });
}
