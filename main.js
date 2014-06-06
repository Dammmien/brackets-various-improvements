/*global define, brackets */

define(function (require, exports, module) {
    "use strict";
  
    var CommandManager    = brackets.getModule('command/CommandManager'),
        Menus             = brackets.getModule('command/Menus'),
        ExtensionUtils    = brackets.getModule('utils/ExtensionUtils'),
        
        betterInterface   = require("betterInterface"),
        caseConverter     = require("caseConverter"),
        superClipboard    = require("superClipboard"),
        searchFiles       = require("searchFiles"),
        
        COMMAND_ID_U      = 'caseConverter.uppercase',
        COMMAND_ID_L      = 'caseConverter.lowercase',
        COMMAND_ID_C      = 'superClipboard.cut',
        COMMAND_ID_V      = 'superClipboard.paste',
        COMMAND_ID_F      = 'searchFiles.launchSearch',
        
        menu              = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    
    CommandManager.register("Convert to uppercase", COMMAND_ID_U, caseConverter.uppercase);
    CommandManager.register("Convert to lowercase", COMMAND_ID_L, caseConverter.lowercase);
    CommandManager.register("Super Cut", COMMAND_ID_C, superClipboard.cut);
    CommandManager.register("Super Paste", COMMAND_ID_V, superClipboard.paste);
    CommandManager.register("Search File", COMMAND_ID_F, searchFiles.launchSearch);
    
    menu.addMenuDivider();
    menu.addMenuItem(COMMAND_ID_U);
    menu.addMenuItem(COMMAND_ID_L);
    menu.addMenuItem(COMMAND_ID_C, "Ctrl-Alt-C");
    menu.addMenuItem(COMMAND_ID_V, "Ctrl-Alt-V");
    menu.addMenuItem(COMMAND_ID_F, "Ctrl-Alt-F");
    
    ExtensionUtils.loadStyleSheet(module, 'style.css');
    
    betterInterface.init();
    searchFiles.init();
});
