/*global define, brackets */

define( function( require, exports, module ) {

    "use strict";

    var DocumentManager = brackets.getModule( 'document/DocumentManager' ),
        EditorManager = brackets.getModule( 'editor/EditorManager' );

    this.convert = function( uppercase ) {
        var currentEditor = EditorManager.getCurrentFullEditor(),
            selectedText = currentEditor.getSelectedText(),
            selectedPos = currentEditor.getSelection(),
            doc = DocumentManager.getCurrentDocument(),
            start = selectedPos.start,
            end = selectedPos.end,
            txt = "";

        if ( uppercase ) txt = selectedText.toUpperCase();
        else txt = selectedText.toLowerCase();

        doc.replaceRange( txt, start, end );

    };

    this.uppercase = function() {
        this.convert( true );
    }.bind( this );

    this.lowercase = function() {
        this.convert( false );
    }.bind( this );

    exports.uppercase = this.uppercase;
    exports.lowercase = this.lowercase;

} );