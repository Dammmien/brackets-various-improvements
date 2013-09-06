/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";
  
    var DocumentManager   = brackets.getModule('document/DocumentManager');

    function folderCloser() {
        $('#project-files-header').append('<div id="closeAllFolders">&times;</div>');
        $('#closeAllFolders').on('click', function () {
            $('.jstree-open').addClass('jstree-closed').removeClass('jstree-open');
            $('.jstree-clicked').click();
            $('#project-files-container').scrollTop(0);
        });
    }
  
    function updateSizeInfo(currentDoc) {
        var currentDocContent = currentDoc.getText(),
            currentDocSize = currentDocContent.length;
        if (currentDocSize < 1024) {
            currentDocSize += ' o';
        } else {
            currentDocSize = Math.floor(currentDocSize / 1024).toString() + '.' + (currentDocSize % 1024).toString().substring(0, 2) + ' ko';
        }
        $('#fileSizeInfo').text(currentDocSize);
    }
    
    function updatePathInfo(currentDoc) {
        $('#filePathInfo').text(currentDoc.file.fullPath);
    }
  
    function onCurrentDocumentChange(event) {
        var currentDoc = DocumentManager.getCurrentDocument();
        if (currentDoc !== null) {
            updateSizeInfo(currentDoc);
            updatePathInfo(currentDoc);
        }
    }
  
    function fileInfo() {
        $(DocumentManager).on("currentDocumentChange", onCurrentDocumentChange);
        $('document').keypress(function (e) {
            var currentDoc = DocumentManager.getCurrentDocument();
            updateSizeInfo(currentDoc);
        });
        $('#status-language').after('<div id="fileSizeInfo"></div> <div id="filePathInfo"></div>');
    }
  
    function init() {
        fileInfo();
        folderCloser();
    }
    
    exports.init = init;

});
