/* global define, brackets */

define( function( require, exports, module ) {

    "use strict";

    var DocumentManager = brackets.getModule( 'document/DocumentManager' ),
        EditorManager = brackets.getModule( 'editor/EditorManager' ),
        txt = "";

    this.superClipboard = function( cut ) {

        var currentEditor = EditorManager.getCurrentFullEditor(),
            selectedText = currentEditor.getSelectedText(),
            selectedPos = currentEditor.getSelection(),
            doc = DocumentManager.getCurrentDocument(),
            start = selectedPos.start,
            end = selectedPos.end;

        if ( cut ) txt = selectedText;
        else doc.replaceRange( txt, start, end );

    }

    this.cut = function() {
        superClipboard( true );
    }
    this.paste = function() {
        superClipboard( false );
    }

    exports.cut = this.cut;
    exports.paste = this.paste;

} );