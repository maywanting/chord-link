let svg = d3.select("#chart").append("svg").attr("width", 1000).attr("height", 1000);


function transPosition(r, angle) {
    let rx = Math.sin(angle) * r;
    let ry = 0 - Math.cos(angle) * r;
    return {"x" : rx, "y" : ry};
}
function drawPath(output, input, group) {
    let p_a = transPosition(95, output.startAngle);
    let p_b = transPosition(95 * 0.94, input.endAngle);
    let p_e = transPosition(95 * 0.96, (input.startAngle+input.endAngle) / 2.0);
    let p_c = transPosition(95 * 0.94, input.startAngle);
    let p_d = transPosition(95, output.endAngle);

    let MA = "M" + p_a.x + "," + p_a.y;
    let QAB = " Q0,0" + p_b.x + "," + p_b.y;
    let LBE = " L" + p_e.x + "," + p_e.y;
    let LEC = " L" + p_c.x + "," + p_c.y;
    // let ABC = " A94,94,0,0,0," + p_c.x + "," + p_c.y;
    let QCD = " Q0,0" + p_d.x + "," + p_d.y;
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
        [0, 0, 4, 0, 1],
        [0, 0, 5, 2, 0],
    ]
};
createChord(dataset1);
createChord(dataset2);
