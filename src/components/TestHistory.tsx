import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Activity } from "lucide-react";

interface SpeedTestRecord {
  id: string;
  download_speed: number;
  upload_speed: number;
  ping: number;
  jitter: number;
  test_date: string;
}

export const TestHistory = () => {
  const [history, setHistory] = useState<SpeedTestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('speed_tests')
        .select('*')
        .order('test_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Activity className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No test history yet. Run your first speed test!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Recent Tests</h2>
      <div className="grid gap-4">
        {history.map((test) => (
          <Card key={test.id} className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                {format(new Date(test.test_date), 'MMM dd, yyyy HH:mm')}
              </div>
              <div className="flex gap-6 flex-wrap">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Download</div>
                  <div className="text-lg font-semibold text-primary">
                    {test.download_speed?.toFixed(1) || '0.0'} Mbps
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Upload</div>
                  <div className="text-lg font-semibold text-accent">
                    {test.upload_speed?.toFixed(1) || '0.0'} Mbps
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Ping</div>
                  <div className="text-lg font-semibold text-foreground">
                    {test.ping?.toFixed(1) || '0.0'} ms
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};