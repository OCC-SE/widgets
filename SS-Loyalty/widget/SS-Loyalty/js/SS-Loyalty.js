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
    function ($, ko, dataTables, CCConstants, ccRestClient, CCLogger) {

        "use strict";

        var ss_images;

        return {

            thisPercent: ko.observable(''),
            thisNeeded: ko.observable(''),

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                var ss_data = ss_settings.resourceData;
                ss_images = ss_settings.resourceImages;

                var thisPerc = widget.loyalPoints()/widget.nextTier();
                if (thisPerc <= 0) { //check for incorrect user input
                    thisPerc = .60;
                } else if (thisPerc >= 1) {
                    thisPerc = .60;
                }
                widget.thisPercent = parseFloat(thisPerc*100).toFixed(0)+"%";

                widget.thisNeeded = widget.nextTier() - widget.loyalPoints();

                widget.markerImage = ss_images + "/resources/loyaltymarker.png";

                if (widget.displayOrders()) {
                    //var user = widget.user();
                    //if (user.loggedIn()) {
                    $.ajax({
                        url: ss_data + "orders.txt",
                        dataType: 'json',
                        success: function(response) {
                            var dataSet = [];
                            for (var i=0; i<response.items.length; i++) {
                                var pts = Math.round(parseFloat(response.items[i].POTotal) * .02);
                                dataSet[i] = [response.items[i].Date,response.items[i].WebOrder,response.items[i].POTotal,'Purchase','+' + pts];
                            }
                            buildTable(dataSet);
                        },
                        error: function(jqXHR, textStatus, error) {
                            CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + textStatus + "-" + error);
                        }
                    });
                    /*
                    var data = {};
                    data["limit"] = 4;
                    data["sort"] = "creationDate:desc";

                    var errorCallback = function(response){
                        CCLogger.error("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" + response.errorCode + "-" + response.message);
                    };

                    var successCallback = function(response){
                        var dataSet = [];
                        for (var i=0; i<response.items.length; i++) {
                            var pts = Math.round(parseFloat(response.items[i].subTotal) * .02);
                            dataSet[i] = [response.items[i].creationDate,response.items[i].orderId,response.items[i].subTotal,'Purchase','+' + pts];
                        }
                        buildTable(dataSet);
                    }
                    ccRestClient.request(CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE , data, successCallback, errorCallback);
                    */
                    // } else {
                    //      CCLogger.warn("Widget: " + widget.displayName() + "-(" + widget.id() + ") - No user logged in");
                    // }
                }
                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            }
        };

        function buildTable(dataset) {
            var table = $('#loyalty-listing').DataTable( {
                paging:true,
                searching: false,
                lengthChange: false,
                pageLength: 3,
                data: dataset,
                order: [[ 0, "desc" ]],
                columnDefs: [
                    {title: "Date", targets: 0, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                    {title: "Order #", targets: 1, orderable: false},
                    {title: "Total", targets: 2, orderable: true, type: "num-fmt", render: $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                    {title: "Event", targets: 3, orderable: false},
                    {title: "Points", targets: 4, orderable: false}
                ],
                language: {
                    emptyTable: "No orders available"
                },
                destroy: true
            });
            return table;
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