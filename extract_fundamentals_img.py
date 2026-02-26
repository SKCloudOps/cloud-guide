"""Extract embedded images from cloud_interview_guide_v7_full_embedded.html for Fundamentals (Page 11)."""
import re
import base64
import os

html_path = "cloud_interview_guide_v7_full_embedded.html"
out_dir = "assets"
os.makedirs(out_dir, exist_ok=True)

with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Find img with data URL (single line with very long base64)
pattern = re.compile(
    r'<img[^>]+src="(data:image/(jpeg|png|gif);base64,[^"]+)"[^>]*>',
    re.IGNORECASE
)

page11_start = content.find("<h2>Page 11</h2>")
if page11_start == -1:
    print("Page 11 not found")
    exit(1)
page12_start = content.find("<h2>Page 12</h2>", page11_start)
section_11 = content[page11_start:page12_start]

matches = list(pattern.finditer(section_11))
if not matches:
    print("No image in Page 11 section")
    exit(1)

m = matches[0]
data_url = m.group(1)
img_type = m.group(2).lower()
b64 = data_url.split(",", 1)[1]
data = base64.b64decode(b64)
ext = "png" if img_type == "png" else "jpg"
path_out = os.path.join(out_dir, "fundamentals-ip-vs-url." + ext)
with open(path_out, "wb") as out:
    out.write(data)
print("Saved:", path_out)
