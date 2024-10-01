// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(item => item.sampleNumber === sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataDiv = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataDiv.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    result.foreach(obj => {
      Object.entries(obj).forEach(([key,value]) => {
        metadataDiv.append('p').text(`${key}: ${value}`);
      });
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleField = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleFiltered = sampleField[sample];

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sampleFiltered.otu_ids;
    let otuLabels = sampleFiltered.otu_labels;
    let sampleValues = sampleFiltered.sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
          size: sampleValues,
          color: otuIds
      }
    };
    let data = trace1;

    let layout = {
      title: 'Bacteria Cultures Per Sample',
      showLegend: false
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble-chart', data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    data = [{
      type: 'bar',
      x: values,
      y: otuLabels,
      orientation: 'h',
      marker: {
          color: 'steelblue'
      }
    }];

    layout = {
      title: 'Horizontal Bar Chart',
      xaxis: {
          title: 'Values'
      },
      yaxis: {
          title: 'OTU Labels'
      }
    };

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart
    Plotly.newPlot('chart', data, layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    // Select the <select> element
    var selectElement = d3.select("#selDataset");

    // Get the selected option
    var selectedOption = selectElement.select("option[value='" + value + "']");
    
    // Get the 'name' attribute of the selected option
    var nameValue = selectedOption.attr("name");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    let names = data.names;

    // Using forEach not for as suggested by Copilot
    names.forEach(function(name) {
      selectElement.append("option")
          .attr("value", name)
          .attr("name", name) // Assuming you want to set the 'name' attribute as well
          .text(name);
  });
    // Get the first sample from the list
    let sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(sample);
    buildCharts(sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

}

// Initialize the dashboard
init();
