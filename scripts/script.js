d3.json("https://ssd-api.jpl.nasa.gov/sentry.api").then((data) => {
  let neoData = [];
  console.log(data);
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
  console.log(neoData);

  function sortPs(d) {
    d3.selectAll(".item").remove();
    d.sort((a, b) => (a.ps < b.ps ? 1 : -1));
    draw(sortPs);
  }
  // sortPs(neoData);

  function sortIp(d) {
    d3.selectAll(".item").remove();
    d.sort((a, b) => (a.ip < b.ip ? 1 : -1));
    draw(sortIp);
  }
  // sortIp(neoData);

  function sortObs(d) {
    d3.selectAll(".item").remove();
    d.sort((a, b) => (a.last_obs < b.last_obs ? 1 : -1));
    draw(sortObs);
  }
  // sortObs(neoData);
  function sortDiameter(d) {
    d3.selectAll(".item").remove();
    d.sort((a, b) => (a.diameter < b.diameter ? 1 : -1));
    draw(sortDiameter);
  }
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

  const output = document.getElementById("count");
  output.innerHTML =
    "Currently observing:<br>" + "<b>" + neoData.length + "</b>" + " NEOs";

  const filter = function (d) {
    return "url(#" + d.ip + ")";
  };
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
  function draw() {
    const item = d3.select("#viz").selectAll("a").data(neoData);
    item
      .enter()
      .append("a")
      .attr("class", "item")
      .attr("href", function (d) {
        return (
          "https://ssd.jpl.nasa.gov/sbdb.cgi?sstr=" +
          d.Name +
          ";old=0;orb=1;cov=0;log=0;cad=0#orb"
        );
      })
      .attr("target", "_blank")
      .attr("cursor", "pointer")
      .append("svg")
      .attr("class", "neoItem")
      .attr("width", 150)
      .attr("height", 150);

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

    const neo = d3
      .selectAll(".neoItem")
      .append("circle")
      .attr("class", "neo")
      .attr("fill", "black")
      .attr("cx", 75)
      .attr("cy", 75)
      .attr("r", 75)
      .attr("filter", filter);

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
    d3.selectAll(".curve")
      .append("path")
      .attr(
        "d",
        "M5 145 C 42.5 145, 42.5 75, 75 75, 107.5 75, 107.5 145, 145 145"
      )
      .attr("fill", "transparent")
      .attr("stroke", "white")
      .attr("stroke-width", 1);
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

    // const hoverText =  d3.selectAll('.neoItem')
    // .append('text')
    //   .attr('class', 'neoText')
    //   .attr('fill', 'white')
    //   .attr('x', 5)
    //   .attr('y', 105)
    //   .html(`ip: ${d.ip}`)
    //   .append('tspan')
    //   .attr('class', 'neoText')
    //   .attr('fill', 'white')
    //   .attr('x', 5)
    //   .attr('y', 85)
    //   .html(`ps: ${d.ps}`)
    //   .append('tspan')
    //   .attr('class', 'neoText')
    //   .attr('fill', 'white')
    //   .attr('x', 5)
    //   .attr('y', 125)
    //   .html(`range: ${d.range}`)
    //   .append('tspan')
    //   .attr('class', 'neoText')
    //   .attr('fill', 'white')
    //   .attr('x', 5)
    //   .attr('y', 145)
    //   .html(`diameter: ${d.diameter}km`);

    // const avg = d3.selectAll('.neoItem')
    // .append('line')
    // .data(neoData)
    // .join('line')
    // .attr("class", "avg")
    // .attr("stroke-width", 1)
    // .attr("stroke", "white")
    // .style("stroke-dasharray","4,5")
    // .attr('x1', 75)
    // .attr('x2', 75)
    // .attr('y1', 75)
    // .attr('y2', 145);

    // const ps = d3.selectAll('.neoItem')
    // .append('line')
    // .data(neoData)
    // .join('ps')
    // .attr("class", "ps")
    // .attr("stroke-width", 1)
    // .attr("stroke", "white")
    // .attr('x1', function(d){ return 75 + d.ps})
    // .attr('x2', function(d){ return 75 + d.ps})
    // .attr('y1', 75)
    // .attr('y2', 145);

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

    function mouseout() {
      d3.selectAll(".neoText")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style("opacity", 0)
        .delay(function (d, i) {
          console.log(i);
          return i * 1;
        });
      d3.selectAll(".curve").style("visibility", "visible");
    }
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
        d3.select('.expand')
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .style("opacity", "0")
        .style('height', "0px")
        .style('width', "0px");
        d3.select('.close')
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .style("opacity", "1")
        // .style('height', "100%")
        .style('width', "100%");

    };

    function legendClose(e) {
      //   var captureClick = function(event) {
      //     event.stopPropagation();
      //     this.on('mousedown', captureClick, true); // cleanup
      // }
      // d3.select('#capture')
      //   .on('mousedown',captureClick, true);

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
        d3.select('.expand')
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .style("opacity", "1")
        // .style('height', "100%")
        .style('width', "100%");
        d3.select('.close')
        .transition()
        .duration(0)
        .ease(d3.easeLinear)
        .style("opacity", "0")
        .style('height', "0px")
        .style('width', "0px");
        
        e.stopPropagation();
    };    

    function subTitleDown() {
      d3.select(".teaser")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        // .style('opacity', '1')
        .style('margin-top', '0px')
        // .style("height", "46.5px");
    };
    function subTitleUp() {
      d3.select(".teaser")
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
        // .style('opacity', '0')
        .style('margin-top', '-51px')
        // .style("height", "0px");
    };

    d3.select(".expand")
      .on("mousedown", legendView)
      .on("touchstart", legendView);

    d3.select(".close")
      .on("mousedown", function(e) {
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
          d3.select('.expand')
          .transition()
          .duration(0)
          .ease(d3.easeLinear)
          .style("opacity", "1")
          // .style('height', "100%")
          .style('width', "100%");
          d3.select('.close')
          .transition()
          .duration(0)
          .ease(d3.easeLinear)
          .style("opacity", "0")
          .style('height', "0px")
          .style('width', "0px");
          
          e.stopPropagation();
      });
      // .on("touchstart", legendClose);

    d3.selectAll(".neoItem")
      .on("mouseenter", mouseover)
      .on("touchstart", mouseover)
      .on("touchend", mouseout)
      .on("mouseleave", mouseout);
    d3.select('.headerContainer')
      .on("mouseenter", subTitleDown)
      .on("mouseout", subTitleUp)
    // d3.selectAll('.item')
    //   .on("mousedown", function(event) { event.stopPropagation(); })
  }
  draw();
});
