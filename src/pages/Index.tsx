import { SpeedTest } from "@/components/SpeedTest";
import { TestHistory } from "@/components/TestHistory";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 py-12">
      <div className="container mx-auto space-y-12">
        <SpeedTest />
        <TestHistory />
      </div>
    </div>
  );
};

export default Index;