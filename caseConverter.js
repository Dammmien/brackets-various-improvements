/*global define, brackets*/

define(function (require, exports, module) {
    "use strict";
  
    var DocumentManager   = brackets.getModule('document/DocumentManager'),
        EditorManager     = brackets.getModule('editor/EditorManager');

    function convertTo(uppercase) {
        var currentEditor     = EditorManager.getCurrentFullEditor(),
            selectedText      = currentEditor.getSelectedText(),
            selectedPos       = currentEditor.getSelection(),
            doc               = DocumentManager.getCurrentDocument(),
            start             = selectedPos.start,
            end               = selectedPos.end,
            txt               = "";
    
        if (uppercase) {
            txt = selectedText.toUpperCase();
        } else {
            txt = selectedText.toLowerCase();
        }
    
        doc.replaceRange(txt, start, end);
    }
  
    function uppercase() { convertTo(true); }
    function lowercase() { convertTo(false); }
  
    exports.uppercase = uppercase;
    exports.lowercase = lowercase;
  
});
