/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, CCLogger) {

        "use strict";

        function getDate(value) {
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

            onLoad: function() {    
                //var widget = widgetModel;            
                //CCLogger.info("Loading " + widget.displayName() + "-(" + widget.id() + ")");
            },
            
            doMessage : function() {
                //alert("Shared View Models");
            },
      
            viewModel : ko.observable({
                userprofile : ko.observable('Test'),
                userprofileBlock : ko.observable()
            })

        };
    }
);