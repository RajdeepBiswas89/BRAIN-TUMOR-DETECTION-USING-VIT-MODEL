#!/usr/bin/env python3
"""
Script to download the trained ViT model from Google Drive or similar storage.
Run this once on Render after deployment.
"""
import os
import requests
from pathlib import Path

# Model file details
MODEL_URL = "https://drive.google.com/uc?export=download&id=1x4Hwnt_5kboQ6_z2ozbiM_9sjXYz-L1A"  # Google Drive direct download
MODEL_PATH = Path(__file__).parent / "models" / "brain_tumor_vit_model.pth"

def download_file(url: str, destination: Path):
    """Download file from URL with progress."""
    print(f"Downloading model to {destination}...")
    
    # Create directory if it doesn't exist
    destination.parent.mkdir(parents=True, exist_ok=True)
    
    # For Google Drive, we need to handle large file confirmation
    session = requests.Session()
    response = session.get(url, stream=True)
    
    # Check for Google Drive virus scan warning
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            url = url + '&confirm=' + value
            response = session.get(url, stream=True)
            break
    
    response.raise_for_status()
    
    total_size = int(response.headers.get('content-length', 0))
    downloaded = 0
    
    with open(destination, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
                downloaded += len(chunk)
                if total_size > 0:
                    percent = (downloaded / total_size) * 100
                    print(f"Progress: {percent:.1f}%", end='\r')
    
    print(f"\n✅ Model downloaded successfully! Size: {destination.stat().st_size / (1024*1024):.2f}MB")

if __name__ == "__main__":
    print("🚀 Starting model download from Google Drive...")
    download_file(MODEL_URL, MODEL_PATH)
