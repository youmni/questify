import React from "react";

const HowItWorks = () => {
  const steps = [
    "Lees de hint om het volgende schilderij te vinden",
    "Loop door het museum en zoek het kunstwerk",
    "Scan het schilderij om te bevestigen",
    "Leer meer over het kunstwerk en ga verder!",
  ];

  return (
    <div className="bg-white border border-slate-500 rounded-xl p-4 max-w-md shadow-sm">
      <h2 className="text-center font-serif text-base font-bold text-cyan-950 mb-4">
        Hoe werkt het?
      </h2>

      <ul className="space-y-3">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-cyan-950 font-bold text-sm shrink-0 mt-0.5">
              {index + 1}
            </div>

            <span className="font-sans text-sm text-slate-500 leading-tight">
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HowItWorks;