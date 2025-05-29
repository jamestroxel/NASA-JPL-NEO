
// Load animation
d3.select(".lds-dual-ring")
  .transition()
  .duration(100)
  .delay(4000)
  .style("opacity", 0);


// Fetch
d3.json("nasa-jpl-neo/assets/data/staticSet.json").then((data) => {
  // console.log(data)
  let neoData = [];
  data.data.forEach((d) => {
    neoData.push({
      Name: d.des,
      ip: Number.parseFloat(+d.ip).toFixed(10),
      ps: +d.ps_cum,
      range: d.range,
      diameter: +d.diameter,
      last_obs: d.last_obs,
    });
  });

  // Sort functions for UI
  function sortPs(d) {
    d3.selectAll(".item").remove();
    d.sort((a, b) => (a.ps < b.ps ? 1 : -1));
    draw(sortPs);
  }

  function sortIp(d) {
    d3.selectAll(".item").remove();
    d.sort((a, b) => (a.ip < b.ip ? 1 : -1));
    draw(sortIp);
  }

  function sortObs(d) {
    d3.selectAll(".item").remove();
    d.sort((a, b) => (a.last_obs < b.last_obs ? 1 : -1));
    draw(sortObs);
  }

  function sortDiameter(d) {
    d3.selectAll(".item").remove();
    d.sort((a, b) => (a.diameter < b.diameter ? 1 : -1));
    draw(sortDiameter);
  }

  // UI Events
  document.getElementById("sortPs").onclick = function () {
    sortPs(neoData);
  };
  document.getElementById("sortIp").onclick = function () {
    sortIp(neoData);
  };
  document.getElementById("sortObs").onclick = function () {
    sortObs(neoData);
  };
  document.getElementById("sortDiameter").onclick = function () {
    sortDiameter(neoData);
  };

  // Count display
  const output = document.getElementById("count");
  output.innerHTML =
    "Currently observing:<br>" + "<b>" + neoData.length + "</b>" + " NEOs";

  // Filter reference based on impact probibility of each item
  const filter = function (d) {
    return "url(#" + d.ip + ")";
  };
  // Margins and scales
  const height = 800;
  const width = 1080;
  const margins = { top: 0, right: 0, bottom: 0, left: 0 };
  const diameter = d3
    .scaleLog()
    .domain([d3.min(neoData, (d) => d.diameter), 75])
    .range([0, 75]);
  const ipScale = d3
    .scaleLog()
    .domain([d3.min(neoData, (d) => d.ip), 1])
    .range([0, 150]);
  const pScale = d3
    .scaleLinear()
    .domain(d3.extent(neoData, (d) => d.ps))
    .range([1, 74]);

  // Draw viz
  function draw() {
    const item = d3.select("#viz").selectAll("a").data(neoData);
    // Wrap each item in an anchor linking to JPL Small-Body Database Browser
    item
      .enter()
      .append("a")
      .attr("class", "item")
      .attr("href", function (d) {
        return (
          "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=" +
          d.Name +
          "&view=VOP"
        );
      })
      .attr("target", "_blank")
      .attr("cursor", "pointer")
      .append("svg")
      .attr("class", "neoItem")
      .attr("width", 150)
      .attr("height", 150);

    // Generate SVG def tags with unique filters and feGaussianBlur values
    const defs = d3
      .selectAll(".neoItem")
      .append("defs")
      .append("filter")
      .attr("id", function (d) {
        return d.ip;
      })
      .attr("x", "0")
      .attr("y", "0")
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", function (d) {
        return 150 - ipScale(d.ip);
      });

    // Append silhouettes and apply blur filter
    const neo = d3
      .selectAll(".neoItem")
      .append("circle")
      .attr("class", "neo")
      .attr("fill", "black")
      .attr("cx", 75)
      .attr("cy", 75)
      .attr("r", 75)
      .attr("filter", filter);

    // Draw Diameter marker
    const curve = d3
      .selectAll(".neoItem")
      .append("g")
      .attr("class", "curve")
      .attr("height", 150)
      .attr("width", 150)
      .append("circle")
      .attr("class", "diameter")
      .attr("cx", 75)
      .attr("cy", 75)
      .attr("fill", "transparent")
      .attr("stroke", "cyan")
      .attr("r", function (d) {
        return diameter(d.diameter);
      });

    // Draw Palermo Scale graphs
    // Bell curve
    d3.selectAll(".curve")
      .append("path")
      .attr(
        "d",
        "M5 145 C 42.5 145, 42.5 75, 75 75, 107.5 75, 107.5 145, 145 145"
      )
      .attr("fill", "transparent")
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    // Average line
    d3.selectAll(".curve")
      .append("line")
      .attr("class", "avg")
      .attr("stroke-width", 1)
      .attr("stroke", "white")
      .style("stroke-dasharray", "5,2.5")
      .attr("x1", 75)
      .attr("x2", 75)
      .attr("y1", 75)
      .attr("y2", 145);

    // Statistic line
    d3.selectAll(".curve")
      .append("line")
      .attr("class", "ps")
      .attr("stroke-width", 1)
      .attr("stroke", "white")
      .attr("stroke-linecap", "round")
      .attr("x1", function (d) {
        return pScale(d.ps);
      })
      .attr("x2", function (d) {
        return pScale(d.ps);
      })
      .attr("y1", 75)
      .attr("y2", 145);

     // Append NEO name
     const name = d3
     .selectAll(".neoItem")
     .append("text")
     .join("text")
     .attr("class", "neoName")
     .style("font-weight", 800)
     .style("text-transform", "uppercase")
     .attr("fill", "white")
     .attr("x", 5)
     .attr("y", 20)
     .html(function (d) {
       return d.Name;
     });


    // Tooltip events (text is appended on mouseover, mouseout fades "neoText" opacity to 0, then removes it)
    function mouseover(event, d) {
      // debugger
      d3.select(this)
        .append("text")
        .attr("class", "neoText")
        .attr("fill", "white")
        .attr("x", 5)
        .attr("y", 105)
        .html(`ip: ${d.ip}`)
        .append("tspan")
        .attr("class", "neoText")
        .attr("fill", "white")
        .attr("x", 5)
        .attr("y", 85)
        .html(`ps: ${d.ps}`)
        .append("tspan")
        .attr("class", "neoText")
        .attr("fill", "white")
        .attr("x", 5)
        .attr("y", 125)
        .html(`range: ${d.range}`)
        .append("tspan")
        .attr("class", "neoText")
        .attr("fill", "white")
        .attr("x", 5)
        .attr("y", 145)
        .html(`diameter: ${d.diameter}km`);
      d3.select(this).select(".curve").style("visibility", "hidden");
    }
   

    function mouseout() {
      d3.selectAll(".neoText")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("opacity", 0)
        .delay(function (d, i) {
          return i * 1;
        })
        .remove();
      d3.selectAll(".curve").style("visibility", "visible");
    }

    // Legend behavior for mobile version ("close" and "expand" behaviors toggled by adjusting height and width of each on event trigger)
    function legendView() {
      d3.select(".legend-wrap")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("height", "220px");
      d3.select(".container-wrap")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("height", "220px");

      d3.selectAll(".arrows")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("opacity", "1");
      d3.select(".expand")
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .style("opacity", "0")
        .style("height", "0px")
        .style("width", "0px");
      d3.select(".close")
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .style("opacity", "1")
        .style("width", "100%");
    }

    // Subtitle drop-down on mouseover at top of screen
    function subTitleDown() {
      d3.select(".teaser")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("margin-top", "0px");
    }
    function subTitleUp() {
      d3.select(".teaser")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("margin-top", "-51px");
    }
    // Legend UI is revealed on touchstart
    d3.select(".expand")
      .on("mousedown", legendView)
      .on("touchstart", legendView);

    // Collapses 
    d3.select(".close").on("mousedown", function (e) {
      d3.select(".legend-wrap")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("height", "40px");
      d3.select(".container-wrap")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("height", "0px");

      d3.selectAll(".arrows")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("opacity", "0");
      d3.select(".expand")
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .style("opacity", "1")
        .style("width", "100%");
      d3.select(".close")
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .style("opacity", "0")
        .style("height", "0px")
        .style("width", "0px");
      // This prevents "mouseup" from triggering anchor tags underneath legend when it collapses
      e.stopPropagation();
    });

    d3.selectAll(".neoItem")
      .on("mouseenter", mouseover)
      .on("touchstart", mouseover)
      .on("touchend", mouseout)
      .on("mouseleave", mouseout);
    d3.select(".headerContainer")
      .on("mouseenter", subTitleDown)
      .on("mouseout", subTitleUp);
  }
  draw();
});
