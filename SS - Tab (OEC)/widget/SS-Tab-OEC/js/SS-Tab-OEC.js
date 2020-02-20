/**
 * @fileoverview
 *
 * @author
 */
define(
    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['jquery', 'knockout', 'ccLogger', 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function($, ko, CCLogger, dataTables) {

        "use strict";

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

        function buildTable(tab,widget) {
            var table;
            if (tab == 'Service') {
                table = $('#listing').DataTable( {
                    processing: true,
                    data: widget.tabData(),
                    columns: [
                        {title: "Critical"},
                        {title: "Severity"},
                        {title: "Reference Number"},
                        {title: "Title"},
                        {title: "Channel Type"},
                        {title: "Last Updated Date"},
                        {title: "Account"},
                        {title: "Status"}
                    ],
                    order: [[ 5, "desc" ]],
                    columnDefs: [
                        {targets: 0,orderable: false,data: "download_link",
                            render: function(data, type, row, meta) {
                                var image = '';
                                if (row[0] == true) {
                                    image = '<img alt="Critical" src="' + ss_images + '/tables/qual_alert_16.png">';
                                }
                                return image;
                            }
                        },
                        {targets: 4,
                            orderable: false,
                            data: "download_link",
                            render: function(data, type, row, meta) {
                                var image = '';
                                var alt = row[4];
                                if (alt == 'Chat') {
                                    image = '<img alt="'+alt+'" src="' + ss_images + '/tables/qual_personchat_16.png">&nbsp;' + alt;
                                } else if (alt == 'E-Mail') {
                                    image = '<img alt="'+alt+'" src="' + ss_images + '/tables/qual_envelope_16.png">&nbsp;' + alt;
                                } else if (alt == 'Web') {
                                    image = '<img alt="'+alt+'" src="' + ss_images + '/tables/qual_globe_16.png">&nbsp;' + alt;
                                } else if (alt == 'Phone') {
                                    image = '<img alt="'+alt+'" src="' + ss_images + '/tables/qual_phone_16.png">&nbsp;' + alt;
                                } else {
                                    image = '<img alt="'+alt+'" src="' + ss_images + '/tables/qual_people_16.png">&nbsp;' + alt;
                                }
                                return image;
                            }
                        },{targets: [5], type: "date",
                            render: function (value) {
                                if (value === null) return "";
                                var mydate = new Date(value);
                                var yyyy = mydate.getFullYear().toString();
                                var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based
                                var dd = mydate.getDate().toString();
                                var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
                                var mydatestr = new Date(parts);
                                return mydatestr.toLocaleDateString();
                            }
                        },{targets:[1,3,4],orderable: false}
                    ],
                    language: {emptyTable: "No " + tab.toLowerCase() + " found"},
                    destroy: true
                });
            } else if (tab == 'Subscriptions') {
                var deepLink = 'https://ucf1-zhpe-fa-ext.oracledemos.com/crmUI/faces/FuseWelcome?_adf.no-new-window-redirect=true&_adf.ctrl-state=45dvmwy6o_8&_afrLoop=758855826990321&_afrWindowMode=2&_afrWindowId=zxckuchrr&_afrFS=16&_afrMT=screen&_afrMFW=1536&_afrMFH=722&_afrMFDW=1536&_afrMFDH=864&_afrMFC=8&_afrMFCI=0&_afrMFM=0&_afrMFR=120&_afrMFG=0&_afrMFS=0&_afrMFO=0';
                table = $('#listing').DataTable( {
                    processing: true,
                    data: widget.tabData(),
                    columns: [
                        {title: "Subscription Number"},
                        {title: "Customer"},
                        {title: "Total Contract Value"},
                        {title: "Start Date"},
                        {title: "End Date"},
                        {title: "Status"},
                        {title: "Term"}
                    ],
                    order: [[ 4, "desc" ]],
                    columnDefs: [
                        {targets: [3,4], type: "date",
                            render: function (value) {
                                if (value === null) return "";
                                var mydate = new Date(value);
                                var yyyy = mydate.getFullYear().toString();
                                var mm = (mydate.getMonth() + 1).toString(); // getMonth() is zero-based
                                var dd = mydate.getDate().toString();
                                var parts = (mm[1]?mm:"0"+mm[0]) + '/' + (dd[1]?dd:"0"+dd[0]) + '/' + yyyy;
                                var mydatestr = new Date(parts);
                                return mydatestr.toLocaleDateString();
                            }
                        },
                        {type: "num-fmt", targets: 2, render: $.fn.dataTable.render.number( ',', '.', 2, '$' ) },
                        {targets: 5,orderable: false,data: "download_link",
                            render: function(data, type, row, meta) {
                                var image;
                                var alt = row[5];
                                if (row[5] == 'ORA_ACTIVE') {
                                    image = ss_images + "/tables/green_check.png";
                                } else if (row[5] == 'ORA_CLOSED') {
                                    image = ss_images + "/tables/red_x.png";
                                } else {
                                    image = ss_images + "/tables/warning.png";
                                }
                                return '<img alt="' + alt + '" src="' + image + '" height="20px" widgth="20px"> ' + alt;
                            }
                        },
                        {targets: 7,orderable: false,data: "download_link",
                            render: function(data, type, row, meta) {
                                var dispValue;
                                if (row[5] == 'ORA_ACTIVE') {
                                    return '';
                                } else  {
                                    var renewLink = '<a href="' + deepLink + '" target="_blank">Renew</a>';
                                    return renewLink;
                                }
                                return dispValue;
                            }
                        }
                    ],
                    language: {emptyTable: "No " + tab.toLowerCase() + " found"},
                    destroy: true
                });
            } else if (tab == 'Contacts') {
                table = $('#listing').DataTable( {
                    data: widget.tabData().items,
                    order: [[ 1, "asc" ]],
                    columns: [
                        // {data: "FavoriteContactFlag"},
                        {data: "ContactName"},
                        {data: "JobTitle"},
                        {data: "EmailAddress"},
                        {data: "AccountName"},
                        {data: "OverallPrimaryFormattedPhoneNumber"},
                        {data: "LastUpdateDate"}
                    ],
                    columnDefs: [
                        /*  {title: "Favorite", targets: 0, orderable: false, render: function(data,type,row,meta) {
                                  if (data == 'true') {
                                      return '<img alt="' + data + '" src="' + ss_images + "/tables/favorite.png" + '" height="20px" widgth="20px">';
                                  } else {
                                      return '&nbsp;';
                                  }
                              }
                          },*/
                        {title: "Name", targets: 0, orderable: true, render: function(data,type,row,meta) {
                                return '<a style="text-decoration:underline" href="/customer&pn='+ row.PartyNumber + '">' + row.ContactName + '</a>';
                            }
                        },
                        {title: "Title", targets: 1, orderable: false},
                        {title: "Email", targets: 2, orderable: false},
                        {title: "Account", targets: 3, orderable: true},
                        {title: "Phone", targets: 4, orderable: false},
                        {title: "Last Updated", targets: 5, orderable: true, render: function(data, type, row, meta) {return formatDate(data)}},
                        {title: "", targets: 6, orderable: true, render: function(data, type, row, meta) {
                                return '<input class="cc-button-primary" type="button" value="Open&nbsp;CRM" onClick="parent.open(\'' + widget.serverURL() + '\')">';
                            }
                        },
                    ],
                    language: {emptyTable: 'No ' + tab + ' found'},
                    lengthChange: false,
                    pageLength: 5,
                    destroy: true,
                });
            }
            return table;
        }

        var ss_images;
        var ss_data;

        return {

            tabTotal: ko.observable(0),
            tabDisplay: ko.observable('Loading...'),
            tabData: ko.observable(),

            onLoad: function(widgetModel) {

                var widget = widgetModel;

                if (!widget.site().extensionSiteSettings.SelfServiceSettings) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Self-Service Settings not found");
                    return;
                }

                var ss_settings = widget.site().extensionSiteSettings.SelfServiceSettings;
                ss_data = ss_settings.resourceData;
                ss_images = ss_settings.resourceImages;

                if (!widget.tabName()) {
                    CCLogger.error(widget.displayName() + "-(" + widget.id() + ") - Widget configuration empty (Hint: Open and save)");
                    return;
                }

                var tab = "Contacts";//widget.tabName();
                var tabTitle = "Contacts";//widget.tabTitle();

                widget.tabName(tab);
                widget.tabImage = ss_images + "/tabs/" + tab.toLowerCase() + ".png";

                //tabUsed.push(tab);

                //var qAuth = widget.authType(); //"Basic bmF0YWxpZS50aG9tcHNvbjpUV0M3ODY3Mw==";
                //if (!apiCalled.includes(tab)) {
                var qUrl;
                var qOwner;
                var qFields;
                if (tab == 'Service') {
                    qUrl = widget.serverURL() + 'crmRestApi/resources/latest/serviceRequests/';
                    qOwner = '?q=' + widget.owner(); //PrimaryContactPartyName=Lisa Lauber';
                    qFields = '&fields=CriticalFlag,SeverityCdMeaning,SeverityRank,SrNumber,Title,ChannelTypeCdMeaning,LastUpdateDate,AccountPartyName,StatusCdMeaning';
                } else if (tab == 'Subscriptions') {
                    qUrl = widget.serverURL() + 'crmRestApi/resources/latest/subscriptions/';
                    qOwner = '?q=' + widget.owner(); //PrimaryPartyId=300000177639444';
                    qFields = '';
                } else if (tab == 'Contacts') {
                    qUrl = widget.serverURL() + 'crmRestApi/resources/latest/contacts/';
                    qOwner = '?q=' + widget.owner(); //PrimaryPartyId=300000177639444';
                    qFields = '';
                }

                $.ajax({
                    type: "GET",
                    async: true,
                    crossDomain: true,
                    headers: {
                        "Authorization": widget.authType(),
                        "Accept": "*/*"
                    },
                    url: qUrl,// + qOwner + qFields,
                    success: function(result) {
                        widget.tabData(result);
                        /*
                        var dataSet = [];
                        if (tab == 'Service') {
                            for (var i=0; i<response.items.length; i++) {
                              var cf = response.items[i].CriticalFlag;
                              var sc = response.items[i].SeverityCdMeaning;
                              var sr = response.items[i].SeverityRank;
                              var sn = response.items[i].SrNumber;
                              var t = response.items[i].Title;
                              var ct = response.items[i].ChannelTypeCdMeaning;
                              var ld = response.items[i].LastUpdateDate;
                              var ap = response.items[i].AccountPartyName;
                              var st = response.items[i].StatusCdMeaning;
                              dataSet[i] = [cf, sr + ' - ' + sc, sn, t, ct, ld, ap, st];
                            }
                        } else if (tab == 'Subscriptions') {
                            for (var j=0; j<response.items.length; j++) {
                                var aj = response.items[j].SubscriptionNumber;
                                var bj = response.items[j].PrimaryPartyName;
                                var cj = response.items[j].TotalContractValue;
                                var dj = response.items[j].StartDate;
                                var ej = response.items[j].EndDate;
                                var fj = response.items[j].Status;
                                var gj = response.items[j].Duration;
                                if (gj === null) {
                                    gj = '';
                                }
                                var hj = response.items[j].Period;
                                if (hj === null) {
                                    hj = '';
                                }
                                dataSet[j] = [aj,bj,cj,dj,ej,fj,gj + ' ' + hj];
                            }
                        } else if (tab == 'Contacts') {

                            for (var k=0; k<response.items.length; k++) {

                                var ak = response.items[k].FavoriteContactFlag;
                                var bk = response.items[k].ContactName;
                                var ck = response.items[k].JobTitle;
                                var dk = response.items[k].EmailAddress;
                                var ek = response.items[k].AccountName;
                                var fk = response.items[k].OverallPrimaryFormattedPhoneNumber;
                                dataSet[k] = [ak,bk,ek,ck,fk,dk];
                            }
                        }
                        */
                        widget.tabData(result);
                        widget.tabTotal(result.items.length);
                        widget.tabDisplay(tabTitle + ' (' + result.items.length + ')');
                    },
                    error: function(jqXHR, textStatus, error) {
                        widget.tabTotal(0);
                        widget.tabDisplay(tabTitle + ' (0)');
                        CCLogger.error(widget.displayName() + "-(" + widget.id() + ")-" + tab + "-" + textStatus + "-" + error);
                    }
                });
                //  apiCalled.push(tab);
                //  }

                CCLogger.info("Widget: " + widget.displayName() + "-(" + widget.id() + ")-" + tab);
            },

            beforeAppear: function(page) {
                var widget = this;
                var tab = widget.tabName();
                $('#tab-' + tab + '-' + widget.id()).on('click', function() {
                    $('[id^=tab-]').attr('class', 'imglink');
                    $('#tab-' + tab + '-' + widget.id()).attr('class', 'imglink-selected');
                    if ($.fn.DataTable.isDataTable('#listing')) {
                        $('#listing').DataTable().clear().destroy();
                        $('#listing').empty();
                    }
                    buildTable(tab,widget);
                });
            }
        };
    }
);