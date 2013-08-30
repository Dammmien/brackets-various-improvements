/* global define, brackets */

define(function (require, exports, module) {
    "use strict";
  
    var DocumentManager = brackets.getModule('document/DocumentManager'),
        EditorManager   = brackets.getModule('editor/EditorManager'),
        txt             = "";

    function superClipboard(cut) {
        var currentEditor     = EditorManager.getCurrentFullEditor(),
            selectedText      = currentEditor.getSelectedText(),
            selectedPos       = currentEditor.getSelection(),
            doc               = DocumentManager.getCurrentDocument(),
            start             = selectedPos.start,
            end               = selectedPos.end;
        
        if (cut) {
            txt = selectedText;
        } else {
            doc.replaceRange(txt, start, end);
        }
    }
  
    function cut() { superClipboard(true); }
    function paste() { superClipboard(false); }
    
    exports.cut = cut;
    exports.paste = paste;
});
