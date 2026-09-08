/**
 * Smart Warehouse Telemetry Data Generator
 * Domain: NexusFlow Smart Warehouse & Automated Logistics
 */

let state = {
  ambientTemp: 22.4,
  coldStorageTemp: -18.2,
  humidity: 48.5,
  conveyorLoad: 412.0,
  packageThroughput: 64,
  agvBattery: 88,
  totalPackagesProcessed: 14280,
  lastAnomaly: null,
};

export const generateLiveData = () => {
  // Fluctuations
  state.ambientTemp += (Math.random() - 0.49) * 0.4;
  state.ambientTemp = Math.max(16, Math.min(32, state.ambientTemp));

  state.coldStorageTemp += (Math.random() - 0.49) * 0.3;
  state.coldStorageTemp = Math.max(-24, Math.min(-12, state.coldStorageTemp));

  state.humidity += (Math.random() - 0.49) * 0.8;
  state.humidity = Math.max(30, Math.min(75, state.humidity));

  state.conveyorLoad += (Math.random() - 0.48) * 12;
  state.conveyorLoad = Math.max(150, Math.min(680, state.conveyorLoad));

  state.packageThroughput += Math.floor((Math.random() - 0.48) * 4);
  state.packageThroughput = Math.max(25, Math.min(120, state.packageThroughput));

  state.totalPackagesProcessed += Math.floor(Math.random() * 3);

  state.agvBattery -= 0.05 * Math.random();
  if (state.agvBattery < 20) state.agvBattery = 98; // Simulated dock & recharge

  // Threshold / Status evaluation
  let status = 'NOMINAL';
  let event = 'TELEMETRY_SAMPLE';

  if (state.ambientTemp > 28.5 || state.coldStorageTemp > -14 || state.conveyorLoad > 620) {
    status = 'CRITICAL';
    if (state.coldStorageTemp > -14) event = 'COLD_CHAIN_TEMPERATURE_BREACH';
    else if (state.conveyorLoad > 620) event = 'CONVEYOR_OVERLOAD_PREVENTATIVE_STOP';
    else event = 'MAIN_BAY_HEAT_WARNING';
  } else if (state.ambientTemp > 26 || state.humidity > 65 || state.agvBattery < 30) {
    status = 'ALERT';
    if (state.agvBattery < 30) event = 'AGV_FLEET_LOW_BATTERY';
    else if (state.humidity > 65) event = 'HUMIDITY_THRESHOLD_EXCEEDED';
    else event = 'AMBIENT_TEMPERATURE_ELEVATED';
  }

  const eventsPool = [
    'PALLET_SCAN_COMPLETE',
    'SORTATION_GATE_ACTIVE',
    'AGV_FLEET_SYNC',
    'RFID_ZONE_CHECKIN',
    'DISPATCH_BAY_LOADED',
    'ROBOTIC_ARM_CYCLE_OK'
  ];

  if (status === 'NOMINAL' && Math.random() < 0.4) {
    event = eventsPool[Math.floor(Math.random() * eventsPool.length)];
  }

  return {
    timestamp: new Date().toISOString(),
    metrics: {
      ambientTemperature: parseFloat(state.ambientTemp.toFixed(1)),
      coldStorageTemperature: parseFloat(state.coldStorageTemp.toFixed(1)),
      humidity: parseFloat(state.humidity.toFixed(1)),
      conveyorLoad: parseFloat(state.conveyorLoad.toFixed(1)),
      packageThroughput: state.packageThroughput,
      agvBattery: parseFloat(state.agvBattery.toFixed(0)),
      totalProcessed: state.totalPackagesProcessed,
    },
    status,
    event,
    facility: 'Zone B - East Sorting Facility',
  };
};

export const generateSummaryData = () => {
  return {
    summary: {
      avgAmbientTemp: parseFloat((21.8 + (Math.random() - 0.5) * 1.2).toFixed(1)),
      avgColdStorageTemp: parseFloat((-18.5 + (Math.random() - 0.5) * 0.8).toFixed(1)),
      totalPackagesToday: state.totalPackagesProcessed,
      activeRobots: 18,
      conveyorHealthIndex: 97.4,
      totalEventsLast10Min: Math.floor(Math.random() * 45) + 60,
      criticalCount: Math.floor(Math.random() * 2),
      warningCount: Math.floor(Math.random() * 6) + 1,
      trend: {
        throughputDelta: parseFloat(((Math.random() - 0.4) * 8.5).toFixed(1)),
        direction: Math.random() > 0.4 ? 'UP' : 'DOWN',
        energyEfficiency: '+4.2% vs Yesterday',
      },
    },
    zones: [
      { id: 'Z-01', name: 'Intake Bay A', status: 'Optimal', throughput: '84 pk/m', temp: '21.5°C' },
      { id: 'Z-02', name: 'Cold Chain Vault', status: 'Optimal', throughput: '42 pk/m', temp: '-18.1°C' },
      { id: 'Z-03', name: 'High-Speed Conveyor 4', status: 'Heavy Load', throughput: '115 pk/m', temp: '24.2°C' },
      { id: 'Z-04', name: 'Automated Stacker Cranes', status: 'Optimal', throughput: '68 pk/m', temp: '22.0°C' },
    ],
    lastUpdated: new Date().toISOString(),
  };
};

export const generateAlertsData = () => {
  const sampleAlerts = [
    {
      id: 'ALT-1094',
      severity: 'CRITICAL',
      source: 'Cold Chain Vault #2',
      message: 'Cold storage temperature elevated above safety parameter (-14.0°C)',
      metric: 'Temperature',
      value: '-13.4°C',
      threshold: '< -15.0°C',
      timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
      acknowledged: false,
    },
    {
      id: 'ALT-1093',
      severity: 'WARNING',
      source: 'Conveyor Section 3B',
      message: 'Conveyor belt payload nearing maximum dynamic rating (620 kg)',
      metric: 'Conveyor Load',
      value: '614 kg',
      threshold: '< 600 kg',
      timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
      acknowledged: true,
    },
    {
      id: 'ALT-1092',
      severity: 'WARNING',
      source: 'AGV Mobile Fleet Unit #07',
      message: 'Battery level reached 24%. Automatic routing to inductive charging pad initiated.',
      metric: 'AGV Battery',
      value: '24%',
      threshold: '> 25%',
      timestamp: new Date(Date.now() - 28 * 60000).toISOString(),
      acknowledged: true,
    },
    {
      id: 'ALT-1091',
      severity: 'INFO',
      source: 'Automated Dispatch Bay 4',
      message: 'Outbound logistics carrier trailer locked into bay seal. Sortation routing active.',
      metric: 'Dispatch System',
      value: 'Docked',
      threshold: 'N/A',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      acknowledged: true,
    },
    {
      id: 'ALT-1090',
      severity: 'INFO',
      source: 'RFID Scanner Gate 2',
      message: 'High-frequency batch verification completed: 450 items scanned with zero misreads.',
      metric: 'Scanner Accuracy',
      value: '100%',
      threshold: '> 99.5%',
      timestamp: new Date(Date.now() - 72 * 60000).toISOString(),
      acknowledged: true,
    },
    {
      id: 'ALT-1089',
      severity: 'CRITICAL',
      source: 'Robotics Palletizer #1',
      message: 'Emergency optical safety light curtain triggered by foreign object.',
      metric: 'Safety Sensor',
      value: 'Interrupted',
      threshold: 'Clear',
      timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
      acknowledged: true,
    }
  ];

  return {
    alerts: sampleAlerts,
    totalCount: sampleAlerts.length,
    unreadCritical: sampleAlerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged).length,
    lastUpdated: new Date().toISOString(),
  };
};

export const generateHistoryData = (range = '1h') => {
  const points = range === '24h' ? 24 : range === '7d' ? 28 : 20;
  const intervalMs = range === '24h' ? 3600000 : range === '7d' ? 21600000 : 180000;

  const history = Array.from({ length: points }, (_, i) => {
    const time = new Date(Date.now() - (points - 1 - i) * intervalMs);
    return {
      timestamp: time.toISOString(),
      formattedTime: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ambientTemp: parseFloat((21.0 + Math.sin(i / 3) * 2.5 + (Math.random() - 0.5)).toFixed(1)),
      coldStorageTemp: parseFloat((-18.2 + Math.cos(i / 3) * 1.2 + (Math.random() - 0.5) * 0.4).toFixed(1)),
      conveyorLoad: Math.round(380 + Math.sin(i / 2) * 80 + Math.random() * 40),
      throughput: Math.round(65 + Math.sin(i / 4) * 25 + Math.random() * 10),
      humidity: Math.round(48 + Math.cos(i / 4) * 8 + Math.random() * 4),
    };
  });

  return {
    range,
    history,
    lastUpdated: new Date().toISOString(),
  };
};
