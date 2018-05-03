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
    
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    var w = 500;
    var h = 1500;
    var margin = {
      top: 20,
      bottom: 30,
      left: 40,
      right: 20
    };

    var svg = d3
      .select("#chart")
      .attr("width", w)
      .attr("height", h);

    var yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data.monthlyVariance, function(d) {
          return d.year;
        }),
        d3.max(data.monthlyVariance, function(d) {
          return d.year;
        }) + 1 //ensures bottom does not overrun x axis
      ])
      .range([margin.top, h - margin.bottom]);

    var xScale = d3
      .scaleBand()
      .domain(months)
      .range([margin.left, w - margin.right]);

    var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat);
    var xAxis = d3.axisBottom(xScale);
    
    var boxWidth = Math.round((w - (margin.left + margin.right)) / 12);
    var boxHeight = Math.round((h - margin.top - margin.bottom) / (data.monthlyVariance.length / 12));

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
    
    svg
      .selectAll("rect")
      .data(data.monthlyVariance)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return ((d.month * boxWidth) + 3) //?
      })
      .attr("y", function(d) {
        return yScale(d.year);
      })
      .attr("height", boxHeight)
      .attr("width", boxWidth)
      .on("mouseover", function(d) {
        div.transition()		
          .duration(500)		
          .style("opacity", 0.8);	
        div.html("<p><strong>" +
                months[d.month - 1] +
                " "+
                d.year +
                "</strong></p><p>" +
                (d.variance + data.baseTemperature).toFixed(2) +
                "<br>Variance: " +
                d.variance +
                "</p>")
          .style("left", (d3.event.pageX - 50) + "px")
          .style("top", (d3.event.pageY - 81) + "px")
      })
      
  }
);