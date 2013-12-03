/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";

    var DocumentManager     = brackets.getModule('document/DocumentManager'),
        FileSystem          = brackets.getModule('filesystem/FileSystem'),
        PanelManager        = brackets.getModule('view/PanelManager'),
        ProjectManager      = brackets.getModule('project/ProjectManager'),
        Resizer             = brackets.getModule('utils/Resizer'),
        resultTemplate      = require("text!searchFilesResult.html"),
        searchFilesPanel    = PanelManager.createBottomPanel('searchFiles.panel', $(resultTemplate), 100),
        $searchFilesPanel   = $('#search-files-results'),
        projectFilesList    = [],
        html;

    function checkResultNb(a, b) {
        if (a > 0) {
            $('#no-find-file').hide();
            $('#number-found-files').text(a + ' found file(s) among ' + b + ' files').show();
        } else {
            $('#number-found-files').empty().hide();
            $('#number-analysed-files').text(b);
            $('#no-find-file').show();
        }
    }

    function listProjectFiles() {
        ProjectManager.getAllFiles().done(function (fileListResult) {
            var fileListResultLength = fileListResult.length,
                i,
                dot,
                extension,
                fileData;
            for (i = 0; i < fileListResultLength; i += 1) {
                dot       = fileListResult[i].name.lastIndexOf(".");
                extension = fileListResult[i].name.substring(dot);
                fileData  = {name: fileListResult[i].name, fullPath: fileListResult[i].fullPath, ext: extension};
                projectFilesList.push(fileData);
            }
        });
    }

    function addToResult(name, path) {
        html = '<tr class="search-files-result" data-path="';
        html += path;
        html += '"><td>';
        html += name;
        html += '</td><td>';
        html += path;
        html += '</td></tr>';
        $('.search-files-table').append(html);
    }

    function searchInName(name_searched) {
        var projectFilesListLength = projectFilesList.length,
            resultNb = 0,
            i;
        $('.search-files-table').empty();
        for (i = 0; i < projectFilesListLength; i += 1) {
            if (projectFilesList[i].name.indexOf(name_searched) !== -1) {
                addToResult(projectFilesList[i].name, projectFilesList[i].fullPath);
                resultNb += 1;
            }
        }
        checkResultNb(resultNb, projectFilesListLength);
    }

    function searchInExtension(ext_searched, name_searched) {
        var projectFilesListLength = projectFilesList.length,
            resultNb = 0,
            i,
            ext,
            name;
        $('.search-files-table').empty();
        for (i = 0; i < projectFilesListLength; i += 1) {
            ext   = projectFilesList[i].ext;
            name  = name_searched === '*' ? '*' : projectFilesList[i].name;
            if (name.indexOf(name_searched) !== -1 && ext_searched.indexOf(ext) !== -1) {
                addToResult(projectFilesList[i].name, projectFilesList[i].fullPath);
                resultNb += 1;
            }
        }
        checkResultNb(resultNb, projectFilesListLength);
    }

    function resetSearch() {
        Resizer.hide($searchFilesPanel);
        $('.search-files-table').empty();
        projectFilesList = [];
    }


    function launchSearch() {
        Resizer.show($searchFilesPanel);
        listProjectFiles();
        $('.search-files-input').focus().keypress(function (e) {
            if (e.which === 13) {
                searchInName($('.search-files-input').val());
            }
        });
        $('.search-files-extension').on('click', function () {
            var name_searched = $('.search-files-input').val() !== '' ? $('.search-files-input').val() : '*',
                ext_searched  = $(this).attr('data-extension');
            searchInExtension(ext_searched, name_searched);
        });
        $searchFilesPanel.on('click', '.close', function () { resetSearch(); });
        $(ProjectManager).on("projectOpen", resetSearch);
        FileSystem.on("rename", resetSearch)
        FileSystem.on("change", resetSearch)
        $('.search-files-table').on('click', 'tr.search-files-result', function () {
            DocumentManager.getDocumentForPath($(this).attr('data-path')).done(function (doc) {
                DocumentManager.setCurrentDocument(doc);
            });
        });
    }

    function init() {
        $('#project-files-header').append('<div id="search-files-button"></div>');
        $('#search-files-button').on('click', function () {
            launchSearch();
        });
    }

    exports.init = init;
    exports.launchSearch = launchSearch;

});
