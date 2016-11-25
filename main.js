/*global define, brackets */

define( function( require, exports, module ) {
    "use strict";

    var PreferencesManager = brackets.getModule( "preferences/PreferencesManager" ),
        prefs = PreferencesManager.getExtensionPrefs( "brackets-various-improvements" ),
        userPrefs = prefs.get( "user-prefs" );

    if ( userPrefs === undefined ) {

        prefs.definePreference( "user-prefs", "object", null );

        userPrefs = {
            "enabled-features": {
                "case-converter": true,
                "better-interface": true,
                "super-clipboard": true,
                "search-files": true
            },
            "files-extensions": [
                '.js',
                '.css',
                '.html'
            ],
            "units": "byte"
        }

        prefs.set( "user-prefs", userPrefs );

        prefs.save();

    }

    var enabledFeatures = userPrefs[ "enabled-features" ],
        CommandManager = brackets.getModule( 'command/CommandManager' ),
        Menus = brackets.getModule( 'command/Menus' ),
        ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
        menu = Menus.getContextMenu( Menus.ContextMenuIds.EDITOR_MENU );

    if ( enabledFeatures[ "case-converter" ] ) {

        var caseConverter = require( "caseConverter" ),
            COMMAND_ID_U = 'caseConverter.uppercase',
            COMMAND_ID_L = 'caseConverter.lowercase';

        CommandManager.register( "Convert to uppercase", COMMAND_ID_U, caseConverter.uppercase );
        CommandManager.register( "Convert to lowercase", COMMAND_ID_L, caseConverter.lowercase );

        menu.addMenuItem( COMMAND_ID_U, "Ctrl-Shift-U" );
        menu.addMenuItem( COMMAND_ID_L, "Ctrl-Shift-L" );

    }

    if ( enabledFeatures[ "better-interface" ] ) {

        var BetterInterface = require( "betterInterface" ).BetterInterface,
            betterInterface = new BetterInterface( userPrefs.units ),
            COMMAND_ID_X = 'betterInterface.closeAllFolders';

        CommandManager.register( "Close all Folders", COMMAND_ID_X, betterInterface.onCloseFolders );

        menu.addMenuItem( COMMAND_ID_X, "Ctrl-Alt-Shift-X" );

        betterInterface.init();

    }

    if ( enabledFeatures[ "super-clipboard" ] ) {

        var superClipboard = require( "superClipboard" ),
            COMMAND_ID_C = 'superClipboard.cut',
            COMMAND_ID_V = 'superClipboard.paste';

        CommandManager.register( "Super Cut", COMMAND_ID_C, superClipboard.cut );
        CommandManager.register( "Super Paste", COMMAND_ID_V, superClipboard.paste );

        menu.addMenuItem( COMMAND_ID_C, "Ctrl-Alt-C" );
        menu.addMenuItem( COMMAND_ID_V, "Ctrl-Alt-V" );

    }

    menu.addMenuDivider();

    if ( enabledFeatures[ "search-files" ] ) {

        var SearchFiles = require( "searchFiles" ).SearchFiles,
            searchFiles = new SearchFiles(),
            COMMAND_ID_F = 'searchFiles.show';

        CommandManager.register( "Search File", COMMAND_ID_F, searchFiles.show.bind( searchFiles ) );

        menu.addMenuItem( COMMAND_ID_F, "Ctrl-Alt-F" );

        searchFiles.build( userPrefs[ 'files-extensions' ] );

    }

    ExtensionUtils.loadStyleSheet( module, 'style.css' );

} );
