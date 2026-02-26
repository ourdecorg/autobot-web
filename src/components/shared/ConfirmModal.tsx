'use client';
interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmModal({ open, title, message, confirmLabel = 'אישור', cancelLabel = 'ביטול', onConfirm, onCancel, danger }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-white font-medium ${danger ? 'bg-error hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
