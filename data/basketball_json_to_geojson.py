import json

# Load the input JSON
with open("DPR_Basketball_001.json", "r") as f:
    data = json.load(f)

# Build GeoJSON structure
features = []
for item in data:
    try:
        lat = float(item["lat"])
        lon = float(item["lon"])
    except (KeyError, ValueError, TypeError):
        continue  # skip if lat/lon missing or invalid

    feature = {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [lon, lat]},
        "properties": {k: v for k, v in item.items() if k not in ("lat", "lon")},
    }
    features.append(feature)

geojson = {"type": "FeatureCollection", "features": features}

# Save to GeoJSON file
with open("DPR_Basketball_001.geojson", "w") as f:
    json.dump(geojson, f, indent=2)

print(f"Converted {len(features)} features to GeoJSON.")
