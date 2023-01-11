const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function panelInfo(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let metadata = sampleData.metadata;
        let identifier = metadata.filter(sample =>
            sample.id.toString() === id)[0];
        let panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(identifier).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
    })
};



//Plotly horizontal bar and bubble bar
function Plots(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let samples = sampleData.samples;
        let identifier = samples.filter(sample => sample.id === id);
        let filtered = identifier[0];        
        let unit_values = filtered.sample_values.slice(0, 10).reverse();
        let unit_ids = filtered.otu_ids.slice(0, 10).reverse();
        let unit_labels = filtered.otu_labels.slice(0, 10).reverse();
        
        let Horizontal_trace = {
            x: unit_values,
            y: unit_ids.map(object => 'OTU ' + object),
            name: unit_labels,
            type: 'bar',
            text: unit_ids.map(String),
            textposition: 'auto',
            marker: {
                color: 'rgb(158,202,225)',
                opacity: 0.6,
                line: {
                    color: 'rgb(8,48,107)',
                    width: 1.5
                }
            },
            orientation: 'h'
        };
        let Horizontal_layout = {
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };
        let H_bar_data = [Horizontal_trace];
        Plotly.newPlot('bar', H_bar_data, Horizontal_layout);

        //start of bubble bar
        let bubble_trace = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: 'markers',
            marker: {
                size: filtered.sample_values,
                color: filtered.otu_ids,
                colorscale: 'Electric'
            },
            text: filtered.otu_labels,
        };
        let bubbleData = [bubble_trace];
        let bubble_layout = {
            xaxis: {title: 'ID'},
            yaxis: {title: 'values'}
        };

        Plotly.newPlot('bubble', bubbleData, bubble_layout);


    })
};

//gauge function
        //Bonus 'gauge' plot
function Plot(id) {
    d3.json(url).then(function (data) {
        let metadata = data.metadata;
        let gaugeArray = metadata.filter(metaObj => metaObj.id == sample);
        let gaugeResult = gaugeArray[0];
        let wash = gaugeResult.wfreq;

        let gauge_trace =  [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wash,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number"
            }
        ];
        let gauge_data = [gauge_trace];
        let gauge_layout = {
            width: 600, height: 500, margin: { t: 0, b: 0 } 
        };
        Plotly.newPlot('myDiv', gauge_data, gauge_layout)
    })
};

//Build new upon ID change
function optionChanged(id) {
    Plots(id);
    panelInfo(id);
};

//Test Subject Dropdown and initial function
function init() {
    let dropDown = d3.select('#selDataset');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        panelInfo(names[0]);
        Plots(names[0])
    })
};
init();