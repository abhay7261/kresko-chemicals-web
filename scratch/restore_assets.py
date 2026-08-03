import shutil
import os

src_images = r'C:\Users\Asus\.gemini\antigravity-ide\brain\49e19a08-ccfe-4771-8040-2bfcad516b45\scratch\images_backup'
dst_images = r'public/images'

# Create parent directories if they don't exist
os.makedirs(os.path.dirname(dst_images), exist_ok=True)

if os.path.exists(dst_images):
    shutil.rmtree(dst_images)

shutil.copytree(src_images, dst_images)
print(f"Restored backup images to {dst_images} successfully!")
