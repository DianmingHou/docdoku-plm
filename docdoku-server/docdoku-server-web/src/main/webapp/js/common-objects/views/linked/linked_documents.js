/*global APP_CONFIG*/
'use strict';
define([
    "common-objects/collections/linked/linked_document_collection",
    "common-objects/views/linked/linked_document",
    "text!common-objects/templates/linked/linked_items.html",
    "i18n!localization/nls/document-management-strings"
], function(LinkedDocumentCollection, LinkedDocumentView, template, i18n) {
    var LinkedDocumentsView = Backbone.View.extend({

        tagName: 'div',
        className: 'linked-items-view',

        initialize: function() {
            this.searchResults = [];
            this._subViews = [];
            var self = this;
            this.$el.on("remove",function(){
                _(self._subViews).invoke("remove");
            });
        },

        render: function() {
            var self = this;

            this.$el.html(Mustache.render(template,
                {
                    i18n: i18n,
                    editMode: this.options.editMode,
                    label: i18n.ADD_DOCUMENT,
                    view: this
                }
            ));

            this.bindDomElements();
            this.bindTypeahead();

            this.collection.each(function(linkedDocument) {
                self.addLinkView(linkedDocument);
            });

            return this;
        },

        bindDomElements: function() {
            this.documentReferenceInput = this.$(".linked-items-reference-typehead");
            this.linksUL = this.$("#linked-items-" + this.cid);
        },

        addLinkView: function(linkedDocument) {
            var linkView = new LinkedDocumentView({
                editMode: this.options.editMode,
                model: linkedDocument
            }).render();

            this._subViews.push(linkView);
            this.linksUL.append(linkView.el);
        },

        bindTypeahead: function() {
            var self = this;

            this.documentReferenceInput.typeahead({
                source: function(query, process) {
                    $.getJSON('/api/workspaces/' + APP_CONFIG.workspaceId + '/documents/docs_last_iter?q=' + query, function(data) {

                        self.searchResults = new LinkedDocumentCollection(data);

                        // Remove documents that are already linked
                        var docsToRemove = [];
                        self.searchResults.each(
                            function(documentIteration) {
                                var linkedDoc = self.collection.find(
                                    function(linkedDocument) {
                                        return linkedDocument.getDocKey() === documentIteration.getDocKey();
                                    });
                                if(!_.isUndefined(linkedDoc)){
                                    docsToRemove.push(documentIteration);
                                }
                            }
                        );
                        self.searchResults.remove(docsToRemove);

                        process(self.searchResults.map(function(docLastIter) {
                            return docLastIter.getDocKey();
                        }));
                    });
                },

                sorter: function(docsLastIterDocKey) {
                    return docsLastIterDocKey.sort();
                },

                updater: function(docLastIterDocKey) {
                    var linkedDocument = self.searchResults.find(function(docLastIter) {
                        return docLastIter.getDocKey() === docLastIterDocKey;
                    });
                    linkedDocument.collection.remove(linkedDocument);
                    self.collection.add(linkedDocument);

                    self.addLinkView(linkedDocument);
                }
            });
        }

    });
    return LinkedDocumentsView;
});