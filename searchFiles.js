/*global define, brackets, $ */

define( function( require, exports ) {
	"use strict";

	var DocumentManager = brackets.getModule( 'document/DocumentManager' ),
		FileSystem = brackets.getModule( 'filesystem/FileSystem' ),
		PanelManager = brackets.getModule( 'view/PanelManager' ),
		ProjectManager = brackets.getModule( 'project/ProjectManager' ),
		Resizer = brackets.getModule( 'utils/Resizer' ),
		resultTemplate = require( "text!searchFilesResult.html" ),
		projectFilesList = [],
		html;

	function SearchFiles() {

		this.build = function( ext ) {

			this.extensions = ext;
			this.currentExt = null;

			PanelManager.createBottomPanel( 'searchFiles.panel', $( resultTemplate ), 100 )

			this.input = document.getElementById( 'search-files-input' );
			this.searchFilesTable = document.getElementById( 'search-files-table' );
			this.searchFilesPanel = document.getElementById( 'search-files-results' );
			this.extensionsContainer = document.getElementById( 'search-files-extension-container' );
			this.closeSearchFilesButton = document.getElementById( 'close-search-files-button' );

			this.buildSearchButton();
			this.buildExtensions();
			this.initEvents();

		};

		this.buildExtensions = function() {

			for ( var i = 0; i < this.extensions.length; i++ ) {
				var ext = document.createElement( 'div' );
				ext.className = 'search-files-extension';
				ext.innerHTML = this.extensions[ i ];
				ext.addEventListener( 'click', function() {
					this.currentExt = this.extensions[ i ];
					this.search( this.isInExtension );
				}.bind( this ) );
				this.extensionsContainer.appendChild( ext );
			}

		},

		this.initEvents = function() {

			this.input.addEventListener( 'keyup', this.handleKeyCode.bind( this ) );
			$( ProjectManager ).on( "projectOpen", this.resetPanel.bind( this ) );
			FileSystem.on( "rename", this.resetPanel.bind( this ) );
			this.closeSearchFilesButton.addEventListener( 'click', this.resetPanel.bind( this ) );

		},

		this.buildSearchButton = function() {

			var projectFilesHeader = document.getElementById( 'project-files-header' ),
				searchButton = document.createElement( 'div' );

			searchButton.id = 'search-files-button';
			searchButton.addEventListener( 'click', this.show.bind( this ) );

			projectFilesHeader.appendChild( searchButton );

		};

		this.openFile = function( url ) {

			DocumentManager.getDocumentForPath( url ).done( function( doc ) {
				DocumentManager.setCurrentDocument( doc );
				this.input.focus();
			}.bind( this ) );

		};

		this.checkResultNb = function() {

			if ( this.results.length > 0 ) {
				$( '#no-find-file' ).hide();
				$( '#number-found-files' ).text( this.results.length + ' found file(s) among ' + this.projectFilesListLength + ' files' ).show();
			} else {
				$( '#number-found-files' ).empty().hide();
				$( '#number-analysed-files' ).text( this.projectFilesListLength );
				$( '#no-find-file' ).show();
			}

		};

		this.listProjectFiles = function() {

			ProjectManager.getAllFiles().done( function( fileListResult ) {
				var fileListResultLength = fileListResult.length,
					i,
					dot,
					fileData;
				for ( i = 0; i < fileListResultLength; i += 1 ) {
					dot = fileListResult[ i ].name.lastIndexOf( "." );
					projectFilesList.push( {
						name: fileListResult[ i ].name.substring( 0, dot ),
						ext: fileListResult[ i ].name.substring( dot ),
						nameWithExtension: fileListResult[ i ].name,
						fullPath: fileListResult[ i ].fullPath,
					} );
				}
				this.resultNb = this.projectFilesListLength = projectFilesList.length;
			}.bind( this ) );

		};

		this.displayResults = function() {

			for ( var i = 0; i < this.results.length; i++ ) {

				var res = this.results[ i ],
					row = document.createElement( 'tr' );

				row.className = "search-files-result";
				row.innerHTML = '<td>' + res.name + '</td>';
				row.innerHTML += '<td>' + res.path + '</td>';
				row.path = res.path;
				row.addEventListener( 'click', function() {
					this.openFile( res.path )
				}.bind( this ) );

				this.searchFilesTable.appendChild( row );

			}

			this.checkResultNb();

		};

		this.isInExtension = function( f ) {

			return ( f.name.indexOf( this.input.value ) !== -1 && this.currentExt === f.ext );

		};

		this.isInName = function( f ) {

			return ( f.nameWithExtension.indexOf( this.input.value ) !== -1 );

		};

		this.search = function( isIn ) {

			this.resetSearch();

			for ( var i = 0; i < this.projectFilesListLength; i += 1 ) {
				if ( isIn.bind( this )( projectFilesList[ i ] ) ) {
					this.results.push( {
						name: projectFilesList[ i ].nameWithExtension,
						path: projectFilesList[ i ].fullPath
					} );
				}
			}

			this.displayResults();

		};

		this.resetSearch = function() {

			this.searchFilesTable.innerHTML = '';
			this.results = [];

		};

		this.resetPanel = function() {

			this.resetSearch();
			this.input.value = '';
			$( '#number-found-files' ).hide();
			projectFilesList = [];
			this.removeSelectedRow();
			Resizer.hide( this.searchFilesPanel );

		};

		this.handleKeyCode = function( e ) {

			var key = e.keyCode,
				ref = {
					13: function() {
						if ( $( '.search-files-result.selected' ).length > 0 )
							this.openFile( document.querySelector( '.search-files-result.selected' ).path )
					}.bind( this ),
					40: function() {
						if ( $( '.search-files-result.selected' ).length === 0 )
							$( '#search-files-table .search-files-result:first-child' ).addClass( 'selected' );
						else
							$( '.search-files-result.selected' ).removeClass( 'selected' ).next().addClass( 'selected' );
					},
					38: function() {
						if ( $( '.search-files-result.selected' ).length === 0 )
							$( '#search-files-table .search-files-result:last-child' ).addClass( 'selected' );
						else
							$( '.search-files-result.selected' ).removeClass( 'selected' ).prev().addClass( 'selected' );
					}
				};

			if ( ref.hasOwnProperty( key ) ) {
				ref[ key ]();
			} else {
				this.removeSelectedRow();
				this.search( this.isInName );
			}

		};

		this.removeSelectedRow = function() {

			$( '.search-files-result.selected' ).removeClass( 'selected' );

		};

		this.show = function() {

			Resizer.show( this.searchFilesPanel );
			this.listProjectFiles();
			this.input.focus();

		};

	};

	exports.SearchFiles = SearchFiles;

} );