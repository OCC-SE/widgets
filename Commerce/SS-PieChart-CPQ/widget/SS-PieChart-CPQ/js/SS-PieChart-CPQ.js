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

            chartConfig: ko.observable(),
            chartHeading: ko.observable(''),

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                var ss_data = ss_settings.resourceData;

                widget.chartHeading(widget.chartTitle());

                var qUrl = widget.cpqURL();
                var qQuery = widget.cpqQuery();
                var qParams = widget.cpqParams();
                var qAuth = widget.cpqAuth();
                var url = qUrl + qQuery + qParams;

                //NEED DEMO URL and OWNER
                //var qUrl = 'https://cpq-20238.bigmachines.com/rest/v8/commerceDocumentsOraclecpqoTransaction'; //needs to be set
                //var qOwner = '?q={"owner_t": "Natalie Thompson"}'; //needs to be set
                //var qFields = '&fields=status_t';

                $.ajax({
                    url: url,
                    type: "GET",
                    async: true,
                    crossDomain: true,
                    dataType: 'json',
                    headers: {
                        "Authorization": qAuth,
                        "Accept": "*/*"
                    },
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
                            '{ "label":"Quoted" , "color":"rgb(30,144,255)", "value":' + sQuoted + '}' +
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

                        var dataset = {backgroundColor: colors, data: values, label: "Title"};

                        var datasets = {datasets:[dataset],labels:labels};

                        var config = {
                            type: widget.chartType().toLowerCase(),
                            data: datasets,
                            options: {
                                responsive: true,
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: false,
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
                    error: function(xhr, status, error) {
                        var errorMessage = xhr.status + ': ' + xhr.statusText;
                        var logMessage = "Widget: " + widget.displayName() + "-(" + widget.id() + ") - " + errorMessage;
                        CCLogger.error(logMessage);
                        //$('#SS-WidgetError').append(logMessage);
                    }
                });

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            }
        };
    });