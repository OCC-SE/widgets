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

      chartConfig: ko.observable(),

      onLoad: function(widgetModel) {

        var widget = widgetModel;

        if (!widget.site().extensionSiteSettings.SelfServiceSettings) {
          CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Self-Service Settings not found");
          return;
        }

        var ss_settings = widget.site().extensionSiteSettings.SelfServiceSettings;
        var ss_data = ss_settings.resourceData;

        var jsonUrl = ss_data + widget.jsonURL();

        $.ajax({
          url: jsonUrl,
          dataType: 'json',
          async: false,
          success: function(data) {
            var labels = [];
            var colors = [];
            var values = [];
            for (var a in data) {
              labels.push(data[a].label);
              colors.push(data[a].color);
              values.push(data[a].value);
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

            var settings = {
              type: widget.chartType().toLowerCase(),
              data: datasets,
              options: {
                responsive: true,
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: widget.chartTitle() //"2nd title"//chartTitle
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

            widget.chartConfig(settings);
          },
          error: function(jqXHR, textStatus, error) {
            CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + textStatus + "-" + error);
          }
        });

        CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
      },

      beforeAppear: function(page) {
        var widget = this;
        var ctx = document.getElementById('canvas-' + widget.id()).getContext('2d');
        if (widget.chartType() == 'Pie') {
          window.myPie = new Chart(ctx, widget.chartConfig());
        } else {
          window.myDoughnut = new Chart(ctx, widget.chartConfig());
        }
      }
    };
  }
);
