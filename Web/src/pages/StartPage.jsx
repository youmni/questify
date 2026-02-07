import React from 'react';
import QuestifyIcon from '../components/startPage/QuestifyIcon';
import TextHeader from '../components/startPage/TextHeader';
import HowItWorks from '../components/startPage/HowItWorks';
import StartQuestButton from '../components/startPage/StartQuestButton';

const QuestPage = () => {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-6">
      
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
          <StartQuestButton onClick={() => console.log("Quest Started!")} />
        </div>
        
      </div>
    </div>
  );
};

export default QuestPage;