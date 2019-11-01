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
        
        onLoad: function(widgetModel) {     

            var widget = widgetModel;
            
                $.ajax({
                    type: "GET",
                    async: true,
                    crossDomain: true,
                    headers: {
                        "Authorization": "Basic ZGF2aW5jaTpkYXZpbmNp",
                        "Accept": "*/*"
                    },                        
                    url: "https://cpq-20114.bigmachines.com/rest/v7/commerceDocumentsOraclecpqo_bmClone_1Transaction?fields=status_t,_id,transactionID_t,totalContractValue_t,_customer_t_company_name,createdDate_t,lastUpdatedDate_t",
                    success: function(response) {
                        var statusCount = [];
                        var sOrdered = 0;
                        var sCreated = 0;
                        var sQuoted = 0;
                        for (var i=0; i<response.items.length; i++) {
                          var s = response.items[i].status_t.displayValue;
                          if (s == 'Ordered') {
                              sOrdered++;
                          } else if (s == 'Created') {
                              sCreated++;
                          } else {
                              sQuoted++;
                          }
                        }
                        var text = '[' +
                        '{ "label":"Created" , "color":"rgb(144,103,167)", "value":' + sCreated + '},' +
                        '{ "label":"Ordered" , "color":"rgb(132,186,91)", "value":' + sOrdered + '},' +
                        '{ "label":"Quoted" , "color":"rgb(211,94,96)", "value":' + sQuoted + '}' +
                        ']';
                        var jsonData = JSON.parse(text);

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
                     
                        var ctx = document.getElementById('canvas-'+ widget.id()).getContext('2d');
                        if (widget.chartType() == 'Pie') {
                            window.myPie = new Chart(ctx, config);
                        } else {
                            window.myDoughnut = new Chart(ctx, config);
                        } 
                    },
                    error: function(jqXHR, textStatus, error) {
                        console.log('ERROR: ' + widget.displayName() + "-(" + widget.id() + ")-" + textStatus + "-" + error);
                    }
                });   
        },
        
        beforeAppear: function(page) {

        }
    };
  }
);