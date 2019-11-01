/**
 * @fileoverview
 *
 * @author
 */
define( 
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://www.chartjs.org/dist/2.8.0/Chart.min.js','https://www.chartjs.org/samples/latest/utils.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function ($, ko, Chart, utils) {

    "use strict";
    
    return {

        chartDatasets: ko.observable(),
        
        onLoad: function(widgetModel) {                             
            var widget = widgetModel;
           

            var jsonUrl = widget.chartData();
            var jsonData;

              $.ajax({
                url: jsonUrl,
                dataType: 'json',
                async: false,
                success: function(response) {
                  jsonData = response;
                },
                error: function(response) {
                  console.log(response);
                }
              });
            
              function getXValues() {
                var xValues = [];
                for (var a in jsonData) {
                  if (a == 0) {
                    for (var b = 0; b < jsonData[a].values.length; b++) {
                      xValues.push(jsonData[a].values[b].x);
                    }
                  }
                }
                return xValues;
              }
              
              function getColors(i) {
                  var bgColors = [];
                  if (i == 0) {
                        bgColors.push(widget.datasetColor1());
                  } else if (i == 1) {
                        bgColors.push(widget.datasetColor1());
                        bgColors.push(widget.datasetColor2());
                  } else {
                        bgColors.push(widget.datasetColor1());
                        bgColors.push(widget.datasetColor2());
                        bgColors.push(widget.datasetColor3());
                  }                  
                  return bgColors;
              }
              
              function getDatasets() {
                var dataset = [];
                var datasets = [];
                for (var a in jsonData) {
                  var yValues = [];
                  for (var b = 0; b < jsonData[a].values.length; b++) {
                    yValues.push(jsonData[a].values[b].y);
                  }
                  dataset = {
                    backgroundColor: getColors(a)[a], //TODO
                    borderColor: getColors(a)[a], //TODO
                    borderWidth: 1,
                    data: yValues,
                    label: jsonData[a].label
                  }
                  datasets.push(dataset);
                }
                return datasets;
              }
            
              var fullDatasets = {
                labels: getXValues(),
                datasets: getDatasets()
              }
              widget.chartDatasets(fullDatasets);
        },
        
        beforeAppear: function(page) {
        	var widget = this;
            var ctx = document.getElementById('canvas-'+ widget.id()).getContext('2d');
            if (widget.chartType() == 'Vertical') {
                window.myBar = new Chart(ctx, {
                    type: 'bar',
                    data: widget.chartDatasets(),
                    options: {
                        responsive: true,
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: widget.chartTitle()
                        }
                    }
                });
            } else {
                window.myHorizontalBar = new Chart(ctx, {
                    type: 'horizontalBar',
                    data: widget.chartDatasets(),
                    options: {
                    // Elements options apply to all of the options unless overridden in a dataset
                    // In this case, we are setting the border of each horizontal bar to be 2px wide
                        elements: {
                            rectangle: {
                                borderWidth: 2,
                            }
                        },
                        responsive: true,
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: widget.chartTitle()
                        }
                    }
                });
            } 
            console.log("-- Ending " + widget.displayName() + "(" + widget.id() + ")");
        }
    };
  }
);