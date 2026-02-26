import { cn } from '@/utils/cn';

interface Props {
  selectedDate: string;
  setDate: (d: string) => void;
  selectedTime: string;
  setTime: (t: string) => void;
  notes: string;
  setNotes: (n: string) => void;
  errors: Record<string, string>;
}

const TIME_SLOTS = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];

function getAvailableDates(): { value: string; display: string; day: string }[] {
  const dates = [];
  const today = new Date();
  let d = new Date(today);
  d.setDate(d.getDate() + 1);
  while (dates.length < 10) {
    if (d.getDay() !== 6) { // skip Saturday
      const value = d.toISOString().split('T')[0];
      const display = d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
      const day = d.toLocaleDateString('he-IL', { weekday: 'short' });
      dates.push({ value, display, day });
    }
    d = new Date(d);
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export default function Step3DateTime({ selectedDate, setDate, selectedTime, setTime, notes, setNotes, errors }: Props) {
  const dates = getAvailableDates();

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תאריך *</label>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" dir="ltr">
          {dates.map(({ value, display, day }) => (
            <button
              key={value}
              onClick={() => setDate(value)}
              className={cn(
                'flex-shrink-0 w-14 py-2.5 rounded-xl border-2 flex flex-col items-center text-xs',
                selectedDate === value
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-primary/40'
              )}
            >
              <span className="font-bold text-sm">{display}</span>
              <span className="opacity-70 text-xs">{day}</span>
            </button>
          ))}
        </div>
        {errors.date && <p className="text-error text-xs mt-1">{errors.date}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">שעה *</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => setTime(slot)}
              className={cn(
                'py-3 rounded-xl border-2 text-sm font-medium',
                selectedTime === slot
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-primary/40'
              )}
            >
              {slot}
            </button>
          ))}
        </div>
        {errors.time && <p className="text-error text-xs mt-1">{errors.time}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">הערות (אופציונלי)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="הערות נוספות לבוחן..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl py-3 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>
    </div>
  );
}
