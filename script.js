// var screenWidth = $(window).width(),
	// mobileScreen = (screenWidth > 400 ? false : true);

// var margin = {left: 50, top: 10, right: 50, bottom: 10},
	// width = Math.min(screenWidth, 800) - margin.left - margin.right,
	// height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;
var svg = d3.select("#chart").append("svg")
    .attr("width", 1000)
    .attr("height", 1000);
			// .attr("width", (width + margin.left + margin.right))
			// .attr("height", (height + margin.top + margin.bottom));
let x = 100;
let y = 50;
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + '500' + "," + '500' + ")");;

var outerRadius = 100,
	innerRadius = outerRadius * 0.95,
	pullOutSize = 50,
	opacityDefault = 0.7, //default opacity of chords
	opacityLow = 0.02; //hover opacity of those chords not hovered over

var Names = ["X","Y","Z","","C","B","A",""];

var respondents = 95, //Total number of respondents (i.e. the number that makes up the total group)
	emptyPerc = 0.4, //What % of the circle should become empty
	emptyStroke = Math.round(respondents*emptyPerc);
var matrix = [
	[0,0,0,0,10,5,15,0], //X
	[0,0,0,0,5,15,20,0], //Y
	[0,0,0,0,15,5,5,0], //Z
	[0,0,0,0,0,0,0,emptyStroke], //Dummy stroke
	[10,5,15,0,0,0,0,0], //C
	[5,15,5,0,0,0,0,0], //B
	[15,20,5,0,0,0,0,0], //A
	[0,0,0,emptyStroke,0,0,0,0] //Dummy stroke
];

var offset = (2 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/4;

function customSort(a,b) {
	return 1;
};

var chord = customChordLayout() //d3.layout.chord()//Custom sort function of the chords to keep them in the original order
	.padding(.02)
	.matrix(matrix);

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
    .endAngle(endAngle);

var path = stretchedChord()
    .radius(innerRadius)
    .startAngle(startAngle)
    .endAngle(endAngle)
    // .pullOutSize(pullOutSize);

var g = wrapper.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", fade(opacityLow))
	.on("mouseout", fade(opacityDefault));

g.append("path")
	.style("stroke", function(d,i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
	.style("fill", function(d,i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
	.style("pointer-events", function(d,i) { return (Names[i] === "" ? "none" : "auto"); })
	.attr("d", arc)
	// .attr("transform", function(d, i) { //Pull the two slices apart
				// d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
				// return "translate(" + d.pullOutSize + ',' + 0 + ")";
	// });

// g.append("text")
	// .each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	// .attr("dy", ".35em")
	// .attr("class", "titles")
	// .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	// .attr("transform", function(d,i) {
		// var c = arc.centroid(d);
		// return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		// + "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		// + "translate(" + 55 + ",0)"
		// + (d.angle > Math.PI ? "rotate(180)" : "")
	// })
  // .text(function(d,i) { return Names[i]; });

var chords = wrapper.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", "none")
	.style("fill", "#C4C4C4")
	.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
	.style("pointer-events", function(d,i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
	.attr("d", path);
//Arcs
// g.append("title")
	// .text(function(d, i) {return Math.round(d.value) + " people in " + Names[i];});

//Chords
// chords.append("title")
	// .text(function(d) {
		// return [Math.round(d.source.value), " people from ", Names[d.target.index], " to ", Names[d.source.index]].join("");
	// });


//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(d, i) {
	svg.selectAll("path.chord")
		.filter(function(d) { return d.source.index !== i && d.target.index !== i && Names[d.source.index] !== ""; })
		.transition("fadeOnArc")
		.style("opacity", opacity);
  };
}//fade
