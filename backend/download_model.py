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
    """Download file from URL with Google Drive large file handling."""
    print(f"Downloading model to {destination}...")
    
    # Create directory if it doesn't exist
    destination.parent.mkdir(parents=True, exist_ok=True)
    
    # For Google Drive large files, we need to handle the virus scan warning
    session = requests.Session()
    response = session.get(url, allow_redirects=True)
    
    # Check if we got the virus scan warning page
    content_type = response.headers.get('content-type', '').lower()
    if 'text/html' in content_type and 'Virus scan warning' in response.text:
        print("Detected virus scan warning page, extracting download parameters...")
        
        import re
        # Extract the parameters from the form
        id_match = re.search(r'<input type="hidden" name="id" value="([^"]+)"', response.text)
        confirm_match = re.search(r'<input type="hidden" name="confirm" value="([^"]+)"', response.text)
        uuid_match = re.search(r'<input type="hidden" name="uuid" value="([^"]+)"', response.text)
        
        if id_match and confirm_match:
            file_id = id_match.group(1)
            confirm_val = confirm_match.group(1)
            uuid_val = uuid_match.group(1) if uuid_match else None
            
            # Build the direct download URL with the extracted parameters
            direct_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm={confirm_val}"
            if uuid_val:
                direct_url += f"&uuid={uuid_val}"
            
            print(f"Using extracted parameters for download: {direct_url[:100]}...")
            response = session.get(direct_url, stream=True)
        else:
            print("Could not extract download parameters from warning page")
            return
    
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
    
    # Verify it's actually a PyTorch model file
    try:
        import torch
        model_data = torch.load(destination, map_location='cpu', weights_only=False)
        print("✅ Valid PyTorch model file detected")
    except Exception as e:
        print(f"⚠️ Warning: File might not be a valid PyTorch model: {e}")

if __name__ == "__main__":
    print("🚀 Starting model download from Google Drive...")
    download_file(MODEL_URL, MODEL_PATH)
