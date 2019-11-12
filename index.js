let svg = d3.select("#chart").append("svg").attr("width", 1000).attr("height", 1000);

// load data

let getFile = {
    resData : [],
    getData : function() {
        let url = 'cluster1_normal.json';
        return fetch(url).then(response => response.json()).then(jsonData => {
            this.resData = jsonData;
        });
    },
};

function transPosition(r, angle, x = 0, y = 0) {
    let rx = Math.sin(angle) * r + x;
    let ry = 0 - Math.cos(angle) * r + y;
    return {"x" : rx, "y" : ry};
}
function gainDivideAngle(weight, startAngle, endAngle) {
    //reset pie function: setting startAngle and endAngle.
    let pieFunction = d3.layout.pie().sort(null)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .padAngle(0.03)
        .value(function(d) {return d;});

    return pieFunction(weight);
}

function drawPath(output, input, group) {
    let p_a = transPosition(65, output.startAngle);
    let p_b = transPosition(65 * 0.94, input.endAngle);
    let p_e = transPosition(65 * 0.96, (input.startAngle+input.endAngle) / 2.0);
    let p_c = transPosition(65 * 0.94, input.startAngle);
    let p_d = transPosition(65, output.endAngle);

    let MA = "M" + p_a.x + "," + p_a.y;
    let QAB = " Q0,0," + p_b.x + "," + p_b.y;
    let LBE = " L" + p_e.x + "," + p_e.y;
    let LEC = " L" + p_c.x + "," + p_c.y;
    // let ABC = " A94,94,0,0,0," + p_c.x + "," + p_c.y;
    let QCD = " Q0,0," + p_d.x + "," + p_d.y;
    let ADA = " A64,64,0,0,0," + p_a.x + "," + p_a.y;

    let pathDetail = MA + QAB + LBE + LEC + QCD + ADA;

    group.append("g").attr("class", "transition")
        .append("path").attr("d", pathDetail).attr("fill", "blue");
}

function createChord(dataset) {
    //block分配
    let arc = d3.svg.arc()
        .innerRadius(65)
        .outerRadius(70)
        .cornerRadius(3)
        .padAngle(0.01);

    //d3里面的pie函数可以根据比例自动计算角度分配
    let pieFunction = d3.layout.pie().sort(null)
        .value(function(d) {return d;});

    let weight = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
        weight[i] = dataset.weight[i][0] + dataset.weight[i][1];
    }
    let pie = pieFunction(weight); //calculate the block

    // set chord as a group and move to the center
    let group = svg.append("g").attr("transform", "translate(" + (dataset.x + 100) + "," + (dataset.y + 100) + ")");

    let arcs = group.selectAll(".arc")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "arc");

    //display the block
    arcs.append("path")
        .attr("d", arc);

    let blocks = [];
    for (let i = 0; i < 5; i++) {
        let input = dataset.relationship[i];
        let output = [];
        for (let j = 0; j < 5; j++) {
            output.push(dataset.relationship[j][i]);
        }
        let mainAngle = gainDivideAngle(dataset.weight[i], pie[i].startAngle, pie[i].endAngle);
        let inputAngle = gainDivideAngle(input, mainAngle[0].startAngle, mainAngle[0].endAngle);
        let outputAngle = gainDivideAngle(output, mainAngle[1].startAngle, mainAngle[1].endAngle);
        blocks.push({
            'input' : inputAngle,
            'output': outputAngle
        });
    }
    // console.log(dataset.relationship);
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (dataset.relationship[i][j] != 0) {

                drawPath(blocks[i].input[j], blocks[j].output[i], group);
            }
        }
    }
    return pie;
}

(async function() {
    await getFile.getData();
    let originData = getFile.resData;

    let nodeTransitionList = [originData.labels[0]];
    for (let i = 1; i < originData.labels.length; i++) {
        if (originData.labels[i] != originData.labels[i-1]) {
            nodeTransitionList += [originData.labels[i]];
        }
    }

    let nodeTransition = [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
    ];

    let blockTransition = [
        [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]],
        [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]],
        [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]],
        [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]],
        [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]],
    ];

    //nodeTransition calculation
    for (let i = 1; i < nodeTransitionList.length; i++) {
        nodeTransition[nodeTransitionList[i-1]][nodeTransitionList[i]] += 1;
    }

    //blockTransition calculation
    for (let i = 1; i < nodeTransitionList.length - 1; i++) {
        blockTransition[nodeTransitionList[i]][nodeTransitionList[i-1]][nodeTransitionList[i+1]] += 1;
    }

    // console.log(blockTransition);
    let datasets = [];
    let chords = [];
    for (let i = 0; i < 5; i++) {
        let dataset = {
            "x" : originData.centers[i][0],
            "y" : originData.centers[i][1],
            "weight" : [[0,0], [0,0], [0,0], [0,0], [0,0]],
            "relationship": blockTransition[i],
        }

        for (let j = 0; j < 5; j++) {
            for (let k = 0; k < 5; k++ ) {
                dataset.weight[j][0] += blockTransition[i][j][k];
                dataset.weight[k][1] += blockTransition[i][j][k];
            }
        }
        datasets.push(dataset);
        chords.push(createChord(dataset));
    }

    console.log(nodeTransition);
    for (let i = 0; i < 5; i++) {
        let output = nodeTransition[i];
        let input = [];
        for (let j = 0; j < 5; j++) {
            input.push(nodeTransition[j][i]);
        }
        let mainNode = gainDivideAngle()
    }
})();
