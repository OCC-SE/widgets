/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, dataTables, CCLogger) {

        "use strict";

        var ss_images;
        var ss_data;

        return {

            tabTotal: ko.observable(0),
            tabDisplay: ko.observable('Loading...'),
            tabData: ko.observable(),

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                ss_data = ss_settings.resourceData;
                ss_images = ss_settings.resourceImages;

                if (!widget.tabTitle()) {
                    CCLogger.error("Widget: " + widget.displayName() + "-(" + widget.id() + ") - Widget configuration empty (Hint: Open and save)");
                    return;
                }

                widget.tabImage = ss_images + "tabs/" + widget.tabImage().toLowerCase();

                $.ajax({
                    type: 'GET',
                    async: true,
                    url: '/ccstorex/custom/v1/erpOrderHistory',
                    dataType: 'json',
                    success: function(result) {
                        widget.tabData(result);
                        widget.tabTotal(result.orders.length);
                        widget.tabDisplay(widget.tabTitle() + ' (' + result.orders.length + ')');

                        for (var i = 0; i < result.orders.length; i++) {
                            if (result.orders[i].Alert == 'true') { //Any alert column set to true
                                $('#alert-' + widget.id()).attr('src', ss_images + 'tables/alert.png');
                                $('#alertimage').attr('src', ss_images + 'resources/alert_one.png');
                                $('#alertimage').attr('alt', 'Attention needed');
                            }
                        }

                        if (widget.defaultTab()) {
                            $('[id^=tab-]').attr('class', 'imglink'); //Set inactive tab(s) CSS
                            $('#tab-' + widget.tabTitle() + '-' + widget.id()).attr('class', 'imglink-selected'); //Set active tab CSS
                            if ($.fn.DataTable.isDataTable('#listing')) { //Empty out previous table
                                $('#listing').DataTable().clear().destroy();
                                $('#listing').empty();
                            }
                            $('#SS-DataTables').html('<table id="listing" class="display compact" style="width:100%;margin-bottom:15px;"></table>');
                            buildTable(widget);
                        }
                    },
                    error: function(jqXHR, textStatus, error) {
                        widget.tabTotal(0);
                        widget.tabDisplay(widget.tabTitle() + ' (0)');
                        CCLogger.error("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabTitle() + "-" + textStatus + "-" + error);
                    }
                });

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabTitle());
            },

            beforeAppear: function(page) {
                var widget = this;
                var tab = widget.tabTitle();
                $('#tab-' + tab + '-' + widget.id()).on('click', function() {
                    $('[id^=tab-]').attr('class', 'imglink'); //Set inactive tab(s) CSS
                    $('#tab-' + tab + '-' + widget.id()).attr('class', 'imglink-selected'); //Set active tab CSS
                    if ($.fn.DataTable.isDataTable('#listing')) { //Empty out previous table
                        $('#listing').DataTable().clear().destroy();
                        $('#listing').empty();
                    }
                    $('#SS-DataTables').html('<table id="listing" class="display compact" style="width:100%;margin-bottom:15px;"></table>');
                    buildTable(widget);
                });
            }
        };

        function buildTable(widget) {
            $('#listing').DataTable( {
                data: widget.tabData().orders,
                order: [[ 0, "desc" ]],
                columns: [
                    {data: "submittedDate"},
                    {data: "x_extOrderId"},
                    {data: "id"},
                    {data: "total"},
                    {data: "PONumber"},
                    {data: "state"}
                ],
                columnDefs: [
                    {title: "submittedDate", targets: 0, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                    {title: "x_extOrderId", targets: 1, orderable: false},
                    {title: "id", targets: 2, orderable: false},
                    {title: "total", targets: 3, orderable: false, type: "num-fmt", render: $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                    {title: "PONumber", targets: 4, orderable: true},
                    {title: "state", targets: 5, orderable: false},
                    {title: " ", targets: 6, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}},
                    {title: " ", targets: 7, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">';}}
                ],
                language: {emptyTable: 'No ' + widget.tabTitle() + ' found'},
                lengthChange: false,
                pageLength: 5,
                destroy: true
            });
        }

        function formatDate(value) {
            if (value === null) return "";

            function addZero(i) {if (i < 10) {i = "0" + i;}return i;}

            var mydate = new Date(value);
            var yyyy = mydate.getFullYear().toString();
            var mm = addZero((mydate.getMonth() + 1).toString()); // getMonth() is zero-based
            var dd = addZero(mydate.getDate().toString());
            var h = mydate.getHours();
            var ap = "AM";
            if (h > 12) {
                h -= 12;
                ap = "PM";
            } else if (h === 0) {
                h = 12;
            }
            var m = mydate.getMinutes();
            var parts;
            if (m <= 0) {
                parts = mm + '/' + dd + '/' + yyyy;
            } else {
                parts = mm + '/' + dd + '/' + yyyy + ' ' + addZero(h) + ':' + addZero(m) + ' ' + ap;
            }
            var mydatestr = new Date(parts);
            return parts;
        }
    }
);