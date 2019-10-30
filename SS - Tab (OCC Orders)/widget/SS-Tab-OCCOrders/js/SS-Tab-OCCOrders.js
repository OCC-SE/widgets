/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js','ccConstants', 'ccRestClient'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, dataTables, CCConstants, ccRestClient) {

        "use strict";

        function getConfig(tab,widget) {
            var table = $('#listing').DataTable( {
                            processing: true,
                            data: widget.ordersDataset,
                            columns: [
                                {"title": "Date", "data": "creationDate"}, { "title": "Order #", "data": "orderId"}, {"title": "Total", "data" : "total"}, {"title": "Status", "data" : "status" },
                                {"title": "", "data": "", "render": function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">';}},
                                {"title": "", "data": "", "render": function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}}
                            ],
                            columnDefs: [
                                {"targets": 0, "type": "date", "render": function (value) {
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
                                {"type": "num-fmt", "targets": 2, "render": $.fn.dataTable.render.number( ',', '.', 2, '$' )},
                                {"targets": [3,4,5],"orderable": false},  
                            ],
                            language: {
                                "emptyTable": "No orders found"
                            },                            
                            destroy: true
                            //scrollX: true,
                            //scrollCollapse: true                                 
                        });
            return table;                
        }

        var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";
        var tabTypes = ['Invoices','Orders','Repeat','Subscriptions','Leads','Customers','Opportunities','Install Base','Quotes'];
        var tabUsed = [];

        return {

            tabTotal: ko.observable(),
            tabDisplay: ko.observable(''),
            ordersDataset: ko.observable(),

            onLoad: function(widgetModel) {
                var widget = widgetModel;
                
                var tab = widget.tabName();
                
                widget.tabImage = widgetRepository + "images/master/" + widget.tabName().toLowerCase() + ".png";
                
                var settings = {};
                settings["sort"] = "creationDate:desc";
                var errorCallback = function(response){
                    console.log("ERROR: " + widget.displayName() + "-(" + widget.id() + ")-" + response.errorCode + "-" + response.message);
                    widget.tabTotal(0);
                    widget.tabDisplay(tab + ' (0)');
                };
                var successCallback = function(response){
                    widget.ordersDataset=response.items;
                    widget.tabTotal(response.total);
                    widget.tabDisplay(tab + ' (' + response.total + ')');   
                }
                ccRestClient.request(CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE , settings, successCallback, errorCallback);                

                console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {
                var widget = this;
                $(document).ready(function() {
                    var tab = widget.tabName();
                    if (!tabUsed.includes(tab)) {
                        $('#tab-'+ tab).on('click', function() {
                            $("#tab-"+tab).attr('class', 'imglink-selected');
                            for (var i=0; i<tabTypes.length; i++) {
                                if (tabTypes[i]!=tab) {
                                    $("#tab-"+tabTypes[i]).attr('class', 'imglink');
                                }
                            }
                            if ($.fn.DataTable.isDataTable('#listing')) {
                                $('#listing').DataTable().clear().destroy();
                                $('#listing').empty();
                            }                            
                            getConfig(tab,widget);
                        });
                        tabUsed.push(tab);
                    }
                });
            }
            
        };
    }
);