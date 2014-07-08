/*global define, brackets, $ */

define( function( require, exports, module ) {

    "use strict";

    var DocumentManager = brackets.getModule( 'document/DocumentManager' );

    function BetterInterface( units ) {

        this.units = units;

        this.init = function() {

            this.buildFolderCloser();
            this.buildFileInfo();

        };

        this.buildFolderCloser = function() {

            var closeButton = document.createElement( 'div' ),
                projectFilesHeader = document.getElementById( 'project-files-header' );
            closeButton.innerHTML = '&times;';
            closeButton.id = 'closeAllFolders';
            closeButton.addEventListener( 'click', this.onCloseFolders.bind( this ) );
            projectFilesHeader.appendChild( closeButton );

        };

        this.buildFileInfo = function() {

            $( DocumentManager ).on( "currentDocumentChange", this.onCurrentDocumentChange.bind( this ) );
            $( document ).on( 'keypress', this.onCurrentDocumentChange.bind( this ) );
            $( '#status-language' ).after( '<div id="fileSizeInfo"></div> <div id="fileDateInfo"></div>' );

        };

        this.onCloseFolders = function() {

            $( '.jstree-open' ).addClass( 'jstree-closed' ).removeClass( 'jstree-open' );
            $( '.jstree-clicked' ).click();
            $( '#project-files-container' ).scrollTop( 0 );

        };

        this.updateSizeInfo = function() {

            var docSize = this.currentDoc.getText().length,
                unitLabel = {
                    'octet': 'O',
                    'byte': 'B',
                    'bit': 'b'
                };

            if ( this.units === 'bit' ) docSize = docSize * 8;

            if ( docSize < 1024 ) docSize += ' ' + unitLabel[ this.units ];
            else docSize = Math.floor( docSize / 1024 ).toString() + '.' + ( docSize % 1024 ).toString().substring( 0, 2 ) + ' K' + unitLabel[ this.units ];

            $( '#fileSizeInfo' ).text( '~ ' + docSize );

        };

        this.updateDateInfo = function() {

            var year = this.currentDoc.diskTimestamp.getFullYear(),
                month = this.currentDoc.diskTimestamp.getMonth() + 1,
                date = this.currentDoc.diskTimestamp.getDate(),
                hours = this.currentDoc.diskTimestamp.getHours(),
                minutes = this.currentDoc.diskTimestamp.getMinutes();

            month = month < 10 ? '0' + month : month;
            date = date < 10 ? '0' + date : date;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;

            $( '#fileDateInfo' ).text( year + '-' + month + '-' + date + ' at ' + hours + ':' + minutes );

        };

        this.onCurrentDocumentChange = function() {

            this.currentDoc = DocumentManager.getCurrentDocument();
            if ( this.currentDoc === null ) return false;
            this.updateSizeInfo();
            this.updateDateInfo();

        };

    }

    exports.BetterInterface = BetterInterface;

} );