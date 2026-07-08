const TimeFilterTabs = ({ options, activeFilter, onChange }) => {
  return (
    <div className="flex w-full sm:w-auto bg-white/5 border border-white/5 p-1 rounded justify-between sm:justify-start">
      {options.map((option) => (
        <button
          key={option.label}
          onClick={() => onChange(option)}
          className={`flex-1 sm:flex-none px-3 py-1.5 text-[11px] font-medium rounded-md transition-all text-center ${
            activeFilter.label === option.label
              ? 'bg-[#7b1779] text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFilterTabs;