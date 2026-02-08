import React from "react";

const StartQuestButton = ({ onClick }) => {
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
      <button
        onClick={onClick}
        className="w-full bg-cyan-950 text-white font-sans font-bold py-3 px-6 rounded-lg shadow-md active:scale-95 transition-transform"
      >
        Start de Speurtocht
      </button>

      <span className="text-slate-500 text-sm font-sans">
        5 schilderijen te ontdekken
      </span>
    </div>
  );
};

export default StartQuestButton;