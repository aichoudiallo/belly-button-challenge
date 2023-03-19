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

        //bubble

        //gauge

    })
}