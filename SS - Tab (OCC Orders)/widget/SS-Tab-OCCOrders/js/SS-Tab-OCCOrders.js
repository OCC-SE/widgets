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

        function getConfig(tab) {
            var table = $('#listing').DataTable( {
                            "processing": true,
                            "data": widget.ordersDataset,
                            "columns": [
                                {"title": "Date", "data": "creationDate"}, { "title": "Order #", "data": "orderId"}, {"title": "Total", "data" : "total"}, {"title": "Status", "data" : "status" },
                                {"title": "", "data": "", "render": function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Details">';}},
                                {"title": "", "data": "", "render": function(data, type, row, meta) {return '<input class="cc-button-primary" type="button" value="Reorder">';}}
                            ],
                            "columnDefs": [
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
                            "language": {
                                "emptyTable": "No orders found"
                            },                            
                            destroy: true,
                            scrollX: true,
                            scrollCollapse: true                                 
                        });
            return table;                
        }

        var widget;
        var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";
        var tabTypes = ['Invoices','Orders','Repeat','Subscriptions','Leads','Customers','Opportunities','Install Base','Quotes'];
        var tabUsed = [];

        return {

            ordersDataset: ko.observable(),

            onLoad: function(widgetModel) {
                widget = widgetModel;
                
                //if (widget.useImages()) {
                widget.tabImage = widgetRepository + "images/master/" + widget.tabName().toLowerCase() + ".png";
                //}

                var data = {};
                data["sort"] = "creationDate:desc";
                var errorCallback = function(){
                    console.log("Error-" + widget.displayName() + "-(" + widget.id() + ")");
                };
                var successCallback = function(dataSet){
                    widget.ordersDataset=dataSet.items;
                }
                ccRestClient.request(CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE , data, successCallback, errorCallback);                

                console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {

                $(document).ready(function() {
                    var tab = widget.tabName();
                    if (!tabUsed.includes(tab)) {
                        $('#tab-'+ tab).on('click', function() {
                            if (!widget.useImages()) {
                                $("#tab-"+tab).attr('class', 'tablink-selected');
                                for (var b=0; b<tabTypes.length; b++) {
                                    if (tabTypes[b]!=tab) {
                                        $("#tab-"+tabTypes[b]).attr('class', 'tablink');
                                    }
                                }
                            } else {
                                $("#tab-"+tab).attr('class', 'imglink-selected');
                                for (var i=0; i<tabTypes.length; i++) {
                                    if (tabTypes[i]!=tab) {
                                        $("#tab-"+tabTypes[i]).attr('class', 'imglink');
                                    }
                                }
                            }
                            if ($.fn.DataTable.isDataTable('#listing')) {
                                $('#listing').DataTable().clear().destroy();
                                $('#listing').empty();
                            }                            
                            var table = getConfig(tab);
                        });
                        tabUsed.push(tab);
                    }
                });
            }
            
        };
    }
);