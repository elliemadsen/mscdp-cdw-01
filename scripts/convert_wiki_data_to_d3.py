import json

# Load the input JSON
with open("data/wikidata_influences.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Collect all unique node labels
node_labels = set()
links = []

for item in data:
    # reverse so arrow points in direction of influence, not influenced by
    source = item["targetLabel"]
    target = item["sourceLabel"]

    node_labels.add(source)
    node_labels.add(target)

    links.append({"source": source, "target": target, "type": "influenced"})

# Create nodes list from unique labels
nodes = [{"id": label} for label in sorted(node_labels)]

# Final D3 structure
d3_graph = {"nodes": nodes, "links": links}

# Write to new JSON file
with open("data/d3_wikidata_influences.json", "w", encoding="utf-8") as f:
    json.dump(d3_graph, f, ensure_ascii=False, indent=2)

print("✅ Converted and saved to data/d3_wikidata_influences.json")
