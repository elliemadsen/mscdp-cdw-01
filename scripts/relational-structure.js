d3.json("data/d3_wikidata_influences.json").then((data) => {
  const width = 900;
  const height = 600;
  const margin = 40;

  const svg = d3
    .select(".chart-container")
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .style("display", "block")
    .style("margin", `${margin}px auto`);

  // arrow marker
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 22)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10,0 L 0,5")
    .attr("fill", "#aaa")
    .style("stroke", "none");

  const container = svg.append("g");

  svg.call(
    d3
      .zoom()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      })
  );

  // Standard force-directed simulation (disjoint clusters allowed)
  const simulation = d3
    .forceSimulation(data.nodes)
    .force(
      "link",
      d3
        .forceLink(data.links)
        .id((d) => d.id)
        .distance(100) // Distance between nodes
        .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-180)) // Repulsion between node groups
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = container
    .append("g")
    .attr("stroke", "#aaa")
    .attr("stroke-opacity", 0.7)
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("marker-end", "url(#arrowhead)");

  const node = container
    .append("g")
    .attr("stroke", "#fff")
    .selectAll("circle")
    .data(data.nodes)
    .join("circle")
    .attr("r", 8)
    .attr("fill", "#3f83f8")
    .call(drag(simulation));

  // Clickable labels to wikipedia
  const label = container
    .append("g")
    .selectAll("a")
    .data(data.nodes)
    .join("a")
    .attr("xlink:href", (d) => {
      const name = d.id;
      return `https://www.wikipedia.org/wiki/${name}`;
    })
    .attr("target", "_blank")
    .append("text")
    .text((d) => d.label || d.id)
    .attr("font-size", 12)
    .attr("dx", 12)
    .attr("dy", "0.35em")
    .attr("fill", "black")
    .style("text-decoration", "none")
    .style("cursor", "pointer");

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
});
