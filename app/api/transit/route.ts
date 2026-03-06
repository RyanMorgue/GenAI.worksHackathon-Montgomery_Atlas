import { NextRequest, NextResponse } from 'next/server';

// Mock transit data for Montgomery
const mockTransitData = {
  busStops: [
    {
      id: 'stop_001',
      name: 'Riverfront Station',
      location: { lat: 32.3682, lng: -86.2998 },
      routes: ['Route 1', 'Route 5', 'Route 12'],
      accessibility: ['wheelchair', 'elevators'],
    },
    {
      id: 'stop_002',
      name: 'Downtown Transit Hub',
      location: { lat: 32.3767, lng: -86.3104 },
      routes: ['Route 2', 'Route 3', 'Route 8', 'Route 15'],
      accessibility: ['wheelchair', 'braille', 'audio'],
    },
    {
      id: 'stop_003',
      name: 'Court Square Station',
      location: { lat: 32.3790, lng: -86.2989 },
      routes: ['Route 4', 'Route 7', 'Route 11'],
      accessibility: ['wheelchair', 'elevators'],
    },
    {
      id: 'stop_004',
      name: 'Eastchase Transit Center',
      location: { lat: 32.3620, lng: -86.2780 },
      routes: ['Route 6', 'Route 9', 'Route 13'],
      accessibility: ['wheelchair', 'parking'],
    },
  ],
  schedules: [
    {
      route: 'Route 1',
      destination: 'Eastside',
      nextArrival: '5 minutes',
      frequency: '15 minutes',
      status: 'On time',
    },
    {
      route: 'Route 2',
      destination: 'Northgate',
      nextArrival: '12 minutes',
      frequency: '20 minutes',
      status: 'On time',
    },
    {
      route: 'Route 3',
      destination: 'South Montgomery',
      nextArrival: '8 minutes',
      frequency: '15 minutes',
      status: 'Delayed by 3 minutes',
    },
  ],
  realTimeAlerts: [
    {
      id: 'alert_001',
      type: 'delay',
      message: 'Route 3 experiencing minor delays due to traffic',
      severity: 'low',
    },
    {
      id: 'alert_002',
      type: 'service_change',
      message: 'Saturday service: Modified schedule on Routes 5 & 12',
      severity: 'info',
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    let data = {};

    switch (type) {
      case 'stops':
        data = { busStops: mockTransitData.busStops };
        break;
      case 'schedules':
        data = { schedules: mockTransitData.schedules };
        break;
      case 'alerts':
        data = { alerts: mockTransitData.realTimeAlerts };
        break;
      default:
        data = mockTransitData;
    }

    return NextResponse.json({
      status: 'success',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Transit API error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
