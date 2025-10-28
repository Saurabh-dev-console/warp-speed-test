-- Create speed test results table
CREATE TABLE public.speed_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  download_speed DECIMAL(10, 2),
  upload_speed DECIMAL(10, 2),
  ping DECIMAL(10, 2),
  jitter DECIMAL(10, 2),
  test_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.speed_tests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public speed test)
CREATE POLICY "Anyone can insert speed tests" 
ON public.speed_tests 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view speed tests
CREATE POLICY "Anyone can view speed tests" 
ON public.speed_tests 
FOR SELECT 
USING (true);

-- Create index on test_date for faster queries
CREATE INDEX idx_speed_tests_test_date ON public.speed_tests(test_date DESC);