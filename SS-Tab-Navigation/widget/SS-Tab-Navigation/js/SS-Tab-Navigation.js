/**
 * @fileoverview Navigation tab to display external JSON in DataTables
 *
 * @author Chris Janning >
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

        return {

            thisTitle: ko.observable(''),
            thisLink: ko.observable(''),
            thisImage: ko.observable(''),
            thisHeight: ko.observable(''),
            tabTotal: ko.observable(0),
            tabDisplay: ko.observable('Loading...'),
            tabData: ko.observable(),

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                var ss_data = ss_settings.resourceData;
                var ss_images = ss_settings.resourceImages;

                widget.thisTitle(widget.title());
                widget.thisLink("location.href='" + widget.link() + "';");
                widget.thisImage(ss_images + "/resources/" + widget.image());
                widget.thisHeight(widget.height() + 'px');

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            },

            beforeAppear: function(page) {
                var widget = this;
                $('#tabNav-' + widget.id()).on('click', function() {
                    $('[id^=tabNav-]').attr('class', 'tablink'); //Set inactive tab(s) CSS
                    $('#tabNav-' + widget.id()).attr('class', 'tablink-selected'); //Set active tab CSS
                });

                var link = widget.link();
                var path = window.location.pathname;
                if (link == path) {
                    console.log('in');
                    $('[id^=tabNav-]').attr('class', 'tablink'); //Set inactive tab(s) CSS
                    $('#tabNav-' + widget.id()).attr('class', 'tablink-selected'); //Set active tab CSS
                }
            }
        };

    }
);
