/**
 *  @fileoverview
 *  @author
 */

define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------

    ['knockout', 'jquery', 'ccRestClient', 'ccConstants', 'pubsub', 'ccLogger', 'navigation', 'https://api.pushio.com/webpush/sdk/wpIndex_min.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function (ko, $, ccRestClient, ccConstants, pubsub, CCLogger, nav, webpush) {

        "use strict";

        return {

            onLoad: function (widgetModel) {

                window.globalWidget = widgetModel;
                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.IntegrationSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Integration Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.IntegrationSettings;
                var ss_images = ss_settings.resourceImages;

                var webpushURL = ss_settings.webpushURL;
                var appServiceKey = ss_settings.webpushAppServiceKey;
                var apiKey = ss_settings.webpushApiKey;
                var accountToken = ss_settings.webpushAccountToken;

                //-------------------------------------------------------------------
                // Web Push
                //-------------------------------------------------------------------
                //var wpconfig = '{"appserviceKey":'+appServiceKey';
                var wpconfig = '{"appserviceKey":"'+appServiceKey+'","apiKey":"'+apiKey+'","accountToken":"'+accountToken+'","appver":"0.0.0","apiHost":"'+webpushURL+'","lazy":false}';
                //var wpconfig = '{"appserviceKey":"BChK7InjJZ0L46FCHpwcfEpwTNk6qAFFp7lkVIAeNyyx9IKES0jRwH60213Buwrl7vnWJ8szvtbda23MZ4tzuH0=","apiKey":"ABEltbBKeIV3QW1c2ALoN-a1s","accountToken":"ABEgQAS9cEenJP4nvMKg0y5Fg","appver":"0.0.0","apiHost":"https://api.pushio.com","lazy":false}';
                var webpushtag = "<script type='text/javascript' src='"+webpushURL+"/webpush/sdk/wpIndex_min.js' id='rsyswpsdk' wpconfig='" + wpconfig + "'></script>";
                $('head').append(webpushtag);

                //-------------------------------------------------------------------
                // User Registration
                //-------------------------------------------------------------------
                $.Topic(pubsub.topicNames.USER_REGISTRATION_SUBMIT).subscribe(function(widgetData) {
                    var data={};
                    data.type="User Registration";
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

                    webPushManagerAPI.setUserId(email);

                    var url = ss_settings.responsysURL + '?_ri=' + ss_settings.responsysUserRegRI +
                        //var url = 'https://demo033z0.rsys5.net/pub/rf?_ri_='+
                        //'X0Gzc2X%3DYQpglLjHJlYQGuMglgDH1u7H06eBkSylb65DEaze3XlzgSibk0VwjpnpgHlpgneHmgJoXX0Gzc2X%3DYQpglLjHJlYQGmucsY8Hj1uzfCNCU8zezaXyqCDEaze3XlzgSibk0'+
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
                    nav.goTo("/");
                    CCLogger.info('Responsys User Registration: ' + url);
                });

                $.Topic(pubsub.topicNames.AUTH_LOGIN_SUCCCESS).subscribe(function () {
                    var email = widget.user().emailAddress();
                    webPushManagerAPI.setUserId(email);
                });

                $.Topic(pubsub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(function () {
                    var email = widget.user().emailAddress();
                    webPushManagerAPI.setUserId(email);
                });

                //-------------------------------------------------------------------
                // Order Confirmation
                //-------------------------------------------------------------------
                widget.fireTag = function(){
                    var data={};
                    data.type="Order Confirmation";

                    if (widget.pageContext().pageType.name == 'confirmation') {
                        data.page=widget.pageContext().page.displayName;

                        var prodIDs='';
                        var prodSKUs='';
                        var prodUnits='';
                        var subTotal='';
                        for(var i=0;i<widget.confirmation().shoppingCart.items.length;i++) {
                            if (i === 0) {
                                prodSKUs = widget.confirmation().shoppingCart.items[i].productId;
                                prodUnits = widget.confirmation().shoppingCart.items[i].quantity;
                                subTotal = widget.confirmation().shoppingCart.items[i].unitPrice;
                            }
                            else {
                                prodSKUs = prodSKUs + ';' + widget.confirmation().shoppingCart.items[i].productId;
                                prodUnits = prodUnits + ';' + widget.confirmation().shoppingCart.items[i].quantity;
                                subTotal = subTotal + ';' + widget.confirmation().shoppingCart.items[i].unitPrice;
                            }
                        }

                        var email_address;
                        if (widget.user().email() !== null) {
                            email_address = widget.user().email();
                        } else {
                            email_address = 'guest';
                        }

                        webPushManagerAPI.setUserId(email_address);

                        var today = new Date();
                        var event_dt = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
                        var order_num = widget.confirmation().id;

                        data.product_skus=prodSKUs;
                        data.product_units=prodUnits;
                        data.order_num=order_num;
                        data.subtotal=subTotal;
                        data.email_address=email_address;
                        data.event_dt=event_dt;

                        var url = ss_settings.responsysURL + '?_ri=' + ss_settings.responsysOrderConfRI +
                            //var url = 'http://demo033z0.rsys5.net/pub/rf?_ri_='+
                            //'X0Gzc2X%3DYQpglLjHJlYQGt1S0LAl1Mlgj34f2YEbPOvwzbT2EveHzfsszanVwjpnpgHlpgneHmgJoXX0Gzc2X%3DYQpglLjHJlYQGlACAj8Fu02Rh2GrSGTtwplwzbT2EveHzfsszan'+
                            '&EMAIL_ADDRESS_='+email_address+
                            '&ORDER_NUM='+order_num+
                            '&EVENT_DT='+event_dt+
                            '&PRODUCT_SKUS='+prodSKUs+
                            '&PRODUCT_UNITS='+prodUnits+
                            '&PRODUCT_SUBTOTALS='+subTotal;
                        CCLogger.info('Responsys Order Confirmation: ' + url);
                        $.ajax({
                            url: url,
                            success: function(result) {
                                CCLogger.info(result);
                            },
                            error: function(error) {
                                CCLogger.error(error);
                            }
                        });
                    }

                    localStorage.setItem("occ.referrer",window.location.href);
                };

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