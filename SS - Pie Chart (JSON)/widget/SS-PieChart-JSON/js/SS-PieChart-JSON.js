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

        chartConfig: ko.observable(),
        
        onLoad: function(widgetModel) {     

            widget = widgetModel;
           
            console.log("-- Loading " + widget.displayName() + "(" + widget.id() + ")");

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
                          enabled: true,
                          intersect: false
                        }                        
                    }
          }  
            widget.chartConfig(config);
        },
        
        beforeAppear: function(page) {
            var ctx = document.getElementById('canvas-'+ widget.id()).getContext('2d');
            if (widget.chartType() == 'Pie') {
                window.myPie = new Chart(ctx, widget.chartConfig());
            } else {
                window.myDoughnut = new Chart(ctx, widget.chartConfig());
            } 
        }
    };
  }
);