define(['underscore'], function () {
    var styles = {
        css: [
            'bootstrap.min.c33e9a22.css',
            'bootstrap-ext.640eb179.css',
            'bootswatch.ef900d9b.css',
            'font-awesome.min.css',
            'app.f63be2a3.css',
            'nv.d3.e3f92dce.css',
            'style.0f31ea67.css',
            'chosen.min.a355d0a0.css'
        ]
    };

    require(_.reduce(_.keys(styles), function (list, pluginName) {
        return list.concat(_.map(styles[pluginName], function (stylename) {
            return pluginName + '!styles/' + stylename;
        }));
    }, []));
});
