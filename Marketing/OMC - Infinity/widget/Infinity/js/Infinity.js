define(["knockout", "jquery", "ccRestClient", "ccConstants", "pubsub", "ccLogger", "//c.oracleinfinity.io/acs/account/xx7jkxhep7/js/OCCDEV/odc.js"],

    function(e, t, n, r, i, CCLogger) {
        "use strict";
        var s;
        return {
            onLoad: function(e) {
                //console.log("-- Infinity widget onLoad --"),
                window.globalWidget = e,
                    s = e,
                    s.fireInfinity = function() {
                        //console.log("-- Infinity tag fire --");
                        var e = {};
                        //e["wt.si_n"] = "Commerce Flow",
                        e["wt.si_n"] = "Shopping Cart",

                        s.pageContext().pageType.name == "home"; // && (e["wt.si_x"] = 1,e["wt.si_p"] = "Home", e["wt.si_cs"] = 0);

                        if (s.pageContext().pageType.name == "category") {
                            e["wt.si_x"] = 2,
                                e["wt.si_p"] = "Category Page",
                                e["wt.si_cs"] = 0;
                            if (s.category().categoryPaths.length > 0) {
                                e["wt.cg_n"] = s.category().categoryPaths[0].split("/")[2];
                                var t = s.category().categoryPaths[0].split("/").length;
                                t > 3 && (e["wt.cg_s"] = s.category().categoryPaths[0].split("/")[t - 1])
                            }
                        }
                        if (s.pageContext().pageType.name == "searchResults") {
                            var n = new URLSearchParams(window.location.search);
                            e["wt.cg_n"] = "Search",
                            n.has("Ntt") && (e["wt.cg_n"] = n.get("Ntt"),
                                e["wt.oss"] = n.get("Ntt")),
                                e["wt.si_x"] = 2,
                                e["wt.si_p"] = "Search Result Page",
                                e["wt.si_cs"] = 0
                        }
                        s.pageContext().pageType.name == "product" && (e["wt.si_x"] = 3,
                            e["wt.si_p"] = "Product Page",
                            e["wt.si_cs"] = 0,
                            e["wt.tx_e"] = "v",
                            e["wt.cg_n"] = s.product().parentCategories()[0].displayName(),
                            e["wt.pn_id"] = s.product().id(),
                            s.product().type() ? e["wt.pn_fa"] = s.product().type() : e["wt.pn_fa"] = "Basic",
                        s.product().brand() && s.product().brand() != null && s.product().brand() != "null" && (e["wt.pn_ma"] = s.product().brand())),
                        s.pageContext().pageType.name == "article" && (e["wt.cg_n"] = s.pageContext().page.displayName,
                            e["wt.si_x"] = 1,
                            e["wt.si_p"] = "Article Page",
                            e["wt.si_cs"] = 0),
                        s.pageContext().pageType.name == "cart" && (e["wt.cg_n"] = s.pageContext().page.displayName,
                            e["wt.si_x"] = 4,
                            e["wt.si_p"] = "Cart Page",
                            e["wt.si_cs"] = 0),
                        s.pageContext().pageType.name == "checkout" && (e["wt.cg_n"] = s.pageContext().page.displayName,
                            e["wt.si_x"] = 5,
                            e["wt.si_p"] = "Checkout Page",
                            e["wt.si_cs"] = 0);
                        if (s.pageContext().pageType.name === "confirmation") {
                            e["wt.cg_n"] = s.pageContext().page.displayName,
                                e["wt.tx_e"] = "p",
                                e["wt.tx_cartid"] = s.confirmation().id,
                                e["wt.si_x"] = 6,
                                e["wt.si_p"] = "Confirmation Page",
                                e["wt.si_cs"] = 1,
                                e["wt.tx_sub"] = s.confirmation().priceInfo.subTotal,
                                e["wt.tx_odis"] = s.confirmation().discountInfo.orderDiscount,
                                e["wt.tx_tax"] = s.confirmation().priceInfo.tax,
                                e["wt.tx_shp"] = s.confirmation().priceInfo.shipping,
                                e["wt.tx_sdis"] = s.confirmation().discountInfo.shippingDiscount,
                                e["wt.tx_tot"] = s.confirmation().priceInfo.total;
                            var r = ""
                                , i = ""
                                , o = ""
                                , u = "";
                            for (var a = 0; a < s.confirmation().shoppingCart.items.length; a++)
                                a == 0 ? (i = s.confirmation().shoppingCart.items[a].catRefId,
                                    o = s.confirmation().shoppingCart.items[a].quantity,
                                    u = s.confirmation().shoppingCart.items[a].price) : (i = i + ";" + s.confirmation().shoppingCart.items[a].catRefId,
                                    o = o + ";" + s.confirmation().shoppingCart.items[a].quantity,
                                    u = u + ";" + s.confirmation().shoppingCart.items[a].price);
                            e["wt.pn_sku"] = i,
                                e["wt.tx_u"] = o,
                                e["wt.tx_s"] = u
                        }
                        if (s.cart().items().length > 0) {
                            e["wt.tx_cartid"] = s.user().orderId();
                            var r = ""
                                , i = ""
                                , o = ""
                                , u = "";
                            for (var a = 0; a < s.cart().items().length; a++)
                                a == 0 ? (i = s.cart().items()[a].catRefId,
                                    o = s.cart().items()[a].quantity(),
                                    u = s.cart().items()[a].itemTotal()) : (i = i + ";" + s.cart().items()[a].catRefId,
                                    o = o + ";" + s.cart().items()[a].quantity(),
                                    u = u + ";" + s.cart().items()[a].itemTotal());
                            e["wt.pn_sku"] = i,
                                e["wt.tx_u"] = o,
                                e["wt.tx_s"] = u
                        }
                        var f = {};
                        f.data = e,
                            window.ORA.view(f),
                            localStorage.setItem("occ.referrer", window.location.href)
                    }
                    ,
                    s.configInfinity = function() {
                        //console.log("-- Infinity config --"),
                        localStorage.setItem("occ.referrer", document.referrer),
                            window.ORA.analytics.addMutation("myMutation", function(e) {
                                e.params.payload["wt.es"] = encodeURI(window.location).substr(8).split("?")[0],
                                    e.params.payload["wt.ti"] = document.title,
                                    e.params.payload.dcsuri = window.location.pathname,
                                    e.params.payload.dcsref = localStorage.getItem("occ.referrer")
                            }),
                            t.Topic(i.topicNames.PAGE_CHANGED).subscribe(s.fireInfinity)
                    }
                    ,
                    document.body.addEventListener("ORA_ANALYTICS_READY", s.configInfinity, !1);

                CCLogger.info("Widget: " + s.displayName() + "-(" + s.id() + ")");
            }
        }
    })