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

        function buildTable(tab,widget) {
            var table = $('#listing').DataTable( {
                            order: [[ 0, "desc" ]],
                            processing: true,
                            data: widget.tabData(),
                            columns: [
                                {title: "Date", data: "creationDate"}, 
                                {title: "Order #", data: "orderId"}, 
                                {title: "Total", data : "total"}, 
                                {title: "Status", data : "status" },
                                {title: "", data: "", render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">';}},
                                {title: "", data: "", render: function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}}
                            ],
                            columnDefs: [
                                {
                                targets: 0, 
                                type: "date", 
                                render: function (value) {
                                            if (value === null) return "";
                                            var mydate = new Date(value);
                                            var yyyy = mydate.getFullYear().toString();
                                            var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based   
                                            var dd = mydate.getDate().toString();
                                            var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
                                            var mydatestr = new Date(parts);                                                                        
                                            return mydatestr.toLocaleDateString();             
                                        }
                                },
                                {type: "num-fmt", targets: 2, render: $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                                {targets: [3,4,5],orderable: false},  
                            ],
                            language: {
                                emptyTable: "No orders found"
                            },                            
                            destroy: true
                            //scrollX: true,
                            //scrollCollapse: true                                 
                        });
            return table;                
        }

        var tabUsed = [];
        var ss_images;
        var ss_data;
        
        return {

            tabNameTrim: ko.observable('Loading'),
            tabTotal: ko.observable(0),
            tabDisplay: ko.observable('Loading...'),
            tabData: ko.observable(),

            onLoad: function(widgetModel) {

                var widget = widgetModel;
                
                if (!widget.site().extensionSiteSettings.SelfServiceSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Self-Service Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.SelfServiceSettings;
                ss_data = ss_settings.resourceData;
                ss_images = ss_settings.resourceImages;

                if (!widget.tabName()) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Widget configuration empty (Hint: Open and save)");
                    return;
                } 
                
                var tab = widget.tabName();
                var tabTrim = tab; //widget.tabName().replace(' ','');

                widget.tabNameTrim(tabTrim);
                widget.tabImage = ss_images + "/tabs/" + tabTrim.toLowerCase() + ".png";
                
                //Create the tab collection
                tabUsed.push(tab);
                
                var settings = {};
                settings["sort"] = "creationDate:desc";
                
                var errorCallback = function(response){
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + tab + "-" + response.errorCode + "-" + response.message);
                    widget.tabTotal(0);
                    widget.tabDisplay(tab + ' (0)');
                };
                
                var statusFulfilled = [];
                var statusPendingQuote = [];
                var statusPendingApproval = [];
                var statusPendingPayment = [];
                var statusQuoted = [];
                var statusSubmitted = [];
                var successCallback = function(response){
                 //   console.log(response.items);
                    for (var i=0; i < response.items.length; i++) {
                //        console.log(response.items[i].state);    
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
                    }
                //    console.log(statusFulfilled);
                //    console.log(statusPendingQuote);
                //    console.log(statusPendingApproval);
                //    console.log(statusPendingPayment);
                    widget.tabData(response.items);
                    widget.tabTotal(response.total);
                    widget.tabDisplay(tab + ' (' + response.total + ')');   
                }
                ccRestClient.request(CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE , settings, successCallback, errorCallback);                

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" + tab);
            },

            beforeAppear: function(page) {
                var widget = this;
                var tab = widget.tabName();
                if (tabUsed.includes(tab)) {
                    $('#tab-' + tab + '-' + widget.id()).on('click', function() {
                        $('[id^=tab-]').attr('class', 'imglink');
                        $('#tab-' + tab + '-' + widget.id()).attr('class', 'imglink-selected');
                        if ($.fn.DataTable.isDataTable('#listing')) {
                            $('#listing').DataTable().clear().destroy();
                            $('#listing').empty();
                        }      
                        buildTable(tab,widget);
                    });
                }
            }
        };
    }
);