import { useState } from "react";
import { SpeedTest } from "@/components/SpeedTest";
import { TestHistory } from "@/components/TestHistory";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTestComplete = () => {
    // Trigger history refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 py-12">
      <div className="container mx-auto space-y-12">
        <SpeedTest onTestComplete={handleTestComplete} />
        <TestHistory refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default Index;