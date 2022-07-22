// --------------------------------------------------------------------------------// 
// SCENE ONE ----------------------------------------------------------------------//
// --------------------------------------------------------------------------------// 

// constants
var width = 900
var height = 900

var margin = { top: 10, right: 100, bottom: 50, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// axis definition
var x = d3.scaleBand()
    .domain([10, 20, 30, 40, 50])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, 120])
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(5);

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10);


var makes = ["Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
    "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Lamborghini",
    "Land Rover", "Lexus", "Lincoln", "Lotus", "Maserati", "Mazda", "McLaren Automotive", "Mercedes-Benz", "MINI", "Mitsubishi",
    "Nissan", "Porsche", "Ram", "Rolls-Royce", "Roush Performance", "smart", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"];

var highway_mpgs = ["35", "33", "19", "30", "22", "41", "27", "30", "29", "25", "24", "22", "103", "96", "24", "29", "38", "122",
    "30", "39", "27", "92", "21", "28", "30", "29", "24", "24", "34", "23", "82", "33", "102", "101", "27", "21", "19", "23", "39", "27",
    "98", "30", "28", "29"];

var city_mpgs = ["25", "24", "12", "23", "13", "30", "20", "22", "21", "16", "15", "16", "121", "118", "17", "21", "30", "150", "22",
    "30", "19", "120", "14", "22", "22", "23", "17", "16", "26", "16", "85", "24", "121", "124", "21", "14", "12", "14", "32", "21", "92",
    "23", "21", "22"];

var bar_tooltip = d3.select("body")
    .append("div")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "15px")
    .style("color", "white")


async function load_index() {
	var scene1 = d3.select('#scene1')
	
    d3.csv("https://flunky.github.io/cars2017.csv").then(function (data_given) {
		// axis appends
		scene1.append("g")
			.attr("transform", "translate(50,20)")
			.attr("class", "axis")
			.call(yAxis);

		// axis labels
		scene1.append('text')
			.attr('x', -500)
			.attr('y', 15)
			.attr('transform', 'rotate(-90)')
			.attr('text-anchor', 'middle')
			.text('Mileage')

		scene1.append('text')
			.attr('x', 500)
			.attr('y', 1050)
			.attr('text-anchor', 'middle')
			.text('Vehicles')
		

        var makeScale = d3.scaleBand()
            .range([0, width])
            .domain(data_given.map(function (d) { return d.Make; }))

        var makeAxis = d3.axisBottom()
            .scale(makeScale)
            .ticks(5);

        scene1.append("g")
            .attr("transform", "translate(50,950)")
            .attr("class", "axis")
            .call(makeAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-30)")
            .style("text-anchor", "end");

        scene1.selectAll("mybar")
            .data(data_given)
            .enter()
            .append("rect")
            .attr("x", function (d, i) { return margin.left + makeScale(makes[i]); })
            .attr("y", function (d, i) { return y(highway_mpgs[i]) + 10; })
            .attr("width", makeScale.bandwidth() - 10)
            .attr("height", function (d, i) { return height - y(highway_mpgs[i]); })
            .attr("fill", "#5E4FA2")
            .on("mouseout", function (d) {
                bar_tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    })
}

// This function is called by the buttons on top of the plot
function change(setting) {
    if (setting === "AverageHighwayMPG") {
        d3.selectAll("rect")
            .transition()
            .duration(2000)
            .attr("fill", "#5E4FA2")
            .attr("y", function (d, i) { return y(highway_mpgs[i]) + 10; })
            .attr("height", function (d, i) { return height - y(highway_mpgs[i]); })
    } else {
        d3.selectAll("rect")
            .transition()
            .duration(2000)
            .attr("fill", "#66C2A5")
            .attr("y", function (d, i) { return y(city_mpgs[i]) + 10; })
            .attr("height", function (d, i) { return height - y(city_mpgs[i]); })
    }
}


// --------------------------------------------------------------------------------// 
// SCENES TWO AND THREE -----------------------------------------------------------//
// --------------------------------------------------------------------------------//
 
function getGraphDimensions(pageEntry) {
    var tickValues = [];
    if (pageEntry == 1) {
        tickValues = [10, 15, 20, 30, 45];
    } else if (pageEntry == 2) {
        tickValues = [80, 95, 125, 150];
    }

    return {
        "minCity": pageEntry == 2 ? 80 : 10,
        "maxCity": pageEntry == 1 ? 45 : 150,
        "minHighway": pageEntry == 2 ? 70 : 10,
        "maxHighway": pageEntry == 1 ? 50 : 150,
        "tickValues": tickValues
    };
}

function processData(incoming, pageEntry) {

    let maxDimension = 400;
    let minMargin = 60;
    let dims = getGraphDimensions(pageEntry);

    var cityScale = d3.scaleLog([dims.minCity, dims.maxCity], [0, maxDimension]);
    var cityAxis = d3.axisBottom(cityScale).tickValues(dims.tickValues).tickFormat(d3.format("~s"));
    var highwayScale = d3.scaleLog([dims.minHighway, dims.maxHighway], [maxDimension, 0]);
    var highwayAxis = d3.axisLeft(highwayScale).tickValues(dims.tickValues).tickFormat(d3.format("~s"));

    var scene2 = d3.select("#scene2");

    // Chart
    scene2.append("g")
        .attr("transform", "translate(" + minMargin + ", " + minMargin + ")")
        .selectAll("circle")
        .data(incoming)
        .enter()
            .append("circle")
            .attr("cx", function(d, i) {
                return cityScale(Number(d.AverageCityMPG));
            })
            .attr("cy", function(d, i) {
                return highwayScale(Number(d.AverageHighwayMPG));
            })
            .attr("r", function(d, i) {
                return 5;
            })
            .attr("fill", function(d) {
                if (d.Fuel == "Electricity") {
                    return "green";
                } else if (d.Fuel == "Diesel") {
                    return "yellow";
                } else {
                    return "red";
                }
            })
            // Tooltip
            .on("mouseover", function(d, i) {
                getToolTipDiv()
                    .style("opacity", 1)
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY + 15) + "px")
                    .html(getToolTipText(d));
            })
            .on("mouseout", function() {
                getToolTipDiv()
                    .style("opacity", 0)
                    .html("");
            });

    // Title
    scene2.append("text")
        .attr("transform", "translate(" + (maxDimension - minMargin) / 2 + ", " + minMargin + ")")
        .text("2017 Model - Average MPG");

    // Y Axis
    scene2.append("g")
        .attr("id", "highwayAxis")
        .attr("transform", "translate(" + minMargin + ", " + minMargin + ")")
        .call(highwayAxis);

    scene2.append("text")
        .attr("transform", "translate(" + (minMargin / 2) + ", " + (maxDimension / 2 + minMargin) + ") rotate(-90)")
        .text("Highway");

    // X Axis
    scene2.append("g")
        .attr("id", "cityAxis")
        .attr("transform", "translate(" + minMargin + ", " + (maxDimension + minMargin) + ")")
        .call(cityAxis);

    scene2.append("text")
        .attr("transform", "translate(" + (maxDimension + minMargin) / 2 + ", " + (maxDimension + 1.6 * minMargin) + ")")
        .text("City");
		
	// Legend
	scene2.append("circle")
		//.attr("transform", "translate(" + (maxDimension - minMargin) / 2 + ", " + minMargin + ")")
		.attr("cx",(minMargin + 40)).attr("cy", minMargin + 40).attr("r", 6).style("fill", "red")
	scene2.append("circle")
		.attr("cx",(minMargin + 40)).attr("cy", minMargin + 60).attr("r", 6).style("fill", "yellow")
	scene2.append("circle")
		.attr("cx",(minMargin + 40)).attr("cy", minMargin + 80).attr("r", 6).style("fill", "green")
	scene2.append("text")
		.attr("x", (minMargin + 60)).attr("y", minMargin + 40).text("Gas").style("font-size", "15px").attr("alignment-baseline","middle")
	scene2.append("text")
		.attr("x", (minMargin + 60)).attr("y", minMargin + 60).text("Diesel").style("font-size", "15px").attr("alignment-baseline","middle")
	scene2.append("text")
		.attr("x", (minMargin + 60)).attr("y", minMargin + 80).text("Electric").style("font-size", "15px").attr("alignment-baseline","middle")
	
}

async function load_electric() {
	let data = await d3.csv("https://flunky.github.io/cars2017.csv");
	console.log(data);
	var processedData = data.filter(function(d) {
		return d.Fuel == "Electricity";
	});
	processData(processedData, 2);
}
async function load_gas() {
	let data = await d3.csv("https://flunky.github.io/cars2017.csv");
	console.log(data);
	var processedData = data.filter(function(d) {
		return d.Fuel != "Electricity";
	});
	processData(processedData, 1);
}
function getToolTipDiv() {
    return d3.selectAll("div").filter("#tooltip");
}

function getToolTipText(datum, shouldshowCylinders) {
    var cylinderText = datum.EngineCylinders == "0" ? "N/A" : datum.EngineCylinders;
    return "Maker: " + datum.Make + "<br/># Cylinders: " + cylinderText + "<br/>Highway Mileage: " + datum.AverageHighwayMPG + "<br/>City Mileage: " + datum.AverageCityMPG;
}

function getStyle(isEnabled) {
    if (isEnabled) {
        return "style='opacity=100";
    } else {
        return "style='opacity=0'";
    }
}