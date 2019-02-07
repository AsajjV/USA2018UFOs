function buildMetadata(sample) {
    var url = `/metadata/${sample}`; //this url says, "look here for ___ sample number"
    console.log(url);
  
    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(url).then(function(response) { //give me the jsonified data for the url above
      console.log(response);
  
      metaData = [response];
      console.log(metaData);

      // Use d3 to select the panel with id of `#sample-metadata`
      samplePanel = d3.select("#sample-metadata")
      // Use `.html("") to clear any existing metadata
      samplePanel.html(""); //replace the last displayed data before putting in new data below.

      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      metaData.forEach((selectSample) => {

      Object.entries(selectSample).forEach(([key, value]) => {
        var row = samplePanel.append("tr");
        row.text(key + ": " + value);
      })
    })
  })
}

     


function buildCharts(sample) {
  var graphUrl = `/samples/${sample}`; //this url says, "look here for ___ sample number"
    console.log(graphUrl);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(graphUrl).then(function(response) { //give me the jsonified data for the url above
    console.log(response);

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: "markers",
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      }

    };
    var bubbleTrace = [trace1]
    var layout = {
      sort: true,
      xaxis: {
        title: {
          text:"OTU IDs"}
        },
      yaxis: {
        title: {
          text:"Sample Values"}
        },
      title: "Belly Button Biome",
      
      };

    Plotly.newPlot("bubble", bubbleTrace, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    response.sample_values.sort(function compareFunction(firstNum, secondNum) {
        return secondNum - firstNum;
      });
  
    var trace2 = {
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      type: "pie",
      sort: true,
      text: response.otu_labels.slice(0,10)
     };

    var pieData = [trace2];

    var layout1 = {
      title: "Top 10 Samples"
    }

    Plotly.newPlot("pie", pieData, layout1);

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
