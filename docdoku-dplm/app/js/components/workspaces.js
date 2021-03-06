(function () {

    'use strict';

    angular.module('dplm.services')
        .service('WorkspaceService', function ($window, $log, $filter, $q, $location, DocdokuAPIService, DBService, RepositoryService) {

            var _this = this;
            var fs = $window.require('fs');
            var fileMode = $filter('fileMode');
            var lastIteration = $filter('lastIteration');

            var checkInDocument = function (document, indexFolder, path) {
                return $q(function (resolve, reject) {
                    var updatedItem;
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.documents.checkInDocument({
                            workspaceId: document.workspaceId,
                            documentId: document.documentMasterId,
                            documentVersion: document.version
                        }).then(function (response) {
                            updatedItem = response.obj;
                            if (indexFolder && path) {
                                RepositoryService.saveItemToIndex(indexFolder, path, updatedItem);
                            }
                            return DBService.storeDocuments([updatedItem]);
                        }).then(function () {
                            resolve(updatedItem);
                        });
                    }, reject);
                });
            };

            var checkOutDocument = function (document, indexFolder, path) {
                return $q(function (resolve, reject) {
                    var updatedItem;
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.documents.checkOutDocument({
                            workspaceId: document.workspaceId,
                            documentId: document.documentMasterId,
                            documentVersion: document.version
                        }).then(function (response) {
                            updatedItem = response.obj;
                            if (indexFolder && path) {
                                RepositoryService.saveItemToIndex(indexFolder, path, updatedItem);
                            }
                            return DBService.storeDocuments([updatedItem]);
                        }).then(function () {
                            resolve(updatedItem);
                        });
                    }, reject);
                });
            };


            var undoCheckOutDocument = function (document, indexFolder, path) {
                return $q(function (resolve, reject) {
                    var updatedItem;
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.documents.checkOutDocument({
                            workspaceId: document.workspaceId,
                            documentId: document.documentMasterId,
                            documentVersion: document.version
                        }).then(function (response) {
                            updatedItem = response.obj;
                            if (indexFolder && path) {
                                RepositoryService.saveItemToIndex(indexFolder, path, updatedItem);
                            }
                            return DBService.storeDocuments([updatedItem]);
                        }).then(function () {
                            resolve(updatedItem);
                        });
                    }, reject);
                });
            };


            var checkInPart = function (part, indexFolder, path) {
                return $q(function (resolve, reject) {
                    var updatedItem;
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.part.checkIn({
                            workspaceId: part.workspaceId,
                            partNumber: part.number,
                            partVersion: part.version
                        }).then(function (response) {
                            updatedItem = response.obj;
                            if (indexFolder && path) {
                                RepositoryService.saveItemToIndex(indexFolder, path, updatedItem);
                            }
                            return DBService.storeParts([updatedItem]);
                        }).then(function () {
                            resolve(updatedItem);
                        });
                    }, reject);
                });
            };

            var checkOutPart = function (part, indexFolder, path) {
                return $q(function (resolve, reject) {
                    var updatedItem;
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.part.checkOut({
                            workspaceId: part.workspaceId,
                            partNumber: part.number,
                            partVersion: part.version
                        }).then(function (response) {
                            updatedItem = response.obj;
                            if (indexFolder && path) {
                                RepositoryService.saveItemToIndex(indexFolder, path, updatedItem);
                            }
                            return DBService.storeParts([updatedItem]);
                        }).then(function () {
                            resolve(updatedItem);
                        });
                    }, reject);
                });
            };

            var undoCheckOutPart = function (part, indexFolder, path) {
                return $q(function (resolve, reject) {
                    var updatedItem;
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.part.undoCheckOut({
                            workspaceId: part.workspaceId,
                            partNumber: part.number,
                            partVersion: part.version
                        }).then(function (response) {
                            updatedItem = response.obj;
                            if (indexFolder && path) {
                                RepositoryService.saveItemToIndex(indexFolder, path, updatedItem);
                            }
                            return DBService.storeParts([updatedItem]);
                        }).then(function () {
                            resolve(updatedItem);
                        });
                    }, reject);
                });
            };

            var saveDocumentNote = function (document, note) {
                return $q(function (resolve, reject) {
                    DocdokuAPIService.getApi().then(function (api) {
                        var lastDocumentIteration = lastIteration(document);
                        api.apis.document.updateDocumentIteration({
                            workspaceId: document.workspaceId,
                            documentId: document.documentMasterId,
                            documentVersion: document.version,
                            docIteration: lastDocumentIteration.iteration,
                            body: {
                                revisionNote: note
                            }
                        }).then(function (response) {
                            angular.copy(response.obj, lastDocumentIteration);
                            return DBService.storeDocuments([document]).then(resolve);
                        }, reject);
                    });
                });
            };

            var savePartNote = function (part, note) {
                return $q(function (resolve, reject) {
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.part.updatePartIteration({
                            workspaceId: part.workspaceId,
                            partNumber: part.number,
                            partVersion: part.version,
                            partIteration: lastIteration(part).iteration,
                            body: {
                                iterationNote: note
                            }
                        }).then(function (response) {
                            return DBService.storeParts([response.obj]).then(resolve);
                        }, reject);
                    });
                });
            };

            var saveNote = function (item, note) {
                if (item.documentMasterId) {
                    return saveDocumentNote(item, note);
                } else if (item.number) {
                    return savePartNote(item, note);
                }
            };

            this.workspaces = [];

            this.reset = function () {
                _this.workspaces.length = 0;
            };

            this.getWorkspaces = function () {
                return $q(function (resolve, reject) {
                    DocdokuAPIService.getApi().then(function (api) {
                        api.workspaces.getWorkspacesForConnectedUser()
                            .then(function (response) {
                                angular.copy(response.obj.allWorkspaces.map(function (workspace) {
                                    return workspace.id;
                                }), _this.workspaces);
                                resolve(_this.workspaces);
                            }, reject);
                    }, reject);
                });
            };

            this.createPartInWorkspace = function (part) {
                return $q(function (resolve, reject) {
                    var createdPart;
                    DocdokuAPIService.getApi().then(function (api) {
                        api.parts.createNewPart({
                            workspaceId: part.workspaceId,
                            body: part
                        }).then(function (response) {
                            createdPart = response.obj;
                            return DBService.storeParts([createdPart]);
                        }, reject).then(function () {
                            resolve(createdPart);
                        });
                    }, reject);
                });
            };

            this.createDocumentInWorkspace = function (document) {
                return $q(function (resolve, reject) {
                    var createdDocument;
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.folders.createDocumentMasterInFolder({
                            workspaceId: document.workspaceId,
                            folderId: document.workspaceId,
                            body: document
                        }).then(function (response) {
                            createdDocument = response.obj;
                            return DBService.storeDocuments([createdDocument]);
                        }, reject).then(function () {
                            resolve(createdDocument);
                        });
                    }, reject);
                });
            };

            this.refreshData = function (workspaceId) {

                var deferred = $q.defer();
                var totalDocuments = 0;
                var totalParts = 0;
                var done = 0, total = 4;

                deferred.notify({total: total, done: done, workspaceId: workspaceId});

                _this.fetchDocumentsCount(workspaceId).then(function (count) {
                    totalDocuments = count;
                    deferred.notify({total: total, done: ++done, workspaceId: workspaceId});
                    return workspaceId;
                }).then(_this.fetchPartsCount).then(function (count) {
                    totalParts = count;
                    deferred.notify({total: total, done: ++done, workspaceId: workspaceId});
                    return _this.fetchParts(workspaceId, 0, totalParts);
                }).then(function () {
                    deferred.notify({total: total, done: ++done, workspaceId: workspaceId});
                    return _this.fetchDocuments(workspaceId, 0, totalDocuments);
                }).finally(function () {
                    deferred.notify({total: total, done: ++done, workspaceId: workspaceId});
                    onWorkspaceSynced(workspaceId);
                    deferred.resolve();
                });

                return deferred.promise;
            };

            this.fetchParts = function (workspace, start, max) {
                return $q(function (resolve, reject) {
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.parts.getPartRevisions({
                            workspaceId: workspace,
                            start: start,
                            length: max
                        }).then(function (response) {
                            return DBService.storeParts(response.obj);
                        }).then(resolve);
                    }, reject);
                });
            };

            this.fetchPartsCount = function (workspace) {
                return $q(function (resolve, reject) {
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.parts.getTotalNumberOfParts({
                            workspaceId: workspace
                        }).then(function (response) {
                            resolve(response.obj.count);
                        });
                    }, reject);
                });
            };

            this.fetchDocuments = function (workspace, start, max) {
                return $q(function (resolve, reject) {
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.documents.getDocumentsInWorkspace({
                            workspaceId: workspace,
                            start: start,
                            max: max
                        }).then(function (response) {
                            return DBService.storeDocuments(response.obj);
                        }).then(resolve);
                    }, reject);
                });
            };

            this.fetchDocumentsCount = function (workspace) {
                return $q(function (resolve, reject) {
                    DocdokuAPIService.getApi().then(function (api) {
                        api.apis.documents.getDocumentsInWorkspaceCount({
                            workspaceId: workspace
                        }).then(function (response) {
                            resolve(response.obj.count);
                        });
                    }, reject);
                });
            };

            this.fetchAllWorkspaces = function (workspaceIds) {

                var deferred = $q.defer();
                var chain = $q.when();

                angular.forEach(workspaceIds, function (workspaceId) {
                    chain = chain.then(function () {
                        return _this.refreshData(workspaceId);
                    });
                });

                chain.then(deferred.resolve, null, deferred.notify);

                return deferred.promise;
            };


            this.checkInItems = function (files, folderPath) {

                var deferred = $q.defer();
                var chain = $q.when();
                var total = files.length, done = 0;

                angular.forEach(files, function (file) {
                    chain = chain.then(function () {
                        if (file.item.documentMasterId) {
                            return checkInDocument(file.item, folderPath, file.path).then(function (item) {
                                file.item = item;
                                deferred.notify({total: total, done: ++done});
                            });
                        } else if (file.item.number) {
                            return checkInPart(file.item, folderPath, file.path).then(function (item) {
                                file.item = item;
                                deferred.notify({total: total, done: ++done});
                            });
                        }
                    });
                });

                chain.then(deferred.resolve);

                return deferred.promise;
            };

            this.checkOutItems = function (files, folderPath) {

                var deferred = $q.defer();
                var chain = $q.when();
                var total = files.length, done = 0;

                angular.forEach(files, function (file) {
                    chain = chain.then(function () {
                        if (file.item.documentMasterId) {
                            return checkOutDocument(file.item, folderPath, file.path).then(function (item) {
                                file.item = item;
                                deferred.notify({total: total, done: ++done});
                            });
                        } else if (file.item.number) {
                            return checkOutPart(file.item, folderPath, file.path).then(function (item) {
                                file.item = item;
                                deferred.notify({total: total, done: ++done});
                            });
                        }
                    });
                });

                chain.then(deferred.resolve);

                return deferred.promise;
            };

            this.undoCheckOutItems = function (files, folderPath) {

                var deferred = $q.defer();
                var chain = $q.when();
                var total = files.length, done = 0;

                angular.forEach(files, function (file) {
                    chain = chain.then(function () {
                        if (file.item.documentMasterId) {
                            return undoCheckOutDocument(file.item, folderPath, file.path).then(function (item) {
                                file.item = item;
                                deferred.notify({total: total, done: ++done});
                            });
                        } else if (file.item.number) {
                            return undoCheckOutPart(file.item, folderPath, file.path).then(function (item) {
                                file.item = item;
                                deferred.notify({total: total, done: ++done});
                            });
                        }
                    });
                });

                chain.then(deferred.resolve);

                return deferred.promise;
            };

            var getLatestDateInIteration = function (iteration) {
                var date = iteration.creationDate;
                if (date < iteration.modificationDate) {
                    date = iteration.modificationDate;
                }
                if (date < iteration.checkInDate) {
                    date = iteration.checkInDate;
                }
                return new Date(date).getTime();
            };


            var latestEventSort = function (a, b) {
                return getLatestDateInIteration(b.lastIteration) - getLatestDateInIteration(a.lastIteration);
            };

            var hasLastIteration = function (obj) {
                obj.lastIteration = lastIteration(obj);
                return obj.lastIteration;
            };

            this.getLatestEventsInWorkspace = function (workspaceId, max) {
                var deferred = $q.defer();
                var items = [];
                DBService.getDocuments(workspaceId).then(function (documents) {
                    items = items.concat(documents);
                    return workspaceId;
                }).then(DBService.getParts).then(function (parts) {
                    items = items.concat(parts);
                }).then(function () {
                    deferred.resolve(items.filter(hasLastIteration).sort(latestEventSort).slice(0, max));
                });
                return deferred.promise;
            };

            this.workspaceSyncs = angular.fromJson($window.localStorage.workspaceSyncs || '{}');

            var onWorkspaceSynced = function (workspace) {
                _this.workspaceSyncs[workspace] = new Date();
                $window.localStorage.workspaceSyncs = angular.toJson(_this.workspaceSyncs);
            };

            this.resetWorkspaceSyncs = function () {
                _this.workspaceSyncs = {};
                $window.localStorage.workspaceSyncs = '{}';
            };


            this.updateItemNotes = function (items, note) {
                var deferred = $q.defer();

                var chain = $q.when();
                var total = items.length, done = 0;
                angular.forEach(items, function (item) {
                    chain = chain.then(function () {
                        return saveNote(item, note).then(function () {
                            deferred.notify({total: total, done: ++done});
                        });
                    });
                });

                chain.then(function () {
                    deferred.resolve();
                });

                return deferred.promise;
            };


        });
})();
