let svg = d3.select("#chart").append("svg").attr("width", 1000).attr("height", 1000);


function transPosition(r, angle, x = 0, y = 0) {
    let rx = Math.sin(angle) * r + x;
    let ry = 0 - Math.cos(angle) * r + y;
    return {"x" : rx, "y" : ry};
}
function drawPath(output, input, group) {
    let p_a = transPosition(95, output.startAngle);
    let p_b = transPosition(95 * 0.94, input.endAngle);
    let p_e = transPosition(95 * 0.96, (input.startAngle+input.endAngle) / 2.0);
    let p_c = transPosition(95 * 0.94, input.startAngle);
    let p_d = transPosition(95, output.endAngle);

    let MA = "M" + p_a.x + "," + p_a.y;
    let QAB = " Q0,0," + p_b.x + "," + p_b.y;
    let LBE = " L" + p_e.x + "," + p_e.y;
    let LEC = " L" + p_c.x + "," + p_c.y;
    // let ABC = " A94,94,0,0,0," + p_c.x + "," + p_c.y;
    let QCD = " Q0,0," + p_d.x + "," + p_d.y;
    let ADA = " A94,94,0,0,0," + p_a.x + "," + p_a.y;

    let pathDetail = MA + QAB + LBE + LEC + QCD + ADA;

    group.append("g").attr("class", "transition")
        .append("path").attr("d", pathDetail).attr("fill", "blue");
}
function createChord(dataset) {
    //block分配
    let arc = d3.svg.arc()
        .innerRadius(95)
        .outerRadius(100)
        .cornerRadius(8)
        .padAngle(0.01);

    //d3里面的pie函数可以根据比例自动计算角度分配
    let pieFunction = d3.layout.pie()
        .value(function(d) {return d;});

    let pie = pieFunction(dataset.weight); //calculate the block

    // set chord as a group and move to the center
    let group = svg.append("g").attr("transform", "translate(" + dataset.x + "," + dataset.y + ")");

    let arcs = group.selectAll(".arc")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "arc");

    //display the block
    arcs.append("path")
        .attr("d", arc);
        //each block need to be divided for control input and output
    let pie0 = pie[0]; //block1 info.
    let pie1 = pie[1]; //block2 info.

    let block0 = [].concat(dataset.relationship[0], dataset.relationship[1]); //block1 divided. setting!!!!
    let block1 = [].concat(dataset.relationship[1], dataset.relationship[1]); //block2 divided. setting!!!

    //reset pie function: setting startAngle and endAngle.
    let pieFunction0 = d3.layout.pie()
        .startAngle(pie[0].startAngle)
        .endAngle(pie[0].endAngle)
        .value(function(d) {return d;});

    let pieFunction1 = d3.layout.pie()
        .startAngle(pie[1].startAngle)
        .endAngle(pie[1].endAngle)
        .value(function(d) {return d;});

    let data0 = pieFunction0(block0); //gain input and output angle
    let data1 = pieFunction1(block1);

    let path0 = d3.svg.arc()
        .innerRadius(30)
        .outerRadius(90)
        .cornerRadius(2)
    // .endAngle(Math.PI *0.5)
        .padAngle(0.01);


    //极坐标转笛卡尔坐标系
    console.log(data0);
    console.log(data1);

    //data1[0] -> data0[1]

    let output = data1[0];
    let input = data0[1];


    drawPath(output, input, group);
    drawPath(data0[3], data0[9], group);

    return pie;
}
// group.append("path").attr("d", pathDetail);

let dataset1 = {
    "x" : 200,
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

let dataset2 = {
    "x" : 300,
    "y" : 400,
    "weight": [3, 2, 5],
    "relationship": [
        [0, 3, 8, 8, 0],
        [1, 1, 4, 0, 1],
        [0, 0, 5, 2, 0],
    ]
};
let chord1 = createChord(dataset1);
let chord2 = createChord(dataset2);

console.log(chord1);

function calculateArcP (x1, y1, x2, y2, x3, y3) {
    let x = x1 + x3 - x2;
    let y = y1 + y3 - y2;
    return {"x": x, "y": y};
}
//chord1[0] -> chord2[1];
let link1 = svg.append("g");

let output = chord1[3];
let input = chord2[1];

let A1 = transPosition(100, output.endAngle, dataset1.x, dataset1.y);
let B1 = transPosition(100, output.startAngle, dataset1.x, dataset1.y);
let C1 = transPosition(100, (output.startAngle + output.endAngle) / 2.0, dataset1.x, dataset1.y);
let D1 = transPosition(100 * 1.5, (output.startAngle + output.endAngle) / 2.0, dataset1.x, dataset1.y);

let C2 = transPosition(100, ( input.startAngle + input.endAngle) / 2.0, dataset2.x, dataset2.y);
let D2 = transPosition(100 * 1.5,  ( input.startAngle + input.endAngle) / 2.0, dataset2.x, dataset2.y);

let MC1 = "M" + C1.x + "," + C1.y;
let CC1C2 = " C" + D1.x + "," + D1.y + "," + D2.x + "," + D2.y + "," + C2.x + "," + C2.y;
let path = MC1 + CC1C2;
// let C2 = calculateArcP(A1.x, A1.y, D1.x, D1.y, C1.x, C1.y);
// let C3 = calculateArcP(B1.x, B1.y, D1.x, D1.y, C1.x, C1.y);


// let A2 = transPosition(100 * 1.1, input.endAngle, dataset2.x, dataset2.y);
// let B2 = transPosition(100 * 1.1, input.startAngle, dataset2.x, dataset2.y);
// let D2 = transPosition(100, ( input.startAngle + input.endAngle) / 2.0, dataset2.x, dataset2.y);
// let E1 = transPosition(100 * 2,  ( input.startAngle + input.endAngle) / 2.0, dataset2.x, dataset2.y);
// let E2 = calculateArcP(A2.x, A2.y, D2.x, D2.y, E1.x, E1.y);
// let E3 = calculateArcP(B2.x, B2.y, D2.x, D2.y, E1.x, E1.y);

// let MA1 = "M" + A1.x + "," + A1.y;
// let CA1A2 = " C" + C2.x + "," + C2.y + "," + E2.x + "," + E2.y + "," + A2.x + "," + A2.y;
// let LA2D2 = " L" + D2.x + "," + D2.y;
// let LD2B2 = " L" + B2.x + "," + B2.y;
// let CB2B1 = " C" + E3.x + "," + E3.y + "," + C3.x + "," + C3.y + "," + B1.x + "," + B2.y;
// let AB1A1 = " L" + A1.x + "," + A1.y;
// // let AB1A1 = " A100,100,0,0,1," + A1.x + "," + A1.y;

// let path = MA1 + CA1A2 + LA2D2 + LD2B2 + CB2B1 + AB1A1;
link1.append("g").attr("class", "link")
    .append("path").attr("d", path).attr("stroke", "green"). attr("fill", "none");
