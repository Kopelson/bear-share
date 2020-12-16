const isAuthenticated = require("../config/middleware/isAuthenticated");
//HTML Routes
module.exports = app => {
    // route for login page
    app.get("/login", (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/members");
        } else {
            res.render("login");
        }
    });

    // route for signup page
    app.get("/signup", (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/members");
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

    // route for posting an item
    app.get("/account", (req, res) => {
        if (req.user) {
            res.render("account");
        } else {
            res.render("login");
        }
    });

    // route for members page. currently don't have members.handlebars file
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    app.get("/members", isAuthenticated, (req, res) => {
        res.render("members");
    });

    // route for bear list "/search"
    app.get("/search", (req, res) => {
        res.render("search"); // currently don't have a search.handlebars file
    });
}