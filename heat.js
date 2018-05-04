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
      "5E4FA2",
      "3288BD",
      "66C2A5",
      "ABDDA4",
      "E6F598",
      "FFFFBF",
      "FEE08B",
      "FDAE61",
      "F46D43",
      "D53E4F",
      "9E0142"
    ]

    var w = 500;
    var h = 1600;
    var margin = {
      top: 80,
      bottom: 30,
      left: 40,
      right: 20
    };

    var svg = d3
      .select("#chart")
      .attr("width", w)
      .attr("height", h);
    
    var colScale = d3.scaleQuantile()
      .domain([d3.min(data.monthlyVariance, function(d) {
          return d.variance + data.baseTemperature;
        }), d3.max(data.monthlyVariance, function(d) {
          return d.variance + data.baseTemperature;
        })])
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
    
    svg.selectAll(".key.rect")
      .data(colours)
      .enter()
      .append("rect")
      .attr("y", margin.top / 4)
      .attr("x", function(d, i) {
        return (margin.left + (i * keyBox));
      })
      .attr("width", keyBox)
      .attr("height", keyBox)
      .style("fill", function(d) {
        return d;
      })
    
    var tip = d3.tip().attr("class", "d3-tip").html(function(d){
      var label = "<p><strong>" +
                months[d.month - 1] +
                " "+
                d.year +
                "</strong></p><p>" +
                (d.variance + data.baseTemperature).toFixed(2) +
                "<br>Variance: " +
                d.variance +
                "</p>"
      return label;
    })
    svg.call(tip);
    
    svg
      .selectAll(".plot.rect")
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
      .style("fill", function(d){
        return colScale(d.variance + data.baseTemperature)
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
    
  }
);