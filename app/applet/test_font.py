import urllib.request
import re

url = "https://www.habitsforabetterworld.org/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
    
    font_urls = re.findall(r"https?://(?:fonts\.googleapis\.com|use\.typekit\.net)[^\"\'\s\)<>]+", html)
    print("External font URLs:", set(font_urls))

    css_links = re.findall(r'href=["\'](https://static1\.squarespace\.com/static/sitecss/[^"\']+)["\']', html)
    print("Site CSS links:", len(css_links))

    # Look for font-family in the page
    ff = re.findall(r'font-family:\s*([^;}{"\n]+)', html, re.IGNORECASE)
    print("Inline font-families:", set(ff))

    # If site css exists, fetch the first one and inspect font-family
    if css_links:
        req_css = urllib.request.Request(css_links[0], headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req_css) as c_resp:
            css_text = c_resp.read().decode("utf-8", errors="ignore")
        
        css_ff = re.findall(r'font-family:\s*([^;}{"\n]+)', css_text, re.IGNORECASE)
        # Clean up font names
        cleaned = set()
        for f in css_ff:
            cleaned.add(f.strip().strip("'\""))
        print("CSS font-families:", cleaned)

        # Check font face or imported fonts
        font_faces = re.findall(r'@font-face\s*\{[^}]+\}', css_text)
        print("Found @font-face count:", len(font_faces))
        for face in font_faces[:5]:
            print("Face:", face)

except Exception as e:
    print("Error:", e)
