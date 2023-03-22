function main() {
    let selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        console.log(data);
        let sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector.append("option").text(sample).property("value", sample);
        })
        let firstName = sampleNames[0];
        demoCharts(firstName);
        charts(firstName);
    })
}
main();

function optionChanged(newName) {
    demoCharts(newName);
    charts(newName);
}

function demoCharts(sample) {
    d3.json("samples.json").then((data) => {
        let metaData = data.metadata;
        let metaArray = metaData.filter(sampleObj => sampleObj.id == sample);
        let metaResult = metaArray[0];

        let panel = d3.select("#sample-metadata");
        panel.html("");


        Object.entries(metaResult).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`)

        })


    })

}


function charts(sample) {
    d3.json("samples.json").then((data) => {
        let metaData = data.metadata;
        let metaArray = metaData.filter(sampleObj => sampleObj.id == sample);
        let metaResult = metaArray[0];
        let wfreq = metaResult.wfreq;

        let sampleData = data.samples;
        let sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);
        let sampleResult = sampleArray[0];

        let otu_ids = sampleResult.otu_ids;
        let otu_labels = sampleResult.otu_labels;
        let sample_values = sampleResult.sample_values;

        let yticks = otu_ids.slice(0, 10).reverse().map(otus => `OTU ${otus}`);

        var barData = [{
            type: 'bar',
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            // text:
            orientation: 'h'
        }];

        Plotly.newPlot('bar', barData);

        //bubble chart
        let bubbleChart = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            },
            text: otu_labels
        };

        let bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            xaxis: { title: 'OTU ID' },
            hovermode: 'closest',
            showlegend: false
        };

        let bubbleData = [bubbleChart];
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);


        //gauge chart

        let gaugeData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: "Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9] },
                    bar: { color: "darkblue" },
                    steps: [
                        { range: [0, 1], color: "rgba(255, 255, 255, 0.5)" },
                        { range: [1, 2], color: "rgba(232, 226, 202, 0.5)" },
                        { range: [2, 3], color: "rgba(210, 206, 145, 0.5)" },
                        { range: [3, 4], color: "rgba(202, 209, 95, 0.5)" },
                        { range: [4, 5], color: "rgba(170, 202, 42, 0.5)" },
                        { range: [5, 6], color: "rgba(110, 154, 22, 0.5)" },
                        { range: [6, 7], color: "rgba(14, 127, 0, 0.5)" },
                        { range: [7, 8], color: "rgba(0, 102, 0, 0.5)" },
                        { range: [8, 9], color: "rgba(0, 62, 0, 0.5)" }
                    ]
                }
            }
        ];

        let gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);



    })
}