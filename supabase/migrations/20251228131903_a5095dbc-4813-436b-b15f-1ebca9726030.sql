-- Create storage bucket for case study images
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-study-images', 'case-study-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view case study images (public bucket)
CREATE POLICY "Anyone can view case study images"
ON storage.objects FOR SELECT
USING (bucket_id = 'case-study-images');

-- Allow authenticated admins to upload case study images
CREATE POLICY "Admins can upload case study images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'case-study-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admins to update case study images
CREATE POLICY "Admins can update case study images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'case-study-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admins to delete case study images
CREATE POLICY "Admins can delete case study images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'case-study-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);