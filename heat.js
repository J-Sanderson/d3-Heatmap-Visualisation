d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  function(data) {
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var colours = [
      "#5E4FA2",
      "#3288BD",
      "#66C2A5",
      "#ABDDA4",
      "#E6F598",
      "#FFFFBF",
      "#FEE08B",
      "#FDAE61",
      "#F46D43",
      "#D53E4F",
      "#9E0142"
    ]

    var w = 500;
    var h = 1600;
    var margin = {
      top: 85,
      bottom: 30,
      left: 40,
      right: 20
    };

    var svg = d3
      .select("#chart")
      .attr("width", w)
      .attr("height", h);
    
    var minTemp = d3.min(data.monthlyVariance, function(d) {
          return d.variance + data.baseTemperature;
        });
    var maxTemp = d3.max(data.monthlyVariance, function(d) {
          return d.variance + data.baseTemperature;
        });
    
    var colScale = d3.scaleQuantile()
      .domain([minTemp, maxTemp])
      .range(colours)

    var yScale = d3.scaleLinear()
      .domain([
        d3.min(data.monthlyVariance, function(d) {
          return d.year;
        }),
        d3.max(data.monthlyVariance, function(d) {
          return d.year;
        }) + 1 //ensures bottom does not overrun x axis
      ])
      .range([margin.top, h - margin.bottom]);

    var xScale = d3.scaleBand()
      .domain(months)
      .range([margin.left, w - margin.right]);

    var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat);
    var xAxis = d3.axisBottom(xScale).tickSize(0);
    
    var boxWidth = Math.round((w - (margin.left + margin.right)) / 12);
    var boxHeight = Math.round((h - margin.top - margin.bottom) / (data.monthlyVariance.length / 12));
    var keyBox = Math.round((w - (margin.left + margin.right)) / colours.length)
    var keyStep = (maxTemp - minTemp) / colours.length;
    
    svg.selectAll(".key.rect")
      .data(colours)
      .enter()
      .append("rect")
      .attr("y", margin.top - keyBox)
      .attr("x", function(d, i) {
        return (margin.left + (i * keyBox));
      })
      .attr("width", keyBox)
      .attr("height", keyBox / 2)
      .style("fill", function(d) {
        return d;
      })
    
    svg.selectAll(".key.text")
      .data(colours)
      .enter()
      .append("text")
      .text(function(d, i){
        if (colScale.quantiles()[i]) {
          return colScale.quantiles()[i].toFixed(2);
        }
      })
      .attr("y", (margin.top - keyBox) - 5)
      .attr("x", function(d, i) {
        return (margin.left + (i * keyBox)) +(keyBox / 2) + 4;
      })
      .attr("font-size", "12px")
    
    svg.append("text")
      .text("Temperature (°C)")
      .attr("text-anchor", "middle")
      .attr("y", (margin.top - keyBox) - 22)
      .attr("x", w / 2)
      .attr("font-size", "15px")
    
    var tip = d3.tip().attr("class", "d3-tip").html(function(d){
      var label = "<p><strong>" +
                months[d.month - 1] +
                " "+
                d.year +
                "</strong></p><p>" +
                (d.variance + data.baseTemperature).toFixed(2) +
                "&deg;C<br>Variance: " +
                d.variance +
                "&deg;C</p>"
      return label;
    })
    svg.call(tip);
    
    svg
      .selectAll(".plot.rect")
      .data(data.monthlyVariance)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return ((d.month * boxWidth) + 3); //?
      })
      .attr("y", function(d) {
        return yScale(d.year);
      })
      .attr("height", boxHeight)
      .attr("width", boxWidth)
      .style("fill", function(d){
        return colScale(d.variance + data.baseTemperature);
      })
      .on('mouseover', tip.show)
			.on('mouseout', tip.hide);
    
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(yAxis);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - margin.bottom) + ")")
      .call(xAxis);
    
  }
);
