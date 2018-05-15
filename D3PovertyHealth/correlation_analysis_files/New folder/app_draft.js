// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
    top: 40,
    right: 60,
    bottom: 60,
    left: 60
};


// Define dimensions of the chart area
// var margin = { top: 50, right: 50, bottom: 50, left: 50 };
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
    .append("g")
    .attr("transform", "translate(" + chartMargin.left + ", " + chartMargin.top + ")");

// Load data from population.csv

d3.csv("data/data.csv", function(error, response) {
    if (error) {return error;}
    console.log(response);

    var stateNames=[];
    var poorHealth=[];
    var povertyLevel=[];

    response.forEach(function(blah) {
        stateNames.push(blah.abbrState);
        blah.healthQuestion = parseFloat(blah.healthQuestion);
        blah.povertyLevel = parseFloat(blah.povertyLevel);
        poorHealth.push(blah.healthQuestion);
        povertyLevel.push(blah.povertyLevel);
        
    });

    console.log(stateNames);
    console.log(poorHealth);
    console.log(povertyLevel);

    var xBandScale = d3
        .scaleLinear()
        .domain([d3.min(povertyLevel)-3, d3.max(povertyLevel)+3])
        //.range([d3.min(povertyLevel)+15,chartWidth]);
        .range([0,chartWidth]);

    var yLinearScale = d3
        .scaleLinear()
        .domain([0, d3.max(poorHealth)+2])
        .range([chartHeight,0]);

    var bottomAxis = d3.axisBottom(xBandScale).ticks(10);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    console.log(d3.max(poorHealth));
    console.log(d3.max(povertyLevel));


    var icircles = svg
        .selectAll("circle")
        .data(response)
        .enter()
        .append("circle")
        // .attr("class", "bar")
        // .attr("x", function(data) {
        //     return xBandScale(data.povertyLevel);
        // })
        // .attr("y", function(data) {
        //     return yLinearScale(data.healthQuestion);
        // })
        // .attr("width", function(xBandScale) {
        //     return xBandScale.povertyLevel;
        // })
        // .attr("height", function(data) {
        //     return chartHeight - yLinearScale(data.healthQuestion);
        // });
        .attr("cx", d => xBandScale(d.povertyLevel))
        .attr("cy", d => yLinearScale(d.healthQuestion))
        .attr("r", "12")
        .attr("stroke", "red")
        .attr("fill", "none")
        .attr("fill-opacity", 0.1);

//appending within the circles - will not show up must append in a different svg element
    // icircles.append("text")
    //     .attr("cx", d=>xBandScale(d.povertyLevel))
    //     .attr("cy", d=>yLinearScale(d.healthQuestion))
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "5px")
    //     .style("fill", "black")
    //     // .attr("dx", ".3em")
    //     .text((d,i) => stateNames[i]);

    var textcircles = svg
        .selectAll("text")
        .data(response)
        .enter()
        .append("text")
        .attr("x", d=>xBandScale(d.povertyLevel))
        .attr("y", d=>yLinearScale(d.healthQuestion))
        .attr("dx", "-.65em")
        .attr("dy", ".35em")
        .style("font-size", "10px")
        .style('fill', 'black')
        .text((d,i) => stateNames[i]);
        // .attr("text-anchor", "middle")
        // .style("fill", "black");
        


    // Append two SVG group elements to the SVG area, create the bottom and left axes inside of them
    var yAxis = svg.append("g")
        .call(leftAxis);
    yAxis
        .append("g")
        .attr("transform", "translate(-35, " + (chartHeight / 2) + ")")
        .append("text")
        // Rotate the text
        .attr("transform", "rotate(-90)")
        // Center the text (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
        .attr("text-anchor", "middle")
        // Set the font size and the color of the text
        .style("font-size", "15px")
        // .style("fill", "green")
        // Set the value of the text
        .style('fill', 'black')
        .text("Overall Health Opinion");
    //y-axis label changing colors
        // yAxis.selectAll('text').style('fill', 'green');

    var xAxis = svg.append("g")
        .attr("transform", "translate(0, " + chartHeight + ")")
        .call(bottomAxis);
    xAxis
        .append("g")
        // Position the group that contains the text
        .attr("transform", "translate(0" + (chartWidth / 2) + ", 40)")
        .append("text")
        // Center the text (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
        .attr("text-anchor", "middle")
        // Set the font size and the color of the text
        .style("font-size", "15px")
        .style("fill", "black")
        // Set the value of the text
        .text("Poverty Level");

});
