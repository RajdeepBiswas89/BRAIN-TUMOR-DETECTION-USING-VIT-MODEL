import requests
from pathlib import Path

def test_download():
    # Test the direct download URL
    url = "https://drive.google.com/uc?export=download&id=1x4Hwnt_5kboQ6_z2ozbiM_9sjXYz-L1A"
    
    print(f"Testing download from: {url}")
    
    # Try with session and cookies
    session = requests.Session()
    response = session.get(url, allow_redirects=True)
    
    print(f"Status Code: {response.status_code}")
    print(f"Content-Type: {response.headers.get('content-type', 'unknown')}")
    print(f"Content-Length: {response.headers.get('content-length', 'unknown')}")
    print(f"Final URL: {response.url}")
    print(f"Response length: {len(response.content)} bytes")
    
    # Print first 500 chars of response to see if it's HTML
    content_preview = response.text[:500]
    print(f"Response preview: {repr(content_preview)}")
    
    # Save the response to see what we got
    with open("debug_response.html", "w", encoding="utf-8") as f:
        f.write(response.text)
    print("Debug response saved to debug_response.html")

if __name__ == "__main__":
    test_download()