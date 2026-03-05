import { formatDate } from '@/utils/date'
import type { AxleData } from '@/types'

interface PrintPreviewProps {
  data: {
    licensePlate: string;
    date: string;
    time: string;
    axles: AxleData[];
    grossWeight: number;
  };
  onClose: () => void;
  onPrint: () => void;
}

export const PrintPreview = ({ data, onClose, onPrint }: PrintPreviewProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl max-w-[340px] w-full overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white px-6">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Bản xem in</h2>
            <span className="text-[10px] text-slate-300 font-bold">Thanh nhiệt 58mm</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 bg-slate-50 flex justify-center">
          {/* Mô phỏng giấy in nhiệt thực tế 58mm */}
          <div className="bg-white shadow-[0_0_20px_rgba(0,0,0,0.05)] px-3 py-6 w-[54mm] min-h-[140mm] text-black font-mono text-[9px] leading-[1.3] select-none border border-slate-100 relative">
            {/* Răng cưa giả */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(circle,transparent_2px,white_2px)] bg-[length:6px_6px] bg-repeat-x -mt-0.5"></div>

            <div className="flex justify-between font-bold mb-1 uppercase tracking-tighter text-[10px]">
              <span>WEIGHING</span>
              <span>REPORT</span>
            </div>
            <div className="border-t border-dashed border-black w-full mb-3"></div>

            <div className="space-y-0.5 mb-6">
              <div className="flex justify-between">
                <span>NO. :</span>
                <span className="font-bold">0011</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDate(data.date)}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{data.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle:</span>
                <span className="font-bold">{data.licensePlate || '0000'}</span>
              </div>
              <div className="flex justify-between">
                <span>Operator:</span>
                <span>00</span>
              </div>
            </div>

            <div className="space-y-6">
              {data.axles.map((axle, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between">
                    <span>LW:</span>
                    <span>{axle.left || '0'}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RW:</span>
                    <span>{axle.right || '0'}kg</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Axle{String(idx + 1).padStart(2, '0')}:</span>
                    <span>{(parseFloat(axle.left) || 0) + (parseFloat(axle.right) || 0)}kg</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="border-t border-dashed border-black w-full mb-1"></div>
              <div className="flex justify-between font-bold uppercase py-1 text-[10px]">
                <span>Gross:</span>
                <span>{data.grossWeight.toLocaleString()}kg</span>
              </div>
              <div className="border-t border-dashed border-black w-full"></div>
            </div>

            <div className="h-16"></div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-3 bg-white border-t border-slate-50">
          <button
            onClick={onPrint}
            className="w-full h-12 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase tracking-widest"
          >
            In Phiếu Thật
          </button>
          <button
            onClick={onClose}
            className="w-full h-10 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
          >
            Quay lại sửa tiếp
          </button>
        </div>
      </div>
    </div>
  );
};
