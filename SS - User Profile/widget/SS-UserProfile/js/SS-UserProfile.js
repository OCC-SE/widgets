/**
 * @fileoverview
 *
 * @author
 */
define( 
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function ($, ko) {

    "use strict";
    
    var widget;
    var widgetName;

    return {

        userImage: ko.observable(''),
        firstVisit: ko.observable(''),
        userRole: ko.observable(''),
        userPhone: ko.observable(''),
        
        onLoad: function(widgetModel) {                             
            widget = widgetModel;
            widgetName = widget.displayName();
            console.log("-- " + widgetName + " onLoad --");

            var user = widget.user();
            if (user.loggedIn()) {
                //var img = "/images/" + user.firstName() + ".jpg"; - Getting n.assetMappings[i] is not a function ERROR
                widget.userImage = "https://raw.githubusercontent.com/occ-janning/images/master/" + user.firstName().toLowerCase() + ".jpg";
                if (user.firstName() == 'Wendy') { //phone number not found in profile so hard coded
                //    widget.userImage=widget.assetMappings["/images/wendy.jpg"]();
                    widget.userPhone="555-555-1234";
                } else {
                //    widget.userImage=widget.assetMappings["/images/jeff.jpg"]();
                    widget.userPhone="555-555-5678";
                }
                widget.firstVisit = user.firstVisitDate().substring(0, 4);
                widget.userRole = widget.userType();
            } else {
                console.log("No user logged in");
            }
            
            console.log("-- " + widgetName + " onLoad END --");
        },
        
        beforeAppear: function(page) {

        }
    };
  }
);