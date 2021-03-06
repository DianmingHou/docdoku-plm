(function () {

    'use strict';

    angular.module('dplm.pages')

        .config(function ($routeProvider) {
            $routeProvider.when('/', {
                controller: 'HomeCtrl',
                templateUrl: 'js/home/home.html'
            });
        })

        .controller('HomeCtrl', function ($scope, FolderService, WorkspaceService, RepositoryService) {

            var syncWorkspaces = function () {
                return WorkspaceService.fetchAllWorkspaces(WorkspaceService.workspaces);
            };

            var syncIndexes = function () {
                return RepositoryService.syncIndexes(FolderService.folders.map(function (folder) {
                    return folder.path;
                }));
            };

            var onError = function (error) {
                $scope.status = error;
            };

            var onProgress = function (status) {
                $scope.status = status;
            };

            var onSyncEnd = function () {
                $scope.$broadcast('refresh');
                $scope.status = null;
            };

            $scope.syncWorkspace = function (workspaceId) {
                WorkspaceService.refreshData(workspaceId)
                    .then(null, null, onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

            $scope.syncIndex = function (path) {
                RepositoryService.syncIndex(path)
                    .then(null, null, onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

            $scope.syncWorkspaces = function () {
                syncWorkspaces()
                    .then(null, null, onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

            $scope.syncIndexes = function () {
                syncIndexes()
                    .then(null, null, onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

            $scope.syncAll = function () {
                syncWorkspaces()
                    .then(syncIndexes)
                    .then(null, null, onProgress)
                    .catch(onError)
                    .finally(onSyncEnd);
            };

        })

        .controller('HistoryCtrl', function ($scope) {
            $scope.history = 'todo';
        })

        .controller('LatestEventsCtrl', function ($scope, WorkspaceService) {
            $scope.workspaces = WorkspaceService.workspaces;
        })

        .directive('folderLocalChanges', function () {
            return {
                restrict: 'A',
                templateUrl: 'js/home/folder-local-changes.html',
                scope: {
                    folder: '=folderLocalChanges'
                },
                controller: function ($scope, FolderService, FileUtils, RepositoryService) {

                    var folder = $scope.folder;
                    var path = $scope.folder.path;

                    var refresh = function () {

                        var index = RepositoryService.getRepositoryIndex(path);
                        var changedFiles = RepositoryService.getLocalChanges(folder);
                        $scope.items = changedFiles.map(function (filePath) {
                            return {
                                path: filePath,
                                index: RepositoryService.getFileIndex(index, filePath),
                                stat: FileUtils.stat(filePath)
                            };
                        });
                    };

                    $scope.$on('refresh', refresh);

                    refresh();
                }
            };
        })

        .directive('folder', function () {

            return {
                restrict: 'A',
                templateUrl: 'js/home/folder-item.html',
                scope: {
                    folder: '='
                },
                controller: function ($scope, FolderService, RepositoryService) {

                    var refresh = function () {
                        FolderService.getFilesCount($scope.folder.path).then(function (count) {
                            $scope.filesCount = count;
                        });

                        var index = RepositoryService.getRepositoryIndex($scope.folder.path);

                        var sortedEvents = Object.keys(index).filter(function (key) {
                            return key.endsWith('.lastModifiedDate');
                        }).map(function (key) {
                            return index[key];
                        }).sort(function (a, b) {
                            return a - b;
                        });

                        $scope.latestAction = sortedEvents.length ? sortedEvents[0] : '';

                    };

                    $scope.$on('refresh', refresh);

                    refresh();
                }
            };


        })

        .directive('workspaceLatestEvents', function () {
            return {
                restrict: 'A',
                templateUrl: 'js/home/workspace-latest-events.html',
                scope: {
                    workspaceId: '=workspaceLatestEvents',
                    syncWorkspace: '&',
                },
                controller: function ($scope, $filter, WorkspaceService, ConfigurationService) {

                    var lastIteration = $filter('lastIteration');
                    $scope.workspaceSyncs = WorkspaceService.workspaceSyncs;
                    $scope.configuration = ConfigurationService.configuration;

                    var refresh = function () {
                        $scope.loading = true;

                        WorkspaceService.getLatestEventsInWorkspace($scope.workspaceId, 5)
                            .then(function (events) {
                                $scope.events = events.map(function (item) {
                                    item.lastIteration = lastIteration(item);
                                    return item;
                                });
                            }).finally(function () {
                                $scope.loading = false;
                            });
                    };

                    $scope.$on('refresh', refresh);

                    refresh();
                }
            };
        });

})();
