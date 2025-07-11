let stationNameMap = {};

d3.csv("data/station-names.csv").then(function (stationData) {
  stationData.forEach((d) => {
    stationNameMap[d["Two-Letter Station Code"]] = d["Station Name"];
  });
});

d3.csv("data/BART_Daily_Station_Exits.csv")
  .then((rawData) => {
    const parseDate = d3.timeParse("%Y/%m/%d");
    const data = rawData.filter((d) => d.Date && parseDate(d.Date));
    data.forEach((d) => {
      d.Date = parseDate(d.Date);
    });

    const reserved = new Set([
      "Qtr",
      "Month",
      "Day of the Week",
      "Date",
      "Total",
      "data_as_of",
      "data_loaded_at",
    ]);
    const candidateKeys = Object.keys(data[0]).filter((k) => !reserved.has(k));
    const stationKeys = candidateKeys.filter((k) =>
      data.some((d) => !isNaN(+d[k]))
    );
    data.forEach((d) => {
      stationKeys.forEach((k) => {
        d[k] = +d[k] || 0;
      });
    });

    const stack = d3.stack().keys(stationKeys).offset(d3.stackOffsetNone);
    const layers = stack(data);

    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const width = 960;
    const height = 500;

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(layers, (layer) => d3.min(layer, (d) => d[0])),
        d3.max(layers, (layer) => d3.max(layer, (d) => d[1])),
      ])
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(stationKeys)
      .range(d3.schemeCategory10.concat(d3.schemePaired));

    const area = d3
      .area()
      .x((d, i) => x(data[i].Date))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    const svg = d3.select("#streamgraph");

    svg
      .selectAll("path")
      .data(layers)
      .join("path")
      .attr("d", area)
      .attr("fill", (d, i) => color(stationKeys[i]))
      .attr("stroke", "none");

    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .style("color", "black")
      .call(d3.axisBottom(x));

    // Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .style("color", "black")

      .call(d3.axisLeft(y));

    // X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
      .attr("y", height - 10)
      .style("font-size", "12px")
      .text("Date");

    // Y axis label (shifted further left)
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .style("font-size", "12px")
      .text("Number of Riders");

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("BART Daily Station Exits: 1998 - 2025");

    // Add a popup rect for mouse events
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", function (event) {
        const [mx, my] = d3.pointer(event);
        // Find the closest date
        const xDate = x.invert(mx);
        const bisect = d3.bisector((d) => d.Date).left;
        const idx = bisect(data, xDate);
        const d = data[Math.max(0, Math.min(data.length - 1, idx))];
        const riders = d.Total || d3.sum(stationKeys.map((k) => d[k]));

        // Find which station layer is under the mouse
        let stationName = null;
        let stationRiders = null;
        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i];
          const segment = layer[idx];
          if (segment) {
            const y0 = y(segment[0]);
            const y1 = y(segment[1]);
            // Check if mouse Y is within this layer's band
            if (my >= y1 && my <= y0) {
              stationName = stationKeys[i];
              stationRiders = d[stationName];
              break;
            }
          }
        }
        let html = `<strong>Date:</strong> ${d3.timeFormat("%Y-%m-%d")(
          d.Date
        )}<br>
              <strong>Total Riders:</strong> ${Number(
                riders
              ).toLocaleString()}`;
        if (stationName) {
          const fullStationName = stationNameMap[stationName] || stationName;
          html += `<br><strong>Station:</strong> ${fullStationName}<br>
             <strong>Station Riders:</strong> ${stationRiders.toLocaleString()}`;
        }
        tooltip
          .style("display", "block")
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 20 + "px")
          .html(html);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });

    // HTML Legend
    const legend = d3.select("#legend");
    stationKeys.forEach((key) => {
      const item = legend.append("div").attr("class", "legend-item");
      item
        .append("div")
        .attr("class", "legend-color")
        .style("background-color", color(key));
      item.append("div").text(stationNameMap[key] || key);
    });
  })
  .catch((err) => console.error("Error loading CSV:", err));

const tooltip = d3.select("#bart-tooltip");
