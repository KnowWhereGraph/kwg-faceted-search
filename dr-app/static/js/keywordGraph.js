//loading graph from local json
$.getJSON("asset/nodeLinks.json", function (json) {
  console.log("categories");
  console.log(json);
  loadGraph(json);
});

//creating force directed graph
function loadGraph(categories) {
  var width = 1000;
  var height = 400;

  var svgClick = '';
  var toggle = 0;
  var tipToggle = 0;
  var svg = d3.select(".kg")
    .attr(
      "style",
      "padding-bottom: " + Math.ceil(height * 80 / width) + "%"
    )
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height);

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  //simulating the graph
  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {
      return d.id;
    }).distance(50).strength(2))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2)); //responsive

  //links 
  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(categories.links)
    .enter().append("line")
    .attr("stroke-width", function (d) {
      return Math.sqrt(d.value);
    });

  //tip in the graph
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
      if (d.uri) {
        return '<a href="' + d.uri + '" target="_blank" style="color:white; font-family: \'PT Sans\', Helvetica, sans-serif; font-size:16px; text-decoration: none !important;"> ' + d.label + ' ></a>';
      } else {
        return '<a style="color:white; font-family: \'PT Sans\', Helvetica, sans-serif; font-size:16px; text-decoration: none !important; cursor: default;">' + d.label + '</a>';
      }
    });

  //removing tip on resizing the window  
  d3.select(window).on("resize", function (d) {
    if (tipToggle == 1) {
      tip.hide(d);
      tipToggle = 0;
      connectedNodes(this);
    }
  });

  //reseting the selected nodes on scroll
  d3.select(window).on("scroll", function (d) {
    if (toggle == 1) {
      legend.selectAll('circle')
        .style("opacity", 1);
      legend.selectAll('text')
        .style("opacity", 1);
      node.style("opacity", 1);
      toggle = 0;
      if (tipToggle == 1) {
        tip.hide();
        tipToggle = 0;
      }
    }
  });

  //for IOS Press logo in the middle of the circle
  var defs = svg.append('svg:defs');

  defs.append("svg:pattern")
    .attr("id", "myPattern")
    .attr("width", 1)
    .attr("height", 1)
    .append("svg:image")
    .attr("xlink:href", "./Images/IOS_Press_circle.svg")
    .attr("width", 40)
    .attr("height", 40)
    .attr("x", 0)
    .attr("y", 0);

  //nodes  
  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(categories.nodes)
    .enter().append("circle")
    .attr("r", function (d) {
      if (d.id == 'IOS Press')
        return 20;
      else {
        if (d.value <= 15)
          return d.value;
        else
          return Math.round(d.value / 15 + 15);
      }

    })
    .attr("fill", function (d) {
      if (d.id == 'IOS Press')
        return "url(#myPattern)";
      else
        return d.color;
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on('click', function (d) {
      var elemData = d;
      //higlighting the legends based on the nodes
      d3.select('.legend').selectAll('circle').style("opacity", 0.15);
      d3.select('.legend').selectAll('text').style("opacity", 0.15);
      d3.select('.legend').selectAll('circle')
        .select(function (d) {
          return d === elemData ? this : null;
        }).style('opacity', 1);
      d3.select('.legend').selectAll('text')
        .select(function (d) {
          return d === elemData ? this : null;
        }).style('opacity', 1);
      connectedNodes(this);
      if (tipToggle == 0) {
        tip.show(d);
        tipToggle = 1;
      } else {
        tip.hide(d);
        tipToggle = 0;
      }
    });
  // .on('mouseover', tip.show)
  // .on('mouseout', tip.hide);

  svg.call(tip);
  // node.append("title")
  //   .text(function(d) { return d.label; });

  //legend on the side
  var j = 1;
  var yPosition = 0;
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("x", 0)
    .attr("y", 100)
    .attr("height", 100)
    .attr("width", 100);

  legend.selectAll('g').data(categories.nodes)
    .enter()
    .append('g')
    .each(function (d, i) {
      if (d.legend) {
        var g = d3.select(this);
        g.append("circle")
          .attr("cx", 15)
          .attr("cy", function (d) {
            if (j == 1) {
              yPosition = j * 100;
              return yPosition;
            } else {
              yPosition = yPosition + 20;
              return yPosition;
            }
          })
          .attr("r", 6)
          .style("fill", function (d) {
            if (d.legend)
              return d.color;
          });
        g.append("text")
          .attr("x", 30)
          .attr("y", function (d) {
            if (j == 1) {
              yPosition = j * 100 + 5;
              return yPosition;
            } else {
              yPosition = yPosition + 5;
              return yPosition;
            }
          })
          .attr("height", 20)
          .attr("width", 100)
          .attr("font-size", 12)
          .style("fill", function (d) {
            if (d.legend)
              return d.color;
          })
          .text(function (d) {
            if (d.legend)
              return d.label
          });
        g.on('click', function (d) {
            if (toggle == 0) {
              //highlighting the selected legend
              legend.selectAll('circle').style("opacity", 0.15);
              legend.selectAll('text').style("opacity", 0.15);
              var g = d3.select(this);
              g.selectAll('circle')
                .style("opacity", 1);
              g.selectAll('text')
                .style("opacity", 1);
              connectedNodes(this);
            } else {
              connectedNodes(this);
            }
            if (tipToggle == 1) {
              tip.hide(d);
              tipToggle = 0;
            }
          })
          .on("mouseover", function (d) {
            d3.select(this).style("cursor", "pointer");
          })
          .on("mouseout", function (d) {
            d3.select(this).style("cursor", "default");
          });
        j++;
      }
    });

  //guidance text  
  var infoText = svg.append("g")
    .attr("class", "infoText")
    .attr("x", 10)
    .attr("y", yPosition + 30)
    .attr("height", 20)
    .attr("width", 100);
  infoText.append("text")
    .attr("x", 10)
    .attr("y", yPosition + 30)
    .style("fill", "grey")
    .text("Click on the graph to access the linked data.");

  simulation
    .nodes(categories.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(categories.links);

  //resetting the selected nodes when user clicks outside
  svg.on("mousedown", function () {
    if (toggle == 1) {
      legend.selectAll('circle')
        .style("opacity", 1);
      legend.selectAll('text')
        .style("opacity", 1);
      node.style("opacity", 1);
      toggle = 0;
      if (tipToggle == 1) {
        tip.hide();
        tipToggle = 0;
      }
    }
  });

  function ticked() {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("cx", function (d) {
        return d.x = Math.max(d.value, Math.min(width - d.value, d.x)); //responsiveness
      })
      .attr("cy", function (d) {
        return d.y = Math.max(d.value, Math.min(height - d.value, d.y)); //responsiveness
      });
  }

  //bounded force layout
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = Math.max(d.value, Math.min(width - d.value, d3.event.x));
    d.fy = Math.max(d.value, Math.min(height - d.value, d3.event.y));
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  //highlighting all the connected nodes based on click 
  var linkedByIndex = {};
  for (i = 0; i < categories.nodes.length; i++) {
    linkedByIndex[i + "," + i] = 1;
  };
  categories.links.forEach(function (d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });

  function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
  }

  function connectedNodes(me) {
    if (toggle == 0) {
      d = d3.select(me).node().__data__;
      node.style("opacity", function (o) {
        return neighboring(d, o) | neighboring(o, d) ? 1 : 0.15;
      });
      toggle = 1;
    } else {
      legend.selectAll('circle')
        .style("opacity", 1);
      legend.selectAll('text')
        .style("opacity", 1);
      node.style("opacity", 1);
      toggle = 0;
    }
  }
}