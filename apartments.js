d3.csv("apartments.csv").then(data => {
    data.forEach(d => {
      d.Year = +d.Year;
      d.Complexes = +d.Complexes;
    });
  
    const svg = d3.select("svg");
    const margin = { top: 60, right: 50, bottom: 80, left: 70 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
  
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleBand()
      .domain(data.map(d => d.Year))
      .range([0, width])
      .padding(0.2);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Complexes)])
      .nice()
      .range([height, 0]);
  
    const color = d3.scaleLinear()
      .domain([d3.min(data, d => d.Complexes), d3.max(data, d => d.Complexes)])
      .range(["#b3cde0", "#005b96"]);
  
    // Add X Axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  
    // Add Y Axis
    g.append("g").call(d3.axisLeft(y));
  
    // Add Y Axis Label
    svg.append("text")
      .attr("x", -(height / 2) - margin.top)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Number of Apartment Complexes");
  
    // Add X Axis Label
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 50)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Year");
  
    // Add Chart Title
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("Apartment Complexes Built in South Florida (2014–2023)");
  
    // Tooltip
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);
  
    // Bars with animation and tooltips
    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.Year))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", d => color(d.Complexes))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`<strong>Year:</strong> ${d.Year}<br><strong>Complexes:</strong> ${d.Complexes}`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(300).style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("y", d => y(d.Complexes))
      .attr("height", d => height - y(d.Complexes));
  
    // Gradient legend
    const legendWidth = 200;
    const legendHeight = 10;
  
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "legend-gradient");
  
    linearGradient.selectAll("stop")
      .data([
        { offset: "0%", color: "#b3cde0" },
        { offset: "100%", color: "#005b96" }
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);
  
    const legend = svg.append("g")
      .attr("transform", `translate(${width - legendWidth + margin.left}, ${margin.top - 30})`);
  
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");
  
    const legendScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Complexes), d3.max(data, d => d.Complexes)])
      .range([0, legendWidth]);
  
    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickSize(legendHeight)
      .tickFormat(d3.format("~s"));
  
    legend.append("g")
      .attr("transform", `translate(0,0)`)
      .call(legendAxis)
      .select(".domain").remove();
  });
  
  
  