/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'ccLogger', 'pubsub', 'navigation'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, CCLogger, pubsub, nav) {

        "use strict";

        return {

            onLoad: function(widgetModel) {
                var widget = widgetModel;
                $.Topic(pubsub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(function () {
                    nav.goTo("/fleet");
                });

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
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