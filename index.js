let svg = d3.select("#chart").append("svg").attr("width", 1000).attr("height", 1000);

let dataset1 = {
    "x" : 100,
    "y" : 100,
    "weight": [3, 2, 4, 5, 6],
    "relationship": [
        [0, 2, 0, 3, 0],
        [3, 0, 0, 10, 3],
        [0, 3, 8, 8, 0],
        [0, 0, 4, 0, 1],
        [0, 0, 5, 2, 0],
    ]
};

let arc = d3.svg.arc()
    .innerRadius(95)
    .outerRadius(100)
    .cornerRadius(8)
    // .endAngle(Math.PI *0.5)
    .padAngle(0.01);

let pieFunction = d3.layout.pie()
    // .startAngle(0)
    // .endAngle(Math.PI*2)
    .value(function(d) {return d;});

let pie = pieFunction(dataset1.weight);
// console.log(pie([2, 1, 4]));
let group = svg.append("g").attr("transform", "translate(" + dataset1.x + "," + dataset1.y + ")");

// let test = group.append("path").attr("d", "M184.9832,-2.4957 a185,185,0,0,1,-78.4208,153.7222 Q0,0 49.633,-178.2177 a185,185,0,0,1,125.4603,118.4907 Q0,0 184.9832,-2.4957");
let arcs = group.selectAll(".arc")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "arc");

console.log(pie);
arcs.append("path")
    .attr("d", arc);

let pie0 = pie[0];
let pie1 = pie[1];

// let temp = dataset1.relationship[0].append(dataset1.relationship[1]);
// console.log(temp);
let block0 = [].concat(dataset1.relationship[0], dataset1.relationship[1]);
let block1 = [].concat(dataset1.relationship[1], dataset1.relationship[1]);

let pieFunction0 = d3.layout.pie()
    .startAngle(pie[0].startAngle)
    .endAngle(pie[0].endAngle)
    .value(function(d) {return d;});

let pieFunction1 = d3.layout.pie()
    .startAngle(pie[1].startAngle)
    .endAngle(pie[1].endAngle)
    .value(function(d) {return d;});

let path0s = pieFunction0(block0);
let path1s = pieFunction1(block1);
// console.log(pieFunction0(block0));

let path0 = d3.svg.arc()
    .innerRadius(80)
    .outerRadius(90)
    .cornerRadius(2)
    // .endAngle(Math.PI *0.5)
    .padAngle(0.01);

let path0s = group.selectAll(".path")
    .data(path1s)
    .enter()
    .append("g")
    .attr("class", "path");

path0s.append("path")
    .attr("d", path0);
