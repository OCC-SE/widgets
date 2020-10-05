/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js','ccConstants', 'ccRestClient', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, dataTables, CCConstants, ccRestClient, CCLogger) {

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

                var settings = {};
                settings["sort"] = "creationDate:desc";

                var errorCallback = function(response){
                    widget.tabTotal(0);
                    widget.tabDisplay(widget.tabTitle() + ' (0)');
                    CCLogger.error("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabTitle() + "-" + textStatus + "-" + error);
                };

                var statusFulfilled = [];
                var statusPendingQuote = [];
                var statusPendingApproval = [];
                var statusPendingPayment = [];
                var statusQuoted = [];
                var statusSubmitted = [];
                var successCallback = function(result){
                    /*for (var i=0; i < response.items.length; i++) {
                        var s = response.items[i].state;
                        if (s == 'NO_PENDING_ACTION') {
                            statusFulfilled.push(response.items[i]);
                        } else if (s == 'PENDING_QUOTE') {
                            statusPendingQuote.push(response.items[i]);
                        } else if (s == 'PENDING_PAYMENT') {
                            statusPendingPayment.push(response.items[i]);
                        } else if (s == 'PENDING_APPROVAL_TEMPLATE') {
                            statusPendingApproval.push(response.items[i]);
                        } else if (s == 'QUOTED') {
                            statusQuoted.push(response.items[i]);
                        } else if (s == 'SUBMITTED') {
                            statusSubmitted.push(response.items[i]);
                        } else if (s == 'PENDING_APPROVAL') {
                            statusPendingApproval.push(response.items[i]);
                        }
                    }*/
                    widget.tabData(result);
                    widget.tabTotal(result.items.length);
                    widget.tabDisplay(widget.tabTitle() + ' (' + result.items.length + ')');

                    if (widget.defaultTab()) {
                        $('[id^=tab-]').attr('class', 'imglink'); //Set inactive tab(s) CSS
                        $('#tab-' + widget.id()).attr('class', 'imglink-selected'); //Set active tab CSS
                        if ($.fn.DataTable.isDataTable('#listing')) { //Empty out previous table
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }
                        $('#SS-DataTables').html('<table id="listing" class="display compact" style="width:100%;margin-bottom:15px;"></table>');
                        buildTable(widget);
                    }
                }
                ccRestClient.request(CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE , settings, successCallback, errorCallback);

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" +  widget.tabTitle());
            },

            beforeAppear: function(page) {
                var widget = this;
                $('#tab-' + widget.id()).on('click', function() {
                    $('[id^=tab-]').attr('class', 'imglink'); //Set inactive tab(s) CSS
                    $('#tab-' + widget.id()).attr('class', 'imglink-selected'); //Set active tab CSS
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
                data: widget.tabData().items,
                order: [[ 0, "desc" ]],
                columns: [
                    {data: "creationDate"},
                    {data: "orderId"},
                    {data: "total"},
                    {data: "status"}
                ],
                columnDefs: [
                    {title: "Date", targets: 0, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                    {title: "Order #", targets: 1, orderable: false},
                    {title: "Total", targets: 2, orderable: true, type: "num-fmt", render: $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                    {title: "Status", targets: 3, orderable: false},
                    {title: " ", targets: 4, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}},
                    {title: " ", targets: 5, orderable: false, render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">';}}
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