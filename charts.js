function drawChart(data) {

    const dataProcessedChart1 = processData(data, "chart1");
    setDataToChart(dataProcessedChart1, "chart1", "pie");

    const dataProcessedChart2 = processData(data, "chart2");
    setDataToChart(dataProcessedChart2, "chart2", "bar");

    const dataProcessedChart3 = processData(data, "chart3");
    setDataToChart(dataProcessedChart3, "chart3", "bar");

    const dataProcessedChart4 = processData(data, "chart4");
    setDataToChart(dataProcessedChart4, "chart4", "bar");

    const dataProcessedChart5 = processData(data, "chart5");
    setDataToChart(dataProcessedChart5, "chart5", "bar");

    const dataProcessedChart6 = processData(data, "chart6");
    setDataToChart(dataProcessedChart6, "chart6", "bar");

    const dataProcessedChart7 = processData(data, "chart7");
    setDataToChart(dataProcessedChart7, "chart7", "bar", "Energia electrica");

    const dataProcessedChart8 = processData(data, "chart8");
    setDataToChart(dataProcessedChart8, "chart8", "bar", "Acueducto");

    const dataProcessedChart9 = processData(data, "chart9");
    setDataToChart(dataProcessedChart9, "chart9", "bar", "Alcantarillado");

    const dataProcessedChart10 = processData(data, "chart10");
    setDataToChart(dataProcessedChart10, "chart10", "bar", "Recoleccion de basuras");

    const dataProcessedChart11 = processData(data, "chart11");
    setDataToChart(dataProcessedChart11, "chart11", "bar", "Gas natural conectado a red");

    const dataProcessedChart12 = processData(data, "chart12");
    setDataToChart(dataProcessedChart12, "chart12", "bar", "Internet");

    const dataProcessedChart13 = processData(data, "chart13");
    setDataToChart(dataProcessedChart13, "chart13", "bar", "Personas");

    const dataProcessedChart14 = processData(data, "chart14");
    setDataToChart(dataProcessedChart14, "chart14", "pie", "Personas");

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

function setDataToChart(dataProcessedChart, chartNumber, chartType, title = 'Viviendas'){
    // Get the context of the canvas element
    const ctx1 = document.getElementById(chartNumber).getContext('2d');

    // Create the chart
    const chartTab1 = new Chart(ctx1, {
        type: chartType,  // Change to 'line', 'pie', etc. for different charts
        data: {
            labels: dataProcessedChart.labels,
            datasets: [{
                label: title,
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