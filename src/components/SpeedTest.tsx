import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpeedGauge } from "./SpeedGauge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const SpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<'idle' | 'ping' | 'download' | 'upload'>('idle');
  const [results, setResults] = useState({
    download: 0,
    upload: 0,
    ping: 0,
    jitter: 0,
  });

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/speed-test`;

  // Ping test - multiple lightweight requests
  const testPing = async () => {
    setCurrentTest('ping');
    const pingResults: number[] = [];
    const numTests = 5;

    for (let i = 0; i < numTests; i++) {
      const startTime = performance.now();
      try {
        await fetch(`${FUNCTION_URL}/ping?_=${Date.now()}`, {
          method: 'GET',
          cache: 'no-store',
        });
        const endTime = performance.now();
        pingResults.push(endTime - startTime);
      } catch (error) {
        console.error('Ping test failed:', error);
      }
    }

    // Calculate average and jitter
    const avgPing = pingResults.reduce((a, b) => a + b, 0) / pingResults.length;
    const variance = pingResults.reduce((sum, val) => sum + Math.pow(val - avgPing, 2), 0) / pingResults.length;
    const jitter = Math.sqrt(variance);

    setResults(prev => ({ ...prev, ping: avgPing, jitter }));
  };

  // Download test - fetch test file and measure speed
  const testDownload = async () => {
    setCurrentTest('download');
    const fileSizeMB = 5; // 5MB test file
    const fileSizeBytes = fileSizeMB * 1024 * 1024;
    
    const startTime = performance.now();
    try {
      const response = await fetch(`${FUNCTION_URL}/download/${fileSizeMB}?_=${Date.now()}`, {
        cache: 'no-store',
      });
      
      // Read the entire response
      await response.arrayBuffer();
      const endTime = performance.now();
      
      // Calculate speed in Mbps
      const durationSeconds = (endTime - startTime) / 1000;
      const speedMbps = (fileSizeBytes * 8) / (durationSeconds * 1000000);
      
      setResults(prev => ({ ...prev, download: speedMbps }));
    } catch (error) {
      console.error('Download test failed:', error);
      toast.error('Download test failed');
    }
  };

  // Upload test - send data and measure speed
  const testUpload = async () => {
    setCurrentTest('upload');
    const uploadSizeMB = 3; // 3MB upload
    const uploadSizeBytes = uploadSizeMB * 1024 * 1024;
    
    // Generate random data
    const data = new Uint8Array(uploadSizeBytes);
    crypto.getRandomValues(data);
    
    const startTime = performance.now();
    try {
      await fetch(`${FUNCTION_URL}/upload`, {
        method: 'POST',
        body: data,
        cache: 'no-store',
      });
      const endTime = performance.now();
      
      // Calculate speed in Mbps
      const durationSeconds = (endTime - startTime) / 1000;
      const speedMbps = (uploadSizeBytes * 8) / (durationSeconds * 1000000);
      
      setResults(prev => ({ ...prev, upload: speedMbps }));
    } catch (error) {
      console.error('Upload test failed:', error);
      toast.error('Upload test failed');
    }
  };

  // Save results to database
  const saveResults = async () => {
    try {
      const { error } = await supabase.from('speed_tests').insert({
        download_speed: results.download,
        upload_speed: results.upload,
        ping: results.ping,
        jitter: results.jitter,
      });

      if (error) throw error;
      toast.success('Results saved!');
    } catch (error) {
      console.error('Failed to save results:', error);
      toast.error('Failed to save results');
    }
  };

  // Run complete speed test
  const runSpeedTest = async () => {
    setIsRunning(true);
    setResults({ download: 0, upload: 0, ping: 0, jitter: 0 });

    try {
      // Run tests sequentially
      await testPing();
      await testDownload();
      await testUpload();
      
      // Save results
      await saveResults();
      
      toast.success('Speed test complete!');
    } catch (error) {
      console.error('Speed test error:', error);
      toast.error('Speed test failed');
    } finally {
      setIsRunning(false);
      setCurrentTest('idle');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Speed Test
        </h1>
        <p className="text-xl text-muted-foreground">
          Test your internet connection speed
        </p>
      </div>

      {/* Speed Gauges */}
      <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-2 border-primary/20 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SpeedGauge
            value={results.download}
            maxValue={100}
            label="Download"
            unit="Mbps"
            isActive={currentTest === 'download'}
          />
          <SpeedGauge
            value={results.upload}
            maxValue={50}
            label="Upload"
            unit="Mbps"
            isActive={currentTest === 'upload'}
          />
          <SpeedGauge
            value={results.ping}
            maxValue={200}
            label="Ping"
            unit="ms"
            isActive={currentTest === 'ping'}
          />
        </div>

        {/* Jitter Display */}
        {results.jitter > 0 && (
          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">
              Jitter: <span className="font-semibold text-foreground">{results.jitter.toFixed(2)} ms</span>
            </span>
          </div>
        )}
      </Card>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button
          onClick={runSpeedTest}
          disabled={isRunning}
          size="lg"
          className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Testing...
            </>
          ) : (
            'Start Test'
          )}
        </Button>
      </div>

      {/* Status */}
      {isRunning && (
        <div className="text-center space-y-2">
          <div className="text-lg font-medium text-foreground">
            {currentTest === 'ping' && 'Testing latency...'}
            {currentTest === 'download' && 'Testing download speed...'}
            {currentTest === 'upload' && 'Testing upload speed...'}
          </div>
          <div className="h-1 max-w-xs mx-auto bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};