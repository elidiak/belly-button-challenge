// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Convert sample to Int
    sampleNumber = parseInt(sample);

    // get the metadata field
    let metadata = data.metadata;
    console.log('I have the metadata');

    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(item => item.id === sampleNumber);

    console.log(`Sample number: ${sampleNumber}`);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataDiv = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataDiv.html('');
    console.log('metadata cleared');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    if (Array.isArray(result)) {
      result.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
          metadataDiv.append('p').text(`${key}: ${value}`);
        });
      });
    } else {
      console.log('result is not an array:');
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Convert sample to Int
    sampleNumber = parseInt(sample);

    // Get the samples field
    let sampleField = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleFiltered = sampleField.filter(item => item.id === sampleNumber);

    console.log(`Sample number: ${sampleNumber}`);

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sampleFiltered.otu_ids;
    let otuLabels = sampleFiltered.otu_labels;
    let sampleValues = sampleFiltered.sample_values;
    console.log('Variables completed');

    // Build a Bubble Chart
    let trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Viridis'
      }
    };

    let data1 = trace1;

    let layout1 = {
      title: 'Bacteria Cultures Per Sample',
      showLegend: false,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Value'}
    };

    console.log('Made it to the bubble chart');

    // Render the Bubble Chart
    Plotly.newPlot('bubble', data1, layout1);

    console.log('Made it to the Bar chart');

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sampleValues2 = sampleValues;

    let sortedValues = sampleValues2.sort((a,b)=>b-a);

    let top10Values = sortedValues.slice(0,10);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let trace2 = [{
      x: top10Values,
      y: otuIds,
      text: otuLabels,
      type: 'bar',
      orientation: 'h',
      marker: {
          color: 'steelblue'
      }
    }];

    let data2 = trace2;

    let layout2 = {
      title: 'Horizontal Bar Chart',
      xaxis: {
          title: 'Sample Values'
      },
      yaxis: {
          title: 'OTU IDs'
      }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', data2, layout2);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Select the <select> element
    let selectElement = d3.select("#selDataset");

    console.log('Element Selected');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    console.log('Start of foreach loop');

    // Using forEach not for as suggested by Copilot
    names.forEach(function(name) {
      selectElement.append("option")
          .attr("value", name)
          .attr("name", name) // Assuming you want to set the 'name' attribute as well
          .text(name);
  });
    // Get the first sample from the list
    let sample = names[0];

    console.log(sample);

    // Build charts and metadata panel with the first sample
    buildMetadata(sample);
    buildCharts(sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
