d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(data){
  
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
  ]
  
  var w = 500;
  var h = 900;
  var margin = {
    top: 20,
    bottom: 30,
    left: 40,
    right: 20
  }
  
  var svg = d3.select("#chart")
    .attr("width", w)
    .attr("height", h);
  
  var yScale = d3.scaleLinear()
    .domain([d3.min(data.monthlyVariance, function(d){
      return d.year;
    }), d3.max(data.monthlyVariance, function(d){
      return d.year;
    })])
    .range([margin.top, h - margin.bottom]);
  
  var xScale = d3.scaleBand()
    .domain(months)
    .range([margin.left, w - margin.right]);
  
  var yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat);
  var xAxis = d3.axisBottom(xScale)
  
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis)
  
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," +
          (h - margin.bottom) + 
          ")")
    .call(xAxis)
    
  
});