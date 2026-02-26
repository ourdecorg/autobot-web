import { ServiceStatus, StatusStep } from '@/types';

export const STATUS_LABELS: Record<ServiceStatus, string> = {
  pending: 'ממתין לאישור',
  inspector_assigned: 'בוחן שויך',
  inspector_en_route: 'בוחן בדרך',
  inspection_in_progress: 'בדיקה מתבצעת',
  inspection_passed: 'בדיקה עברה',
  inspection_failed: 'בדיקה נכשלה',
  transport_en_route: 'הרכב בדרך למכון',
  at_institute: 'במכון הרישוי',
  test_in_progress: 'טסט מתבצע',
  test_passed: 'טסט עבר',
  test_failed: 'טסט נכשל',
  completed: 'הושלם',
};

export const STATUS_DESCRIPTIONS: Record<ServiceStatus, string> = {
  pending: 'הבקשה שלך נקלטה ואנחנו מחפשים בוחן זמין',
  inspector_assigned: 'בוחן מקצועי שויך לבקשה שלך',
  inspector_en_route: 'הבוחן בדרך אליך - צפוי להגיע בקרוב',
  inspection_in_progress: 'הבוחן מבצע בדיקה טכנית לרכב שלך',
  inspection_passed: 'הרכב עבר את הבדיקה הטכנית בהצלחה',
  inspection_failed: 'הרכב לא עבר את הבדיקה הטכנית',
  transport_en_route: 'הרכב שלך בדרך למכון הרישוי',
  at_institute: 'הרכב הגיע למכון הרישוי',
  test_in_progress: 'הטסט הרשמי מתבצע כעת',
  test_passed: 'הרכב עבר את הטסט בהצלחה',
  test_failed: 'הרכב לא עבר את הטסט',
  completed: 'השירות הושלם בהצלחה',
};

export const STATUS_COLORS: Record<ServiceStatus, string> = {
  pending: '#6B7280',
  inspector_assigned: '#3B82F6',
  inspector_en_route: '#8B5CF6',
  inspection_in_progress: '#F59E0B',
  inspection_passed: '#10B981',
  inspection_failed: '#EF4444',
  transport_en_route: '#8B5CF6',
  at_institute: '#F59E0B',
  test_in_progress: '#F59E0B',
  test_passed: '#10B981',
  test_failed: '#EF4444',
  completed: '#10B981',
};

export const STATUS_BG_COLORS: Record<ServiceStatus, string> = {
  pending: 'bg-gray-100 text-gray-700',
  inspector_assigned: 'bg-blue-100 text-blue-700',
  inspector_en_route: 'bg-purple-100 text-purple-700',
  inspection_in_progress: 'bg-yellow-100 text-yellow-700',
  inspection_passed: 'bg-green-100 text-green-700',
  inspection_failed: 'bg-red-100 text-red-700',
  transport_en_route: 'bg-purple-100 text-purple-700',
  at_institute: 'bg-yellow-100 text-yellow-700',
  test_in_progress: 'bg-yellow-100 text-yellow-700',
  test_passed: 'bg-green-100 text-green-700',
  test_failed: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
};

const MAIN_FLOW: ServiceStatus[] = [
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

export function getStatusSteps(currentStatus: ServiceStatus): StatusStep[] {
  const currentIndex = MAIN_FLOW.indexOf(currentStatus);
  const isFailed = currentStatus === 'inspection_failed' || currentStatus === 'test_failed';

  return MAIN_FLOW.map((status, index) => ({
    status,
    label: STATUS_LABELS[status],
    completed: index < currentIndex,
    active: status === currentStatus,
    failed: isFailed && index === currentIndex,
  }));
}

export function getNextStatus(currentStatus: ServiceStatus): ServiceStatus | null {
  const index = MAIN_FLOW.indexOf(currentStatus);
  if (index === -1 || index === MAIN_FLOW.length - 1) return null;
  return MAIN_FLOW[index + 1];
}

export function isServiceActive(status: ServiceStatus): boolean {
  return status !== 'completed' && status !== 'inspection_failed' && status !== 'test_failed';
}

export function isServiceFinished(status: ServiceStatus): boolean {
  return status === 'completed' || status === 'inspection_failed' || status === 'test_failed';
}

export function getProgressPercent(status: ServiceStatus): number {
  const index = MAIN_FLOW.indexOf(status);
  if (index === -1) return 0;
  return Math.round((index / (MAIN_FLOW.length - 1)) * 100);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('he-IL');
}

export function formatPrice(price: number): string {
  return `₪${price}`;
}
