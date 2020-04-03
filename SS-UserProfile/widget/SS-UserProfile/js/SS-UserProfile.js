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

        var ss_data;
        var ss_images;
        var pn;
        var oecURL;
        var oecAuth;

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

        function getGreeting() {
            var myDate = new Date();
            var hrs = myDate.getHours();
            var greet;
            if (hrs < 12) {
                greet = 'Good morning, ';
            } else if (hrs >= 12 && hrs <= 17) {
                greet = 'Good afternoon, ';
            } else if (hrs >= 17 && hrs <= 24) {
                greet = 'Good evening, ';
            }
            return greet;
        }

        return {

            userImage: ko.observable(''),
            firstVisit: ko.observable(''),
            lastTrans: ko.observable(),
            userFirstName: ko.observable('Bill'),
            userLastName: ko.observable('Smith'),
            userJobTitle: ko.observable(''),
            userEmailAddress: ko.observable(''),
            userPartyNumber: ko.observable(''),
            userAccountName: ko.observable(''),
            userStatus: ko.observable(''),
            userRank: ko.observable(''),
            userRole: ko.observable(''),
            userPhone: ko.observable('515-222-1212'),
            userPurchLimit: ko.observable(0),
            userCustType: ko.observable('Enteprise'),
            userCostCenter: ko.observable(''),
            userBusUnit: ko.observable(''),
            userRoles: ko.observable(''),
            userTotal: ko.observable(0),
            userAvailCredit: ko.observable(''),
            images: ko.observable(''),
            //vinNumber: ko.observable(),
            userGreeting: ko.observable(''),

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                ss_data = ss_settings.resourceData;
                ss_images = ss_settings.resourceImages;

                var userType = widget.userType();
                widget.userRole(userType);

                var user = widget.user();
                if (user.loggedIn()) {
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

                    } else { //DEFAULT TO CUSTOMER UNTIL SALES REP COMPLETE
                        /*
                        var vinNumber = widget.user().dynamicProperties().filter(function(data,index){
                          return data.id() =="p_vinNumber"
                        });
                        if(vinNumber[0].value() !== null) {
                        widget.vinNumber(vinNumber[0].value());
                        } else {
                          widget.vinNumber("No VIN No's Added");
                        }
                        */
                        widget.userAvailCredit('$12,500');
                        widget.userGreeting(getGreeting() + user.firstName());
                        widget.firstVisit(user.firstVisitDate().substring(0, 4));
                        widget.userAccountName(user.currentOrganization().name);
                    }

                } else {
                    CCLogger.warn(widget.displayName() + "-(" + widget.id() + ") - No user logged in");
                }

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            }
        };
    }
);