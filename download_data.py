import requests

files = {
    "cleaned_traffic_data.csv": "YOUR_CSV_DOWNLOAD_LINK",
    "traffic_model.joblib": "YOUR_MODEL_DOWNLOAD_LINK"
}

for filename, url in files.items():
    print(f"Downloading {filename}...")
    response = requests.get(url)
    with open(filename, "wb") as f:
        f.write(response.content)
    print(f"Downloaded {filename}")