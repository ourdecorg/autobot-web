import { ServiceStatus, Coordinates } from '@/types';
import { MOCK_INSPECTOR_ROUTES, MOCK_TRANSPORT_ROUTES } from './mockData';

export const SERVICE_FLOW: ServiceStatus[] = [
  'pending',
  'inspector_assigned',
  'inspector_en_route',
  'inspection_in_progress',
  'inspection_passed',
  'transport_en_route',
  'at_institute',
  'test_in_progress',
  'test_passed',
  'completed',
];

export const STATUS_DURATIONS: Record<ServiceStatus, number> = {
  pending: 3000,
  inspector_assigned: 4000,
  inspector_en_route: 8000,
  inspection_in_progress: 6000,
  inspection_passed: 3000,
  inspection_failed: 0,
  transport_en_route: 10000,
  at_institute: 3000,
  test_in_progress: 8000,
  test_passed: 3000,
  test_failed: 0,
  completed: 0,
};

export interface SimulationCallbacks {
  onStatusChange: (bookingId: string, status: ServiceStatus) => void;
  onLocationUpdate: (bookingId: string, field: 'inspectorLocation' | 'vehicleLocation', coords: Coordinates) => void;
  onVehicleAtInstitute: (bookingId: string) => void;
}

export interface SimulationHandle {
  stop: () => void;
}

export function startSimulation(
  bookingId: string,
  callbacks: SimulationCallbacks
): SimulationHandle {
  let stopped = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let stepIndex = 0;
  let routeIndex = 0;

  const stopLocation = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startLocationSim = (type: 'inspector' | 'transport') => {
    stopLocation();
    routeIndex = 0;
    const route = type === 'inspector' ? MOCK_INSPECTOR_ROUTES : MOCK_TRANSPORT_ROUTES;
    const field = type === 'inspector' ? 'inspectorLocation' : 'vehicleLocation';

    intervalId = setInterval(() => {
      if (stopped || routeIndex >= route.length) {
        stopLocation();
        return;
      }
      callbacks.onLocationUpdate(bookingId, field, route[routeIndex]);
      routeIndex++;
    }, 1500);
  };

  const advanceStep = () => {
    if (stopped) return;
    const currentStatus = SERVICE_FLOW[stepIndex];
    if (!currentStatus || currentStatus === 'completed') return;
    const nextStatus = SERVICE_FLOW[stepIndex + 1];
    if (!nextStatus) return;

    const duration = STATUS_DURATIONS[currentStatus];
    timeoutId = setTimeout(() => {
      if (stopped) return;
      callbacks.onStatusChange(bookingId, nextStatus);

      if (nextStatus === 'inspector_en_route') startLocationSim('inspector');
      if (nextStatus === 'inspection_in_progress') stopLocation();
      if (nextStatus === 'transport_en_route') startLocationSim('transport');
      if (nextStatus === 'at_institute') {
        stopLocation();
        callbacks.onVehicleAtInstitute(bookingId);
      }

      stepIndex++;
      advanceStep();
    }, duration);
  };

  advanceStep();

  return {
    stop: () => {
      stopped = true;
      if (timeoutId) clearTimeout(timeoutId);
      stopLocation();
    },
  };
}
