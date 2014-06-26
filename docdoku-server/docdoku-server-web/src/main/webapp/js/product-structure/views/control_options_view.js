/*global App*/
define(
    [
        "text!templates/control_options.html",
        "i18n!localization/nls/product-structure-strings"
    ],
    function(template,i18n){

    var ControlOptionsView = Backbone.View.extend({

        template : Mustache.compile(template),

        className:"side_control_group",

        events:{
            "click button#gridSwitch": "gridSwitch",
            "click button#materialsSwitch": "materialsSwitch",
            "click button#screenshot": "takeScreenShot",
            "click button#show_edited_meshes": "show_edited_meshes"
        },

        initialize:function(){

        },

        gridSwitch:function(){
            var gridSwitch =$("#gridSwitch");
            gridSwitch.toggleClass("active");
            App.SceneOptions.grid = !!gridSwitch.hasClass("active");
        },

        materialsSwitch:function(){
            var materialsSwitch = $("#materialsSwitch");
            materialsSwitch.toggleClass("active");
            if (materialsSwitch.hasClass("active")) {
                App.sceneManager.switchWireFrame(true);
            } else {
                App.sceneManager.switchWireFrame(false);
            }
        },

        takeScreenShot:function(){
            App.sceneManager.takeScreenShot();
        },

        render:function(){
            this.$el.html(this.template({i18n:i18n}));
            return this;
        },

        show_edited_meshes:function(){
            $('#show_edited_meshes').toggleClass("active");
            if ($('#show_edited_meshes').hasClass("active")){
                App.sceneManager.showEditedMeshes(true);
            } else {
                App.sceneManager.showEditedMeshes(false);
            }
        }


    });

    return ControlOptionsView;

});