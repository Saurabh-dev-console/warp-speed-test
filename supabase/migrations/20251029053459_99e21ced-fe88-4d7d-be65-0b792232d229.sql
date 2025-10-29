-- Add DELETE policy for speed_tests table to allow anyone to delete records
CREATE POLICY "Anyone can delete speed tests" 
ON public.speed_tests 
FOR DELETE 
USING (true);