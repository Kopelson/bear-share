const isAuthenticated = require("../config/middleware/isAuthenticated");
const db = require("../models");
//HTML Routes

module.exports = (app) => {
    // route for landing page "/".
    app.get("/", (req, res) => {
        if (req.user) {
            db.Posting.findAll({}).then((data) => {
                console.log(data);
                res.render("members", {
                    bearsList: data,
                });
            });
        } else {
            db.Posting.findAll({}).then((data) => {
                // console.log(data);
                res.render("index", {
                    bearsList: data,
                });
            });
        }
    });

    // route for login page
    app.get("/login", (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/");
        } else {
            res.render("login");
        }
    });

    // route for signup page
    app.get("/signup", (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/");
        } else {
            res.render("signup");
        }
    });
    // route for posting an item
    app.get("/post", (req, res) => {
        if (req.user) {
            res.render("post");
        } else {
            res.render("login");
        }
    });

    // route for user's account page. gets all of user's postings to hydrate selling tab
    app.get("/account", (req, res) => {
        if (req.user) {
            db.User.findAll({
                    where: {
                        id: req.user.id,
                    },
                    include: {
                        model: db.Posting,
                        include: {
                            model: db.Message
                        }
                    }
                })
                .then((data) => {
                    console.log("========Account data==========");
                    console.log(data[0].dataValues);
                    // console.log(data[0].dataValues.Postings[0].dataValues.Messages);
                    console.log(data[0].dataValues.Postings);
                    // console.log(data[0].dataValues.Postings[0].dataValues.Messages); // joel - if this array is zero this will throw a 404 error
                    let messageArr = [];
                    for (let i = 0; i < data[0].dataValues.Postings.length; i++) {
                        for (let j = 0; j < data[0].dataValues.Postings[i].dataValues.Messages.length; j++) {
                            messageArr.push(data[0].dataValues.Postings[i].dataValues.Messages[j].dataValues);
                        }
                    }
                    console.log("========message data==========");
                    console.log(messageArr);
                    if (data[0].dataValues.Postings.length === 0) {
                        console.log("test length zero");
                        res.render("account", {
                            Profile: data[0].dataValues,
                        });
                    } else {
                        console.log("test length > zero");
                        res.render("account", {
                            Profile: data[0].dataValues,
                            Postings: data[0].dataValues.Postings,
                            Messages: messageArr
                        });
                    }
                })
                .catch(function (err) {
                    res.status(404).json(err);
                });
        } else {
            res.render("login");
        }
    });
    // route for user's account page. gets all of user's postings to hydrate selling tab
    // app.get("/account", (req, res) => {
    //     if (req.user) {
    //         db.User.findAll({
    //             where: {
    //                 id: req.user.id
    //             },
    //             include: [{
    //                 model: db.Message,
    //                 where: { toId: req.user.id}
    //             }]
    //         }).then((data) => {
    //             console.log(data);
    //             console.log("test log for account data values");
    //             console.log("============================ message ====================================");
    //             console.log(data[0].dataValues.Messages[0]);
    //             let messageArr = [];
    //             for(let i = 0; i < data[0].dataValues.Messages.length; i++){
    //                 messageArr.push(data[0].dataValues.Messages[i].dataValues);
    //             }

    //             console.log("============================ message ====================================");
    //             console.log(messageArr);
    //             if (data.length < 0) {
    //                 res.render("account");
    //             } else {
    //                 res.render("account", {
    //                     bearsList: data,
    //                     messageLists: messageArr
    //                 });
    //             }
    //         }).catch(function (err) {
    //             res.status(404).json(err);
    //         });
    //     } else {
    //         res.render("login");
    //     }
    // });

    // route for members page. currently don't have members.handlebars file
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    // app.get("/members", isAuthenticated, (req, res) => {
    //     res.render("members");
    // });

    // route for bear list "/search"
    app.get("/search", (req, res) => {
        res.render("search"); // currently don't have a search.handlebars file
    });

    // route for showing a product
    app.get("/product/:productID", (req, res) => {
        if (req.user) {
            db.Posting.findOne({
                where: {
                    id: req.params.productID,
                },
            }).then(function (results) {
                console.log(results);
                let hbsObject = results.dataValues;
                console.log(hbsObject);
                res.render("product", hbsObject);
            });
        } else {
            res.render("login");
        }
    });
};