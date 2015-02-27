define(['Q', 'underscore', 'mifosX'], function (Q) {
    var components = {
        models: [
            'models.fc2e6159'
        ],
        services: [
            'ResourceFactoryProvider',
            'HttpServiceProvider',
            'AuthenticationService',
            'SessionManager',
            'Paginator'
        ],
        controllers: [
            'controllers.62d19ee3'
        ],
        filters: [
            'filters.505be042'
        ],
        directives: [
            'directives.1f468634'
        ]
    };

    return function() {
        var defer = Q.defer();
        require(_.reduce(_.keys(components), function (list, group) {
            return list.concat(_.map(components[group], function (name) {
                return group + "/" + name;
            }));
        }, [
            'routes-initialTasks-webstorage-configuration.17a8121a'
        ]), function(){
            defer.resolve();
        });
        return defer.promise;
    }
});
