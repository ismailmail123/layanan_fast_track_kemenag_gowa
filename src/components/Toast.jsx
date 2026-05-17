import { CheckCircle, XCircle, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-toast">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-sm ${
          isSuccess ? 'bg-emerald-700' : 'bg-red-600'
        }`}
      >
        {isSuccess ? (
          <CheckCircle size={20} className="text-white flex-shrink-0" />
        ) : (
          <XCircle size={20} className="text-white flex-shrink-0" />
        )}
        <p className="text-white text-sm font-semibold">{toast.message}</p>
      </div>
    </div>
  );
}
