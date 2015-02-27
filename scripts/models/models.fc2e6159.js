(function (module) {
    mifosX.models = _.extend(module, {
        Langs: [
            {"name": "English", "code": "en"},
            {"name": "Français", "code": "fr"},
            {"name": "Español", "code": "es"},
            {"name": "Português", "code": "pt"},
            {"name": "中文", "code": "zh_CN"},
            {"name": "हिंदी", "code": "hi"},
            {"name": "ქართული", "code": "ka"}
        ]
    });
}(mifosX.models || {}));
;(function (module) {
    mifosX.models = _.extend(module, {
        LoggedInUser: function (data) {
            this.name = data.username;
            this.userId = data.userId;
            this.userPermissions = data.userPermissions || data.permissions || [];

            this.getHomePageIdentifier = function () {
                var role = _.first(data.selectedRoles || data.roles);
                return mifosX.models.roleMap[role.id];
            };
        }
    });
}(mifosX.models || {}));
;(function (module) {
    mifosX.models = _.extend(module, {
        Role: function (data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
        }
    });
}(mifosX.models || {}));
;(function (module) {
    mifosX.models = _.extend(module, {
        ClientStatus: function () {

            this.getStatus = function (status) {
                return this.statusTypes[status];
            };

            this.allStatusTypes = function () {
                return Object.keys(this.statusTypes);
            };

            this.statusKnown = function (status) {
                return this.allStatusTypes().indexOf(status) > -1;
            };

            this.statusTypes = {
                "Pending": [
                    {
                        name: "label.button.edit",
                        href: "#/editclient",
                        icon: "icon-edit",
                        taskPermissionName: "UPDATE_CLIENT"
                    },
                    {
                        name: "label.button.activate",
                        href: "#/client",
                        subhref: "activate",
                        icon: "icon-ok-sign",
                        taskPermissionName: "ACTIVATE_CLIENT"
                    },
                    {
                        name: "label.button.close",
                        href: "#/client",
                        subhref: "close",
                        icon: "icon-remove-circle",
                        taskPermissionName: "CLOSE_CLIENT"
                    },
                    {
                        name: "label.button.reject",
                        href: "#/client",
                        subhref: "reject",
                        icon: "icon-remove-circle",
                        taskPermissionName: "REJECT_CLIENT"
                    },
                    {
                        name: "label.button.withdraw",
                        href: "#/client",
                        subhref: "withdraw",
                        icon: "icon-remove-circle",
                        taskPermissionName: "WITHDRAW_CLIENT"
                    }
                ],
                "Closed":[
                    {
                        name: "label.button.reactivate",
                        href: "#/client",
                        subhref: "reactivate",
                        icon: "icon-ok-sign",
                        taskPermissionName: "REACTIVATE_CLIENT"
                    }

                ],
                "Active": [
                    {
                        name: "label.button.edit",
                        href: "#/editclient",
                        icon: "icon-edit",
                        taskPermissionName: "UPDATE_CLIENT"
                    },
                    {
                        name: "label.button.newloan",
                        href: "#/newclientloanaccount",
                        icon: "icon-plus",
                        taskPermissionName: "CREATE_LOAN"
                    },
                    {
                        name: "label.button.newsaving",
                        href: "#/new_client_saving_application",
                        icon: "icon-plus",
                        taskPermissionName: "CREATE_SAVINGSACCOUNT"
                    },
                    {
                        name: "label.button.transferclient",
                        href: "#/transferclient",
                        icon: "icon-arrow-right",
                        taskPermissionName: "PROPOSETRANSFER_CLIENT"
                    },
                    {
                        name: "label.button.close",
                        href: "#/client",
                        subhref: "close",
                        icon: "icon-remove-circle",
                        taskPermissionName: "CLOSE_CLIENT"
                    }
                ],
                "Transfer in progress": [
                    {
                        name: "label.button.accepttransfer",
                        href: "#/client",
                        subhref: "acceptclienttransfer",
                        icon: "icon-check-sign",
                        taskPermissionName: "ACCEPTTRANSFER_CLIENT"
                    },
                    {
                        name: "label.button.rejecttransfer",
                        href: "#/client",
                        subhref: "rejecttransfer",
                        icon: "icon-remove",
                        taskPermissionName: "REJECTTRANSFER_CLIENT"
                    },
                    {
                        name: "label.button.undotransfer",
                        href: "#/client",
                        subhref: "undotransfer",
                        icon: "icon-undo",
                        taskPermissionName: "WITHDRAWTRANSFER_CLIENT"
                    }
                ],
                "Transfer on hold": [
                    {
                        name: "label.button.undotransfer",
                        href: "#/client",
                        subhref: "undotransfer",
                        icon: "icon-undo",
                        taskPermissionName: "WITHDRAWTRANSFER_CLIENT"
                    }
                ],
                "Assign Staff": {
                    name: "label.button.assignstaff",
                    href: "#/client",
                    subhref: "assignstaff",
                    icon: "icon-user",
                    taskPermissionName: "ASSIGNSTAFF_CLIENT"
                }
            }
        }
    });
}(mifosX.models || {}));;(function (module) {
    mifosX.models = _.extend(module, {
        roleMap: {
            1: "superuser",
            2: "branchmanager",
            3: "funder"
        }
    });
}(mifosX.models || {}));
