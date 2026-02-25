import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const QuestPage = () => {
  const navigate = useNavigate();
  const { museumId, routeId } = useParams();

  const handleStart = () => {
    navigate(`/quest/museums/${museumId}/routes/${routeId}/stops/1`);
  };

  const steps = [
    { num: 1, title: "Lees de hint", desc: "Elke stop geeft je een aanwijzing naar het volgende schilderij." },
    { num: 2, title: "Zoek het kunstwerk", desc: "Loop door de zalen en speur het werk op." },
    { num: 3, title: "Scan het schilderij", desc: "Maak een foto om het kunstwerk te identificeren." },
    { num: 4, title: "Ontdek het verhaal", desc: "Lees het verhaal achter het werk en ga verder." },
  ];

  return (
    <div className="min-h-screen bg-[#1c2e45] text-[#f4f0e8] flex flex-col">
      {/* Decorative top bar */}
      <div className="h-1 bg-gradient-to-r from-[#c4952c] via-[#e8b84b] to-[#c4952c]" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo + wordmark */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#c4952c] flex items-center justify-center mb-4 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1c2e45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-[#f4f0e8]">
            Questify
          </h1>
          <p className="mt-2 text-[#c4952c] text-sm font-medium tracking-widest uppercase">
            Museum Speurtocht
          </p>
        </div>

        {/* Tagline */}
        <p className="text-center text-[#b8b0a0] text-base max-w-xs leading-relaxed mb-10">
          Ontdek de meesterwerken door hints te volgen en schilderijen te scannen.
        </p>

        {/* Steps card */}
        <div className="w-full max-w-sm bg-[#243a54] rounded-2xl border border-[#2c4a6a] shadow-xl p-6 mb-8">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-[#c4952c] mb-5">
            Hoe werkt het?
          </h2>
          <ul className="space-y-4">
            {steps.map((step) => (
              <li key={step.num} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#c4952c] text-[#1c2e45] font-bold text-xs shrink-0 mt-0.5">
                  {step.num}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f4f0e8]">{step.title}</p>
                  <p className="text-xs text-[#8a8070] leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full max-w-sm bg-[#c4952c] hover:bg-[#d4a53c] text-[#1c2e45] font-bold text-base py-4 px-8 rounded-xl shadow-lg transition-all active:scale-95"
        >
          Start de Speurtocht
        </button>
        <p className="mt-3 text-xs text-[#6a6050]">Volg de aanwijzingen en ontdek de kunst</p>
      </div>

      <div className="h-1 bg-gradient-to-r from-[#c4952c] via-[#e8b84b] to-[#c4952c]" />
    </div>
  );
};

export default QuestPage;
