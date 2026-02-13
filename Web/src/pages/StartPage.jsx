import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestifyIcon from '../components/startPage/QuestifyIcon';
import TextHeader from '../components/startPage/TextHeader';
import HowItWorks from '../components/startPage/HowItWorks';
import StartQuestButton from '../components/startPage/StartQuestButton';

const QuestPage = () => {
  const navigate = useNavigate();
  const { museumId, routeId } = useParams();

  const handleStart = () => {
    navigate(`/quest/museums/${museumId}/routes/${routeId}/stops/1`);
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <QuestifyIcon size={40} />
        <TextHeader
          title="Museum Speurtocht"
          subtext="Welkom bij de interactieve kunst speurtocht! Ontdek de meesterwerken door hints te volgen en schilderijen te scannen."
        />
        <div className="w-full mt-6">
          <HowItWorks />
        </div>
        <div className="w-full mt-8 flex justify-center">
          <StartQuestButton onClick={handleStart} />
        </div>
      </div>
    </div>
  );
};

export default QuestPage;