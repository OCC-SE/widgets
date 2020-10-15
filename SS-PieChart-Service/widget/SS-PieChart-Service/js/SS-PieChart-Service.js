/**
 * @fileoverview
 *
 * @author
 */
define( 
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://www.chartjs.org/dist/2.8.0/Chart.min.js','https://www.chartjs.org/samples/latest/utils.js', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function ($, ko, Chart, utils, CCLogger) {

    "use strict";
    
    return {
        
        onLoad: function(widgetModel) {     

            var widget = widgetModel;

            if (!widget.site().extensionSiteSettings.SelfServiceSettings) {
                CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Self-Service Settings not found");
                return;
            }

            var ss_settings = widget.site().extensionSiteSettings.SelfServiceSettings;
            var ss_data = ss_settings.resourceData;
                
            //NEED DEMO URL and OWNER
            var qAuth = 'Basic bmF0YWxpZS50aG9tcHNvbjpUV0M3ODY3Mw==';
            var qUrl = 'https://ucf1-zhpe-fa-ext.oracledemos.com/crmRestApi/resources/latest/serviceRequests/';
            var qOwner = '';//'?q=PrimaryContactPartyName=Lisa Lauber';
            var qFields = '?fields=StatusCdMeaning';
            
                $.ajax({
                    type: "GET",
                    async: true,
                    crossDomain: true,
                    headers: {
                        "Authorization": qAuth,
                        "Accept": "*/*"
                    },                        
                    url: qUrl + qOwner + qFields,
                    success: function(response) {
                        var statusCount = [];
                        var sResolved = 0;
                        var sWaiting = 0;
                        var sInProgress = 0;
                        var sNew = 0;
                        for (var i=0; i<response.items.length; i++) {
                          var s = response.items[i].StatusCdMeaning;
                          if (s == 'Resolved') {
                              sResolved++;
                          } else if (s == 'Waiting') {
                              sWaiting++;
                          } else if (s == 'New') {
                              sNew++;
                          } else {
                              sInProgress++;
                          }
                        }
                        var text = '[' +
                        '{ "label":"Resolved" , "color":"rgb(144,103,167)", "value":' + sResolved + '},' +
                        '{ "label":"Waiting" , "color":"rgb(132,186,91)", "value":' + sWaiting + '},' +
                        '{ "label":"In Progress" , "color":"rgb(30,144,255)", "value":' + sInProgress + '},' +
                        '{ "label":"New" , "color":"rgb(236,107,86)", "value":' + sNew + '}' +
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
                        CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + textStatus + "-" + error);
                    }
                });   

          CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
        }
    };
  }
);