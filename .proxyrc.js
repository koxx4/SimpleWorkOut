//Wasted almost 2 days on this stupid thing
//https://github.com/parcel-bundler/parcel/issues/6561

module.exports = function (app) {
    app.use((req, res, next) => {
        res.removeHeader('Cross-Origin-Resource-Policy');
        res.removeHeader('Cross-Origin-Embedder-Policy');
        next();
    });
};
