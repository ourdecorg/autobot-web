import { Customer, Inspector, Booking } from '@/types';

export const MOCK_CUSTOMER: Customer = {
  id: 'c001',
  firstName: 'ישראל',
  lastName: 'ישראלי',
  phone: '050-1234567',
  email: 'israel@example.com',
  idNumber: '123456789',
};

export const MOCK_INSPECTORS: Inspector[] = [
  {
    id: 'i001',
    name: 'אלי כהן',
    phone: '052-9876543',
    email: 'eli@autobot.co.il',
    isActive: true,
    assignedBookingIds: [],
  },
  {
    id: 'i002',
    name: 'מיכל לוי',
    phone: '054-1122334',
    email: 'michal@autobot.co.il',
    isActive: true,
    assignedBookingIds: [],
  },
  {
    id: 'i003',
    name: 'דוד ברקוביץ',
    phone: '058-9988776',
    email: 'david@autobot.co.il',
    isActive: false,
    assignedBookingIds: [],
  },
];

export const SEED_PAST_BOOKINGS: Booking[] = [
  {
    id: 'B1001',
    customerId: 'c001',
    vehicle: { make: 'טויוטה', model: 'קורולה', year: 2019, licensePlate: '123-45-678', color: 'לבן' },
    address: { street: 'דיזנגוף', houseNumber: '50', city: 'תל אביב' },
    scheduledDate: '2026-01-15',
    scheduledTime: '10:00-12:00',
    status: 'completed',
    createdAt: new Date('2026-01-15T09:00:00'),
    price: 299,
    inspectorName: 'אלי כהן',
    inspectorPhone: '052-9876543',
    instituteAddress: 'מכון רישוי תל אביב, רח\' הרצל 10',
  },
  {
    id: 'B1002',
    customerId: 'c001',
    vehicle: { make: 'הונדה', model: 'סיוויק', year: 2021, licensePlate: '987-65-432', color: 'אפור' },
    address: { street: 'ביאליק', houseNumber: '12', city: 'רמת גן', apartment: '4' },
    scheduledDate: '2026-02-01',
    scheduledTime: '08:00-10:00',
    status: 'completed',
    createdAt: new Date('2026-02-01T08:00:00'),
    price: 299,
    inspectorName: 'מיכל לוי',
    inspectorPhone: '054-1122334',
    instituteAddress: 'מכון רישוי תל אביב, רח\' הרצל 10',
  },
  {
    id: 'B1003',
    customerId: 'c001',
    vehicle: { make: 'ניסאן', model: 'קשקאי', year: 2018, licensePlate: '111-22-333', color: 'כחול' },
    address: { street: 'הרצל', houseNumber: '78', city: 'פתח תקווה' },
    scheduledDate: '2026-02-10',
    scheduledTime: '14:00-16:00',
    status: 'test_failed',
    createdAt: new Date('2026-02-10T14:00:00'),
    price: 299,
    inspectorName: 'דוד ברקוביץ',
    inspectorPhone: '058-9988776',
    instituteAddress: 'מכון רישוי תל אביב, רח\' הרצל 10',
  },
];

export const TEL_AVIV_CENTER = { latitude: 32.0853, longitude: 34.7818 };
export const INSTITUTE_LOCATION = { latitude: 32.0500, longitude: 34.7600 };

export const MOCK_INSPECTOR_ROUTES = [
  { latitude: 32.0900, longitude: 34.7850 },
  { latitude: 32.0880, longitude: 34.7840 },
  { latitude: 32.0870, longitude: 34.7830 },
  { latitude: 32.0860, longitude: 34.7820 },
  { latitude: 32.0853, longitude: 34.7818 },
];

export const MOCK_TRANSPORT_ROUTES = [
  { latitude: 32.0853, longitude: 34.7818 },
  { latitude: 32.0800, longitude: 34.7780 },
  { latitude: 32.0750, longitude: 34.7740 },
  { latitude: 32.0700, longitude: 34.7700 },
  { latitude: 32.0650, longitude: 34.7660 },
  { latitude: 32.0500, longitude: 34.7600 },
];

export const VEHICLE_MAKES = [
  'טויוטה', 'הונדה', 'יונדאי', 'קיה', 'מזדה', 'ניסאן', 'פולקסווגן',
  'סקודה', 'פורד', 'שברולט', 'סובארו', 'מיצובישי', 'פיג\'ו',
  'רנו', 'סיטרואן', 'אופל', 'בי.מ.וו', 'מרצדס', 'אאודי', 'סוזוקי',
];

export const VEHICLE_COLORS = [
  'לבן', 'שחור', 'כסוף', 'אפור', 'כחול', 'אדום', 'ירוק', 'חום', 'זהב', 'כתום',
];

export const CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד',
  'נתניה', 'באר שבע', 'בני ברק', 'רמת גן', 'גבעתיים', 'חולון',
  'בת ים', 'הרצליה', 'כפר סבא', 'רעננה', 'מודיעין', 'לוד', 'רמלה', 'הוד השרון',
];
