// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 600;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 60,
    bottom: 100,
    left: 100
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
    var healthQuestion=[];
    var povertyLevel=[]; //ACS
    var depressedPerc =[];
    var medIncome = [];  //ACS
    var healthInsurance = [];
    var educatedPerc = []; //ACS

    response.forEach(function(blah) {
        stateNames.push(blah.abbrState);
        blah.healthQuestion = parseFloat(blah.healthQuestion);
        blah.povertyLevel = parseFloat(blah.povertyLevel);
        blah.depressedPerc = parseFloat(blah.depressedPerc);
        blah.medIncome = parseFloat(blah.medIncome);
        blah.healthInsurance = parseFloat(blah.healthInsurance);
        blah.educatedPerc = parseFloat(blah.educatedPerc);

        healthQuestion.push(blah.healthQuestion);
        povertyLevel.push(blah.povertyLevel);
        depressedPerc.push(blah.depressedPerc);
        medIncome.push(blah.medIncome);
        healthInsurance.push(blah.healthInsurance);
        educatedPerc.push(blah.educatedPerc);
        
    });

    var xBandScale = d3
        .scaleLinear()
        .domain([d3.min(povertyLevel)-3, d3.max(povertyLevel)+3])
        .range([0,chartWidth]);

    var yLinearScale = d3
        .scaleLinear()
        .domain([0, d3.max(healthQuestion)+3])
        .range([chartHeight,0]);

    var bottomAxis = d3.axisBottom(xBandScale).ticks(10);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    var icircles = svg
        .selectAll("circle")
        .data(response)
        .enter()
        .append("circle")
        .attr("cx", d => xBandScale(d.povertyLevel))
        .attr("cy", d => yLinearScale(d.healthQuestion))
        .attr("r", "12")
        .attr("stroke", "red")
        .attr("fill", "red")
        .attr("fill-opacity", 0.1)
        //.attr("cx", d=>xBandScale(d.depressedPerc));

    var textcircles = svg
        .selectAll("circle-text")
        .data(response)
        .enter()
        .append("text")
        .attr("class", "circle-text")
        .attr("x", d=>xBandScale(d.povertyLevel))
        .attr("y", d=>yLinearScale(d.healthQuestion))
        .attr("dx", "-.65em")
        .attr("dy", ".35em")
        .style("font-size", "10px")
        .style('fill', 'black')
        //.text((d,i) => stateNames[i]);
        .text(d => d.abbrState);

    // Append two SVG group elements to the SVG area, create the bottom and left axes inside of them
    var yAxis = svg.append("g")
        .call(leftAxis);

    var healthY = yAxis
        .append("g")
        .attr("transform", "translate(-30, " + (chartHeight / 2) + ")")
        .append("text")
        .attr("class", "axis-text active")
        .attr("axis-name", "healthQuestion")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style('fill', 'black')
        .text("Percentage in Fair/Poor Health Opinion");

    var depressedY = yAxis
        .append("g")
        .attr("transform", "translate(-50, " + (chartHeight / 2) + ")")
        .append("text")
        .attr("class", "axis-text inactive")
        .attr("axis-name", "depressedPerc") //changed
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style('fill', 'black')
        .text("Percentage Depressed")
    
    var insuranceY = yAxis
        .append("g")
        .attr("transform", "translate(-70, " + (chartHeight / 2) + ")")
        .append("text")
        .attr("class", "axis-text inactive")
        .attr("axis-name", "healthInsurance")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style('fill', 'black')
        .text("Percentage without Health Insurance")
        .on("click", function(data) {
            console.log("blah")});

    var xAxis = svg.append("g")
        .attr("transform", "translate(0, " + chartHeight + ")")
        .call(bottomAxis);

    povertyX = xAxis
        .append("g")
        .attr("transform", "translate(0" + (chartWidth / 2) + ", 40)")
        .append("text")
        .attr("class", "axis-text active")
        .attr("axis-name", "povertyLevel")
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("fill", "black")
        .text("Population Poverty Level (%)");

    medianX = xAxis
        .append("g")
        .attr("transform", "translate(0" + (chartWidth / 2) + ", 60)")
        .append("text")
        .attr("class", "axis-text inactive")
        .attr("axis-name", "medIncome")
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("fill", "black")
        .text("Median Income Level ($)");

    educatedX = xAxis
        .append("g")
        .attr("transform", "translate(0" + (chartWidth / 2) + ", 80)")
        .append("text")
        .attr("class", "axis-text inactive")
        .attr("axis-name", "educatedPerc")
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("fill", "black")
        .text("Population of College Graduates (%)");

function labelChange(isClickedSelectionInactive) {
    d3
        .selectAll(".axis-text")
        .filter(".active")
        .classed("active", false)
        .classed("inactive", true);
}

function findMinAndMax(dataColumnX) {
    return d3.extent(response, function(data) {
        return data[dataColumnX];
    });
}
    var currentXaxis = povertyLevel;
    var currentYaxis = healthQuestion;
    var currentXtext = "Poverty Level: ";
    var currentYtext = "Health Opinion: ";

    d3.selectAll(".axis-text").on("click", function() {
        var yBool = false;
        var clickedSelection = d3.select(this);
        var clickedAxis = clickedSelection.attr("axis-name");
        var isClickedSelectionInactive = clickedSelection.classed("inactive");
        console.log("current axis: ", clickedAxis);
        console.log(findMinAndMax(clickedAxis));

        if (clickedAxis == "healthInsurance" || clickedAxis == "depressedPerc" || clickedAxis == "healthQuestion") {
            yBool = true;
        }

        if (isClickedSelectionInactive && yBool) {
            yLinearScale.domain([d3.min(findMinAndMax(clickedAxis))-8.7, d3.max(findMinAndMax(clickedAxis))+3]);
            var leftAxis = d3.axisLeft(yLinearScale).ticks(10);
            yAxis.transition().call(leftAxis).duration(1800);

            d3.selectAll("circle").each(function() {
                d3
                    .select(this)
                    .transition()
                    .attr("cy", function(data) {
                        return yLinearScale(data[clickedAxis]);
                    })
                    .duration(1500);
            });

            d3.selectAll(".circle-text").each(function() {
                d3
                    .select(this)
                    .transition()
                    .attr("y", function(data) {
                        return yLinearScale(data[clickedAxis]);
                    })
                    .duration(1800);
            });

            switch (clickedAxis) {
                case "healthInsurance":
                    currentYaxis = healthInsurance;
                    currentYtext = "Health Insurance Coverage: ";
                    tooltipping(currentXtext, currentYtext,currentXaxis, healthInsurance);
                    break;
                case "depressedPerc":
                    currentYaxis = depressedPerc;
                    currentYtext = "Depressed Percentage: ";
                    tooltipping(currentXtext, currentYtext,currentXaxis, depressedPerc);
                    break;
                case "healthQuestion":
                    currentYaxis = healthQuestion;
                    currentYtext = "Health Opinion: ";
                    tooltipping(currentXtext, currentYtext,currentXaxis, healthQuestion);
                    break;
            }
            labelChange(clickedAxis);
        }
        else if (isClickedSelectionInactive) {
            xBandScale.domain([d3.min(findMinAndMax(clickedAxis))-8.7, d3.max(findMinAndMax(clickedAxis))+3]);
            var bottomAxis = d3.axisBottom(xBandScale).ticks(10);
            xAxis.transition().call(bottomAxis).duration(1800);

            d3.selectAll("circle").each(function() {
                d3
                    .select(this)
                    .transition()
                    .attr("cx", function(data) {
                        return xBandScale(data[clickedAxis]);
                    })
                    .duration(1500);
            });

            d3.selectAll(".circle-text").each(function() {
                d3
                    .select(this)
                    .transition()
                    .attr("x", function(data) {
                        return xBandScale(data[clickedAxis]);
                    })
                    .duration(1800);
            });
            switch (clickedAxis) {
                case "medIncome":
                    currentXaxis = medIncome;
                    currentXtext = "Median Income: ";
                    tooltipping(currentXtext, currentYtext, medIncome, currentYaxis);
                    break;
                case 'educatedPerc':
                    currentXaxis = educatedPerc;
                    currentXtext = "Educated Percentage: ";
                    tooltipping(currentXtext, currentYtext,educatedPerc, currentYaxis);
                    break;
                case 'povertyLevel':
                    currentXaxis = povertyLevel;
                    currentXtext = "Poverty Level: ";
                    tooltipping(currentXtext, currentYtext,povertyLevel, currentYaxis);
                    break;
            }
            labelChange(clickedAxis);
            console.log(currentXaxis);
            console.log(currentYaxis);

        }
        
    })
    var blah = povertyLevel;
    var bloop = healthQuestion;
    tooltipping(currentXtext, currentYtext,povertyLevel, healthQuestion);

    function tooltipping(xtext, ytext, blah, bloop) {
        var toolTip = d3
            .tip()
            .attr("class", "tooltip")
            .offset([60, -10])
            .html(function(data, i) {
                var xValue = blah[i];
                var yValue = bloop[i];
                return xtext + xValue + " " + ytext + yValue;
            });

        // Call the tooltip function
        icircles.call(toolTip);
        icircles.on("mouseover", toolTip.show).on("mouseout", toolTip.hide);
        textcircles.call(toolTip);
        textcircles.on("mouseover", toolTip.show).on("mouseout", toolTip.hide);
        var iterateOnce = false;
        }

});



