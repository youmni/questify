import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestNav from '../components/QuestNav';

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
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <QuestNav museumId={museumId} routeId={routeId} />

        <div className="bg-white border border-[#2c3e54]/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(44,62,84,0.05)]">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2c3e54] flex items-center justify-center mb-4 shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f4f1e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2c3e54]">Questify</h1>
          <p className="mt-2 text-[#2c3e54]/60 text-sm font-medium tracking-widest uppercase">Museum Speurtocht</p>
        </div>

        <p className="text-center text-[#2c3e54]/70 text-sm leading-relaxed mb-7">
          Ontdek de meesterwerken door hints te volgen en schilderijen te scannen.
        </p>

        <div className="w-full rounded-2xl border border-[#2c3e54]/10 bg-[#f4f1e9]/60 p-5 mb-6">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-[#2c3e54]/70 mb-4">Hoe werkt het?</h2>
          <ul className="space-y-4">
            {steps.map((step) => (
              <li key={step.num} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#2c3e54] text-[#f4f1e9] font-bold text-xs shrink-0 mt-0.5">
                  {step.num}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2c3e54]">{step.title}</p>
                  <p className="text-xs text-[#2c3e54]/65 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-[#2c3e54] hover:bg-[#233247] text-[#f4f1e9] font-bold text-base py-4 px-8 rounded-xl transition-all"
        >
          Start de Speurtocht
        </button>
        <p className="mt-3 text-xs text-center text-[#2c3e54]/60">Volg de aanwijzingen en ontdek de kunst</p>
        </div>
      </div>
    </div>
  );
};

export default QuestPage;
