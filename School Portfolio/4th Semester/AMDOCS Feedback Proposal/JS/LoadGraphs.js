function Plot(bars_canvas, line_canvas, dounut_canvas) {
    var chart = new Chart(bars_canvas, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['HR', 'Engineering', 'Facilities', 'Operations', 'Other'],
            datasets: [{
                label: 'Historico de casos abiertos',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [20, 14, 23, 55, 69]
            }, {
                label: 'Historico de casos cerrados',
                backgroundColor: 'rgb(132, 99, 255)',
                borderColor: 'rgb(132, 99, 255)',
                data: [12, 10, 18, 11, 50]
            }]
        },

        // Configuration options go here
        options: {
            responsive: false,
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white'
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                        stepSize: 10,
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white",
                        stepSize: 1,
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    
    var chart = new Chart(line_canvas, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45]
            }]
        },

        // Configuration options go here
        options: {
            responsive: false,
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white'
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                        stepSize: 10,
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white",
                        stepSize: 1,
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    // #333147
    var chart = new Chart(dounut_canvas, {
        type: 'doughnut',
        data: {
            labels: [
                'Red',
                'Blue',
                'Yellow'
            ],
            datasets: [{
                label: 'My First Dataset',
                borderColor: "#333147",
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: false,
            legend: {
                labels: {
                    fontColor: 'white'
                }
            },
        }
    });
}

function SetCanvas() {
    var articleElement = document.getElementById("RelevantContent");
    let canvasSection = document.createElement("section");
    canvasSection.classList.add("dashbord");
        let bars_canvas = document.createElement("canvas");
            bars_canvas.width = "400";
            bars_canvas.height = "400";
        let line_canvas = document.createElement("canvas");
            line_canvas.width = "400";
            line_canvas.height = "400";
        let dounut_canvas = document.createElement("canvas");
            dounut_canvas.width = "400";
            dounut_canvas.height = "400";
    canvasSection.appendChild(bars_canvas);
    canvasSection.appendChild(line_canvas);
    canvasSection.appendChild(dounut_canvas);

    articleElement.appendChild(canvasSection);

    Plot(bars_canvas,line_canvas,dounut_canvas);
}