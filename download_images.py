import requests
import os
import urllib.parse

crop_mapping = {
    'Soybean': 'Soybean',
    'Maize': 'Maize',
    'Chickpea': 'Chickpea',
    'Pigeon Pea': 'Pigeon pea',
    'Groundnut': 'Peanut',
    'Cotton': 'Cotton',
    'Sorghum (Jowar)': 'Sorghum',
    'Pearl Millet (Bajra)': 'Pearl millet',
    'Moong': 'Mung bean',
    'Urad': 'Vigna mungo',
    'Wheat': 'Wheat',
    'Barley': 'Barley',
    'Mustard': 'Mustard plant',
    'Lentil (Masoor)': 'Lentil',
    'Sunflower': 'Sunflower',
    'Tomato': 'Tomato',
    'Potato': 'Potato',
    'Onion': 'Onion',
    'Garlic': 'Garlic',
    'Green Peas': 'Pea'
}

os.makedirs('images', exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

for file_name, search_term in crop_mapping.items():
    try:
        # Using Pollinations AI for robust high-quality agriculture imagery
        prompt = urllib.parse.quote(f"high quality photo of {search_term} crop agriculture farm field")
        img_url = f"https://image.pollinations.ai/prompt/{prompt}?width=800&height=600&nologo=true&seed={len(file_name)}"
        
        print(f"Fetching {file_name} from Pollinations AI...")
        response = requests.get(img_url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            with open(f"images/{file_name}.jpg", 'wb') as f:
                f.write(response.content)
            print(f"Successfully downloaded {file_name}")
        else:
            print(f"Error {file_name}: Status code {response.status_code}")
            raise Exception("Status code not 200")
            
    except Exception as e:
        print(f"Fallback for {file_name}: {e}")
        # Final fallback to a stable Unsplash image via requests
        try:
            fallback_res = requests.get("https://images.unsplash.com/photo-1500382017468-9049fed747ef", headers=headers, timeout=10)
            with open(f"images/{file_name}.jpg", 'wb') as f:
                f.write(fallback_res.content)
            print(f"Fallback downloaded for {file_name}")
        except:
            print(f"CRITICAL ERROR for {file_name}: Fallback failed")
