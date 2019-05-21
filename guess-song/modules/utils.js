module.exports = {
    buildRoute: function(route, ...args) {
        return function (req, res) {
            route(req, res, ...args);
        }
    }
}