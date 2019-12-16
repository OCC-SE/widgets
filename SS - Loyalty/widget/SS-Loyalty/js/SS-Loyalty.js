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
    
    function buildTable(dataset) {
            var table = $('#loyalty-listing').DataTable( {
                        paging:false,
                        ordering: false,
                        info: false,
                        searching: false,
                        data: dataset,
                        columns: [
                            {"title": "Date"}, 
                            {"title": "Order ID"},
                            {"title": "Total"},
                            {"title": "Event"},
                            {"title": "Points"},
                        ],
                        columnDefs: [
                            {targets: 0, 
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
                            {type: "num-fmt", targets: 2, render: $.fn.dataTable.render.number( ',', '.', 2, '$' ) },
                        ],
                        language: {
                            emptyTable: "No orders available"
                        },
                        destroy: true
        });     
        return table;
    }
    
    var widgetRepository;// = "https://raw.githubusercontent.com/OCC-SE/";

    return {

        thisPercent: ko.observable(''),
        thisNeeded: ko.observable(''),

        onLoad: function(widgetModel) {                             
            
            var widget = widgetModel;
            
            var ss_settings = widget.site().extensionSiteSettings.SelfServiceSettings;
            widgetRepository = ss_settings.resources;

            var thisPerc = widget.loyalPoints()/widget.nextTier();
            if (thisPerc <= 0) { //check for incorrect user input
                thisPerc = .60;
            } else if (thisPerc >= 1) {
                thisPerc = .60;
            }
            widget.thisPercent = parseFloat(thisPerc*100).toFixed(0)+"%";
            
            widget.thisNeeded = widget.nextTier() - widget.loyalPoints();
            
            widget.markerImage = widgetRepository + "images/master/resources/loyaltymarker.png";

            if (widget.displayOrders()) {
                var user = widget.user();
                if (user.loggedIn()) {
                    var data = {};
                    data["limit"] = 4;
                    data["sort"] = "creationDate:desc";
    
                    var errorCallback = function(response){
                        console.log("ERROR: " + widget.displayName() + "-(" + widget.id() + ")-" + response.errorCode + "-" + response.message);
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
                } else {
                    CCLogger.warn(widget.displayName() + "-(" + widget.id() + ") - No user logged in");
                }
            }   
            //console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            CCLogger.info("Loading " + widget.displayName() + "-(" + widget.id() + ")");
        },
    };
  }
);