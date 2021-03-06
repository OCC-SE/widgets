/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://www.chartjs.org/dist/2.8.0/Chart.min.js', 'https://www.chartjs.org/samples/latest/utils.js', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, Chart, utils, CCLogger) {

        "use strict";

        return {

            chartDatasets: ko.observable(),
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

                var jsonData;

                $.ajax({
                    url: ss_data + widget.jsonURL(),
                    dataType: 'json',
                    async: false,
                    success: function(result) {
                        jsonData = result;
                    },
                    error: function(jqXHR, textStatus, error) {
                        CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + textStatus + "-" + error);
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
                        bgColors.push('rgb(211,94,96)');
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

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {
                var widget = this;
                var ctx = document.getElementById('canvas-' + widget.id()).getContext('2d');
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
                                display: false,
                                text: widget.chartTitle()
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        callback: function(value, index, values) {
                                            return '$' + value;
                                        }
                                    }
                                }]
                            }
                        }
                    });
                } else {
                    window.myHorizontalBar = new Chart(ctx, {
                        type: 'horizontalBar',
                        data: widget.chartDatasets(),
                        options: {
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
                                display: false,
                                text: widget.chartTitle()
                            }
                        }
                    });
                }
            }
        };
    }
);
