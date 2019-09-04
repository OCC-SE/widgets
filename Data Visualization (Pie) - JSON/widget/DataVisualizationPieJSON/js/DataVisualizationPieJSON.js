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
    
    var widget;

    return {
        
        widgetId: ko.observable(''),
        widgetName: ko.observable(''),
        chartConfig: ko.observable(),
        
        onLoad: function(widgetModel) {     

            widget = widgetModel;
            widget.widgetName(widget.displayName());
            widget.widgetId(widget.id());
           
            console.log("-- Loading" + widget.widgetName() + "(" + widget.id() + ")");

            var jsonUrl = widget.jsonURL();
            var jsonData;
            var numberDatasets = 0;
            $.ajax({
              url: jsonUrl,
              dataType: 'json',
              async: false,
              success: function(data) {
                jsonData = data;
                for (var a in jsonData) {
                  numberDatasets++;
                }
              },
              error: function(data) {
                console.log(data);
              }
            });
            
            var labels = [];
            var colors = [];
            var values = [];
            for (var a in jsonData) {
              labels.push(jsonData[a].label);
              colors.push(jsonData[a].color);
              values.push(jsonData[a].value);
            }
            
            var dataset = {
              backgroundColor: colors,
              data: values,
              label: "Title"
            }
            var datasets = {
              datasets: [dataset],
              labels: labels
            };
     
            var config = {
                    type: widget.chartType().toLowerCase(),
                    data: datasets,
                    options: {
                        responsive: true,
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: widget.chartTitle()//"2nd title"//chartTitle
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        tooltips: {
                          enabled: false,
                          intersect: false
                        }                        
                    }
          }  
            widget.chartConfig(config);
        },
        
        beforeAppear: function(page) {
            
            Chart.defaults.global.tooltips.custom = function(tooltip) {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              // Hide if no tooltip
              if (tooltip.opacity === 0) {
                //tooltipEl.style.opacity = 0;
                tooltipEl.style.opacity = 1;
                return;
              }
            
              // Set Text
              if (tooltip.body) {
                var total = 0;
                // get the value of the datapoint
                var value = this._data.datasets[tooltip.dataPoints[0].datasetIndex].data[tooltip.dataPoints[0].index].toLocaleString();
                // calculate value of all datapoints
                this._data.datasets[tooltip.dataPoints[0].datasetIndex].data.forEach(function(e) {total += e;});
            
                // calculate percentage and set tooltip value
                //tooltipEl.innerHTML = '<h1>' + (value / total * 100) + '%</h1>';
                tooltipEl.innerHTML = '<h2>' + (value) + '</h2>';
              }
            
              // calculate position of tooltip
              var centerX = (this._chartInstance.chartArea.left + this._chartInstance.chartArea.right) / 2;
              var centerY = ((this._chartInstance.chartArea.top + this._chartInstance.chartArea.bottom) / 2);
            
              // Display, position, and set styles for font
              tooltipEl.style.opacity = 1;
              tooltipEl.style.left = centerX + 'px';
              tooltipEl.style.top = centerY + 'px';
              tooltipEl.style.fontFamily = tooltip._fontFamily;
              tooltipEl.style.fontSize = '16px';//tooltip.fontSize;
              tooltipEl.style.fontStyle = tooltip._fontStyle;
              //tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
            };            
                
            var ctx = document.getElementById('canvas-'+ widget.id()).getContext('2d');
            if (widget.chartType() == 'Pie') {
                window.myPie = new Chart(ctx, widget.chartConfig());
            } else {
                window.myDoughnut = new Chart(ctx, widget.chartConfig());
            } 
            console.log("-- Ending " + widget.widgetName() + "(" + widget.id() + ")");
        }
    };
  }
);