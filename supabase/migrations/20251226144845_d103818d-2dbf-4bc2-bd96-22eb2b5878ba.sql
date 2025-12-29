-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

-- Allow anyone to view profile images (public bucket)
CREATE POLICY "Anyone can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Allow admins to upload profile images
CREATE POLICY "Admins can upload profile images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to update profile images
CREATE POLICY "Admins can update profile images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to delete profile images
CREATE POLICY "Admins can delete profile images"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-images' AND has_role(auth.uid(), 'admin'));