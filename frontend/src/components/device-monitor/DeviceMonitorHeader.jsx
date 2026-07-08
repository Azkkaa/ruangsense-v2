import { CaretLeftIcon } from '@phosphor-icons/react';

const DeviceMonitorHeader = ({ onBack }) => {
  return (
    <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-400 mx-auto px-4 sm:px-6 h-20 flex items-center">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
          >
            <CaretLeftIcon size={20} weight="bold" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300">
              Main Laboratory
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DeviceMonitorHeader;