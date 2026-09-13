import os
import zipfile

dist_dir = '/Users/user/chicken-eye/dist'
os.makedirs(dist_dir, exist_ok=True)
zip_path = os.path.join(dist_dir, 'chicken-eye-v1.0.0.zip')

# Files and directories required in the production extension package
include_files = [
    'manifest.json',
    'content.js',
    'content.css',
    'popup.html',
    'popup.css',
    'popup.js',
    'icons/icon16.png',
    'icons/icon48.png',
    'icons/icon128.png',
]

base_dir = '/Users/user/chicken-eye'

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for rel_path in include_files:
        full_path = os.path.join(base_dir, rel_path)
        if os.path.exists(full_path):
            zipf.write(full_path, rel_path)
            print(f'Added: {rel_path}')
        else:
            print(f'Warning: {rel_path} not found!')

size_kb = os.path.getsize(zip_path) / 1024
print(f'\nPackage created successfully at: {zip_path} ({size_kb:.2f} KB)')
