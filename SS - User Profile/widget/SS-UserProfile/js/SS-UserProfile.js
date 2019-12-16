/**
 * @fileoverview
 *
 * @author
 */
define( 
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'ccConstants', 'ccRestClient', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function ($, ko, CCConstants, ccRestClient, CCLogger) {

    "use strict";
    
    //var widgetRepository;// = "https://raw.githubusercontent.com/OCC-SE/";
    var ss_data;
    var ss_images;
    
    /*
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
    */
    function formatDate(value) {
        if (value === null) return "";
        var mydate = new Date(value);
        var yyyy = mydate.getFullYear().toString();
        var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based   
        var dd = mydate.getDate().toString();
        var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
        var mydatestr = new Date(parts);                                                                        
        return mydatestr.toLocaleDateString();             
    }

    return {

        userImage: ko.observable(''),
        firstVisit: ko.observable(''),
        lastTrans: ko.observable(),
        userRole: ko.observable(''),
        userPhone: ko.observable(''),
        userPurchLimit: ko.observable(0),
        userCustType: ko.observable('Enteprise'),
        userCostCenter: ko.observable(''),
        userBusUnit: ko.observable(''),
        userRoles: ko.observable(''),
        userTotal: ko.observable(0),
        userAvailCredit: ko.observable(0),
        
        onLoad: function(widgetModel) {                             
            
            var widget = widgetModel;

            var ss_settings = widget.site().extensionSiteSettings.SelfServiceSettings;
            //widgetRepository = ss_settings.resources;
            //ss_data = ss_settings.resourceData;
            ss_images = ss_settings.resourceImages;

            widget.userRole = widget.userType();

            var user = widget.user();
            if (user.loggedIn()) {
                
                //widget.userImage = widgetRepository + "images/master/users/" + user.firstName().toLowerCase() + ".jpg";
                widget.userImage = ss_images + "/users/" + user.firstName().toLowerCase() + ".jpg";
                
                if (user.firstName() == 'Wendy') { //phone number not found in profile so hard coded
                    widget.userPhone('555-555-1234');
                    widget.lastTrans('5/31/2019');
                } else {
                    widget.userPhone('555-555-5678');
                    widget.lastTrans('6/3/2019');
                }                
                
                var data = {};
                data["sort"] = "creationDate:desc"; 
                
                if (widget.userType() == 'Buyer') {
                    //total spend over 6 months
                    widget.userPurchLimit(formatter.format(user.orderPurchaseLimit()));
                    //if (user.currentOrganizationDetails().customerType() !== null) {
                    //    widget.userCustType(user.currentOrganizationDetails().customerType());
                    //}
                    widget.userCustType('Enterprise');
                    widget.userCostCenter(user.currentOrganizationDetails().name());
                    widget.userBusUnit(user.currentOrganizationDetails().derivedDescription());
                    //widget.userRoles = user.currentOrganizationDetails().relativeRoles();
                    //widget.userAvailCredit(formatter.format(15000));
                    widget.userAvailCredit(15000);
                    
                    //var data = {};
                    data["limit"] = 6;
                    //data["sort"] = "creationDate:desc";
                    //data["fields"] = "total";
    
                    var errorCallback = function(response){
                        //console.log("ERROR: " + widget.displayName() + "-(" + widget.id() + ")-" + response.errorCode + "-" + response.message);
                        CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + response.errorCode + "-" + response.message);
                    };
                    
                    var total = 0;
                    var successCallback = function(response){
                        for (var i = 0; i < response.items.length; i++) {
                            total = total + response.items[i].total;
                        }
                        //widget.userTotal(formatter.format(total));
                        widget.userTotal(total);
                    }
                    ccRestClient.request(CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE , data, successCallback, errorCallback);       

                //} else if (widget.userType() == 'Customer') {
                } else { //DEFAULT TO CUSTOMER UNTIL SALES REP COMPLETE

                    //MIGHT NEED TO COMBINE LOYALTY AND CUSTOMER. MULTIPLE CALLS FOR ORDERS IS NOT WORKING
                    
                    //Get last order date
                    //var data = {};
                //    data["limit"] = 1;
                    //data["sort"] = "creationDate:desc";
                    //data["fields"] = "total";
    
                //    var errorCallback = function(response){
                //        console.log("ERROR: " + widget.displayName() + "-(" + widget.id() + ")-" + response.errorCode + "-" + response.message);
                //    };
                    
                //    var successCallback = function(response){
                //        for (var i = 0; i < response.items.length; i++) {
                //            widget.lastTrans(formatDate(response.items[i].creationDate));
                //        }
                //    }
                //    ccRestClient.request(CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE , data, successCallback, errorCallback);                         
                    
                    //widget.lastTrans('10-23-2019');
                    widget.firstVisit(user.firstVisitDate().substring(0, 4));
                }

            } else {
                //console.log("No user logged in");
                CCLogger.warn(widget.displayName() + "-(" + widget.id() + ") - No user logged in");
            }
            
            //console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
            CCLogger.info("Loading " + widget.displayName() + "-(" + widget.id() + ")");
        }
    };
  }
);