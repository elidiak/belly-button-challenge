// URL of the JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
 
// Function to initialize the dashboard
function init() {
    // Select the dropdown menu
    let dropMenu = d3.select("#selDataset");
 
    // Fetch the JSON data
    d3.json(url).then((data) => {
        // Extract sample names
        let sampleNames = data.names;
 
        // Populate the dropdown menu with sample names
        sampleNames.forEach((sample) => {
            dropMenu.append("option")
                .text(sample)
                .property("value", sample);
        });
 
        // Use the first sample to build initial plots
        let firstSample = sampleNames[0];
        buildMetadata(firstSample);
        buildBarChart(firstSample);
        buildBubbleChart(firstSample);
    });
}
 
// Function to build the metadata panel
function buildMetadata(sample) {
    d3.json(url).then((data) => {
        // Filter metadata for the selected sample
        let metadata = data.metadata;
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];
 
        // Select the metadata panel
        let panel = d3.select("#sample-metadata");
 
        // Clear existing metadata
        panel.html("");
 
        // Add each key-value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}
 
// Function to build the bar chart
function buildBarChart(sample) {
    d3.json(url).then((data) => {
        // Filter sample data for the selected sample
        let samples = data.samples;
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];
 
        // Extract the top 10 OTUs
        let otu_ids = result.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        let sample_values = result.sample_values.slice(0, 10).reverse();
        let otu_labels = result.otu_labels.slice(0, 10).reverse();
 
        // Create the trace for the bar chart
        let trace = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };
 
        // Define the layout
        let layout = {
            title: "Top 10 OTUs Found",
            margin: { t: 30, l: 150 }
        };
 
        // Plot the bar chart
        Plotly.newPlot("bar", [trace], layout);
    });
}
 
// Function to build the bubble chart
function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        // Filter sample data for the selected sample
        let samples = data.samples;
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];
 
        // Create the trace for the bubble chart
        let trace = {
            x: result.otu_ids,
            y: result.sample_values,
            text: result.otu_labels,
            mode: "markers",
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: "Earth"
            }
        };
 
        // Define the layout
        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };
 
        // Plot the bubble chart
        Plotly.newPlot("bubble", [trace], layout);
    });
}
 
// Function to handle changes in the dropdown selection
function optionChanged(newSample) {
    // Update all plots when a new sample is selected
    buildMetadata(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);
}
 
// Initialize the dashboard
init();