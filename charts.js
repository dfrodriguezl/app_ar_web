function drawChart(data) {

    const dataProcessedChart1 = processData(data, "chart1");
    setDataToChart(dataProcessedChart1, "chart1", "pie");

    const dataProcessedChart2 = processData(data, "chart2");
    setDataToChart(dataProcessedChart2, "chart2", "bar");

    const dataProcessedChart3 = processData(data, "chart3");
    setDataToChart(dataProcessedChart3, "chart3", "bar");

    const dataProcessedChart4 = processData(data, "chart4");
    setDataToChart(dataProcessedChart4, "chart4", "bar");

}

function processData(data, chartNumber) {

    let dataChart = {};
    dataChart[chartNumber] = data[chartNumber];

    let labels = [];
    let values = [];

    Object.keys(dataChart[chartNumber]).forEach(key => {
        values.push(dataChart[chartNumber][key]["valor"] | 0);
        labels.push(dataChart[chartNumber][key]["etiqueta"]);
    });

    return {
        "labels": labels,
        "values": values
    }
}

function setDataToChart(dataProcessedChart, chartNumber, chartType){
    // Get the context of the canvas element
    const ctx1 = document.getElementById(chartNumber).getContext('2d');

    // Create the chart
    const chartTab1 = new Chart(ctx1, {
        type: chartType,  // Change to 'line', 'pie', etc. for different charts
        data: {
            labels: dataProcessedChart.labels,
            datasets: [{
                label: 'Viviendas',
                data: dataProcessedChart.values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        // options: {
        //     scales: {
        //         y: {
        //             beginAtZero: true
        //         }
        //     }
        // }
    });
}