#!/usr/bin/env python3
"""
Script to download the trained ViT model from Google Drive or similar storage.
Run this once on Render after deployment.
"""
import os
import requests
from pathlib import Path

# Model file details
MODEL_URL = "YOUR_GOOGLE_DRIVE_LINK_HERE"  # You'll add this
MODEL_PATH = Path(__file__).parent / "models" / "brain_tumor_vit_model.pth"

def download_file(url: str, destination: Path):
    """Download file from URL with progress."""
    print(f"Downloading model to {destination}...")
    
    # Create directory if it doesn't exist
    destination.parent.mkdir(parents=True, exist_ok=True)
    
    # Download with streaming for large files
    response = requests.get(url, stream=True)
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
    if MODEL_URL == "YOUR_GOOGLE_DRIVE_LINK_HERE":
        print("⚠️ Please update MODEL_URL in this script first!")
        print("Upload your model to Google Drive and get the direct download link.")
    else:
        download_file(MODEL_URL, MODEL_PATH)
