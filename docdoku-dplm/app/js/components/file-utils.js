(function () {

    'use strict';

    angular.module('dplm.services')

        .constant('READ_ONLY', '0444')
        .constant('READ_WRITE', '0644')
        .constant('INDEX_LOCATION', '/.dplm/index.json')
        .constant('INDEX_SEARCH_PATTERN', '**/.dplm/index.json')

        .factory('Available3DLoaders', function () {
            return ['js', 'json', 'obj', 'stl', 'dae', 'ply', 'wrl', 'bin'];
        })

        .service('FileUtils', function ($window, $filter, READ_WRITE) {

            var sys = $window.require('sys');
            var fs = $window.require('fs');
            var exec = $window.require('child_process').exec;
            var fileMode = $filter('fileMode');

            this.openInOS = function (file) {

                var cmd;
                switch ($window.process.platform) {
                    case 'darwin' :
                        cmd = 'open';
                        break;
                    case 'win32' :
                    case 'win64' :
                        cmd = 'start';
                        break;
                    case 'linux':
                        cmd = 'xdg-open';
                        break;
                    default:
                        break;
                }
                if (!cmd) {
                    // Should use toast service
                } else {
                    exec(cmd + ' "' + file + '"');
                }
            };

            this.createFile = function (folder, name) {
                var filePath = folder + '/' + name;
                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(filePath, '');
                    return filePath;
                }
                return null;
            };

            this.stat = function (path) {
                return fs.statSync(path);
            };

            this.fileExists = function(path){
                try{
                    fs.statSync(path);
                    return true;
                } catch(e){
                    return false;
                }
            };

            this.setWritable = function(path){
                fs.chmodSync(path, READ_WRITE);
            };

            this.setFileMode = function (path, item) {
                fs.chmodSync(path, fileMode(item));
            };

        });

})();