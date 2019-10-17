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
    function ($, ko, dataTables, CCConstants, ccRestClient) {

    "use strict";
    
    var widget;
    var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";

    return {

        thisPercent: ko.observable(''),
        thisNeeded: ko.observable(''),
        ordersDataset: ko.observable(''),

        onLoad: function(widgetModel) {                             
            widget = widgetModel;

            var thisPerc = widget.loyalPoints()/widget.nextTier();
            if (thisPerc <= 0) { //check for incorrect user input
                thisPerc = .60;
            } else if (thisPerc >= 100) {
                thisPerc = .60;
            }
            widget.thisPercent = parseFloat(thisPerc*100).toFixed(0)+"%";
            
            widget.thisNeeded = widget.nextTier() - widget.loyalPoints();
            
            widget.markerImage = widgetRepository + "images/master/" + "loyalty_marker.png";

            if (widget.displayOrders()) {
                var data = {};
                data["limit"] = 3;
                data["sort"] = "creationDate:desc";

                var errorCallback = function(){
                    console.log("errorCallback")
                };
                var successCallback = function(response){
                    var dataSet = [];
                    for (var i=0; i<response.items.length; i++) {
                        var pts = Math.round(parseFloat(response.items[i].subTotal) * .02);
                        dataSet[i] = [response.items[i].creationDate,response.items[i].orderId,response.items[i].subTotal,'Purchase','+' + pts];
                    }        
                    widget.ordersDataset=dataSet;

                    var table = $('#loyalty-listing').DataTable( {
                        "paging":false,
                        "ordering": false,
                        "info": false,
                        "searching": false,
                        "data": widget.ordersDataset,
                        "columns": [
                            {"title": "Date"}, 
                            {"title": "Order ID"},
                            {"title": "Total"},
                            {"title": "Event"},
                            {"title": "Points"},
                        ],
                        "columnDefs": [
                            {"targets": 0, 
                            "type": "date", 
                            "render": function (value) {
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
                            { "type": "num-fmt", "targets": 2, "render": $.fn.dataTable.render.number( ',', '.', 2, '$' ) },
                        ],
                        "language": {
                            "emptyTable": "No orders available"
                        },
                        destroy: true
                    });                      
                }
                ccRestClient.request(CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE , data, successCallback, errorCallback);
            }   
            console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
        },
    };
  }
);