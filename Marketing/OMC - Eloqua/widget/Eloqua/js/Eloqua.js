/**
 *  @fileoverview
 *  @author
 */

define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------

    ['knockout', 'jquery', 'ccRestClient', 'ccConstants', 'pubsub', 'ccLogger'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function (ko, $, ccRestClient, ccConstants, pubsub, CCLogger) {

        "use strict";

        return {

            onLoad: function (widgetModel) {

                window.globalWidget = widgetModel;
                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.CXIntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - CX Integration Settings not found");
                    return;
                }
    
                var ss_settings = widget.site().extensionSiteSettings.CXIntegrationSettings;
                
                //-------------------------------------------------------------------
                // User Registration
                //-------------------------------------------------------------------
                $.Topic(pubsub.topicNames.USER_REGISTRATION_SUBMIT).subscribe(function(widgetData) {
                    var data={};
                    data.type="User Registration";
                    /*
                    var email = widget.user().emailAddress();
                    var firstName = widget.user().firstName();
                    var lastName = widget.user().lastName();
                    var receiveEmails = 'O';
                    if (widget.user().emailMarketingMails() === true) {
                        receiveEmails = 'I';
                    }

                    data.email = email;
                    data.firstName = firstName;
                    data.lastName = lastName;
                    data.receiveEmails = receiveEmails;
                    
                    var settings = {
                      "url": "https://s1650439596.t.eloqua.com/e/f2",
                      "method": "POST",
                      "timeout": 0,
                      "headers": {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      "data": {
                        "elqFormName": "UntitledForm-1586291112825",
                        "elqSiteId": "1650439596",
                        "emailAddress": data.emailAddress,
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "company": "company",
                        "address1": "address1",
                        "address2": "address2",
                        "city": "city",
                        "zipPostal": "11111",
                        "stateProv": "state",
                        "country": "country",
                        "busPhone": "111-222-3333",
                        "paragraphText": "text"
                      }
                    };                    
                    

                    var url = ss_settings.responsysURL + '?_ri=' + ss_settings.responsysUserRegRI +
                        '&FIRST_NAME=' + firstName +
                        '&LAST_NAME=' + lastName +
                        '&EMAIL_ADDRESS_=' + email +
                        '&EMAIL_PERMISSION_STATUS_=' + receiveEmails;
                    $.ajax({
                        url: url,
                        success: function(result) {
                            CCLogger.info(result);
                        },
                        error: function(error) {
                            CCLogger.error(error);
                        }
                    });
                    */
                    //nav.goTo("/");
                    //CCLogger.info('Eloqua User Registration: ' + url);
                });
                
                $.Topic(pubsub.topicNames.REGISTER_SUCCESS).subscribe(function () {
                    //nav.goTo("/");
                });                

                $.Topic(pubsub.topicNames.AUTH_LOGIN_SUCCCESS).subscribe(function () {
                    var email = widget.user().emailAddress();
                });

                $.Topic(pubsub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(function () {
                    var email = widget.user().emailAddress();
                });
                
                widget.configTag = function () {
                    localStorage.setItem("occ.referrer",document.referrer);
                    $.Topic(pubsub.topicNames.PAGE_CHANGED).subscribe(widget.fireTag);
                };
                document.body.addEventListener('ORA_ANALYTICS_READY', widget.configTag, false);

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")");
            }
        };
    }
);