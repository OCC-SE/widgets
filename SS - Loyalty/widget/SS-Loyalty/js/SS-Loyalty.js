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

        thisPercent: ko.observable(''),
        thisNeeded: ko.observable(''),

        onLoad: function(widgetModel) {                             
            widget = widgetModel;
            widgetName = widget.displayName();
            console.log("-- " + widgetName + " onLoad --");

            var thisPerc = widget.loyalPoints()/widget.nextTier();
            widget.thisPercent = parseFloat(thisPerc*100).toFixed(0)+"%";
            
            widget.thisNeeded = widget.nextTier() - widget.loyalPoints();
            
            widget.markerImage=widget.assetMappings["/images/blue_status.png"]();
            
            console.log("-- " + widgetName + " onLoad END --");
        },
        
        beforeAppear: function(page) {

        }
    };
  }
);