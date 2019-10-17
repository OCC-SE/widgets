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
    var widgetRepository = "https://raw.githubusercontent.com/OCC-SE/";

    return {

        userImage: ko.observable(''),
        firstVisit: ko.observable(''),
        userRole: ko.observable(''),
        userPhone: ko.observable(''),
        
        onLoad: function(widgetModel) {                             
            widget = widgetModel;

            var user = widget.user();
            if (user.loggedIn()) {
                widget.userImage = widgetRepository + "images/master/" + user.firstName().toLowerCase() + ".jpg";
                if (user.firstName() == 'Wendy') { //phone number not found in profile so hard coded
                    widget.userPhone="555-555-1234";
                } else {
                    widget.userPhone="555-555-5678";
                }
                widget.firstVisit = user.firstVisitDate().substring(0, 4);
                widget.userRole = widget.userType();
            } else {
                console.log("No user logged in");
            }
            
            console.log("-- Loading " + widget.displayName() + "-(" + widget.id() + ")");
        },  
    };
  }
);