/*!
 * IU Search
 * @version v3.2.1
 * 2019-08-08
 */

;(function (window, document, undefined ) {

    // Include apollo just for class checking/toggles
    /*! apollo.js v1.7.0 | (c) 2014 @toddmotto | https://github.com/toddmotto/apollo */
    !function(n,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t:n.apollo=t()}(this,function(){"use strict";var n,t,s,e,o={},c=function(n,t){"[object Array]"!==Object.prototype.toString.call(n)&&(n=n.split(" "));for(var s=0;s<n.length;s++)t(n[s],s)};return"classList"in document.documentElement?(n=function(n,t){return n.classList.contains(t)},t=function(n,t){n.classList.add(t)},s=function(n,t){n.classList.remove(t)},e=function(n,t){n.classList.toggle(t)}):(n=function(n,t){return new RegExp("(^|\\s)"+t+"(\\s|$)").test(n.className)},t=function(t,s){n(t,s)||(t.className+=(t.className?" ":"")+s)},s=function(t,s){n(t,s)&&(t.className=t.className.replace(new RegExp("(^|\\s)*"+s+"(\\s|$)*","g"),""))},e=function(e,o){(n(e,o)?s:t)(e,o)}),o.hasClass=function(t,s){return n(t,s)},o.addClass=function(n,s){c(s,function(s){t(n,s)})},o.removeClass=function(n,t){c(t,function(t){s(n,t)})},o.toggleClass=function(n,t){c(t,function(t){e(n,t)})},o});

    function IUSearch() {
        this.settings = {
            CX: {},
            attributes: {
                resultsUrl: '/search'
            },
            opts: {
                "cx": '',
                "language": "en",
                "theme": "V2_DEFAULT",
                "uiOptions": {
                    "enableAutoComplete":1,
                    "enableImageSearch":false,
                    "imageSearchLayout":"popup",
                    "resultSetSize":"filtered_cse",
                    "enableOrderBy":1,
                    "orderByOptions":[
                        {
                            "label":"Relevance",
                            "key":""
                        },
                        {
                            "label":"Date",
                            "key":"date"
                        }
                    ],
                    "overlayResults":false,
                    "refinementStyle":"tab",
                    "webSearchSafesearch":"google.search.Search.SAFESEARCH_MODERATE",
                    "queryParameterName":"q",
                    "enableMobileLayout":false,
                    "numTopRefinements":-1,
                    "showBookmarkLink":false,
                    "isSitesearch":false,
                    "enableSpeech":1
                },
                "protocol":"http",
                "uds":"www.google.com",
                "rawCss":"\n"
            },
            searchBoxIDs: ['search'],
            wrapClass: "row pad"
        };

        this.searchState = 'closed';
    }

    IUSearch.prototype.imageCheck = function() {

        var image = new Image();

        var imgCheck = setTimeout(function() {
            apollo.addClass(document.documentElement, 'images-off');
        }, 500);

        image.onload = function() {
            if (image.width > 0) {
                clearTimeout(imgCheck);
            }
        };
        image.src = '//assets.iu.edu/search/3.x/search.png';
    }

    // Helper Methods
    IUSearch.prototype.updateObject = function(object, newValue, path) {
        var stack = path.split('.');

        while(stack.length > 1 ){
            object = object[stack.shift()];
        }

        object[stack.shift()] = newValue;
    }

    IUSearch.prototype.extend = function ( defaults, options ) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    };

    IUSearch.prototype.gcsCallback = function() {
        var scope = this;

        // Borrow this straight from google.com/cse/cse.js's implementation
        "complete" == document.readyState || "interactive" == document.readyState
        ? (scope.renderSearch && scope.renderSearch())
        : google.setOnLoadCallback(function() { scope.renderSearch && scope.renderSearch()}, !0);
    };

    IUSearch.prototype.renderSearch = function() {
        var scope = this;

        scope.renderSearchElements && scope.renderSearchElements();
        scope.renderInlineSearch && scope.renderInlineSearch();
    }

    // Render search boxes
    IUSearch.prototype.renderSearchElements = function() {
        var scope = this;

        for (var x in this.settings.searchBoxIDs) {
            google.search.cse.element.render({
                div: this.settings.searchBoxIDs[x],
                tag: 'searchbox-only',
                attributes: scope.settings.attributes
            });
        }

        var search = document.getElementById('search');
        if (search !== null) {
            var wrapper = document.createElement('div');
            search.appendChild(wrapper).setAttribute('class', scope.settings.wrapClass);

            while (search.firstChild !== wrapper) {
                wrapper.appendChild(search.firstChild);
            }
        }

        scope.initToggle();
        scope.initRadios();
        scope.toggleSearchInputs();
    };

    IUSearch.prototype.renderInlineSearch = function() {
        var scope = this;

        google.search.cse.element.render({
            div: 'inline-search',
            tag: 'search',
            attributes: scope.settings.attributes,
            gname: 'inline'
        });

        scope.updateStyles();
    }

    // Handle search toggles
    IUSearch.prototype.initRadios = function() {
        var searchToggle = document.querySelectorAll('form.search-toggle');
        if (searchToggle.length) {
            searchToggle[0].parentElement.removeChild(searchToggle[0]);
        }
        return;

        var scope = this,
            radios = document.getElementsByName('searchToggle');

        for ( var i = 0; i < radios.length; i++ ) {
            radios[i].onclick = function() {
                if (window.ga && window.ga.loaded) {
                    ga('send', 'event', 'Search Toggle', 'click', 'Value: ' + this.value);
                }
                scope.toggleSearch(this.value);
            };
        }
    }

    IUSearch.prototype.initToggle = function() {
        var scope = this;

        var searchToggle = document.querySelectorAll('a.search-toggle'),
            body = document.getElementsByTagName('body'),
            searchBox = document.getElementById('search'),
            searchGoButton = searchBox.querySelector('button.gsc-search-button'),
            offCanvas = document.getElementById('offCanvas'),
            offCanvasButton = offCanvas.querySelector('[data-toggle]');

        // Handle Trap Focus
        searchGoButton.setAttribute('tabIndex', -1);

        var KEYCODE_TAB = 9;

        searchGoButton.addEventListener('keydown', function(e) {
            var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

            if (!isTabPressed) {
                return;
            }

            if ( !e.shiftKey ) /* shift + tab */ {
                searchToggle[0].focus();
                e.preventDefault();
            }
        });

        searchToggle[0].addEventListener('keydown', function(e) {
            var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

            if (!isTabPressed) {
                return;
            }

            if ( e.shiftKey && scope.searchState === 'opened' ) /* shift + tab */ {
                searchBox.querySelector('input[type="text"]').focus();
                e.preventDefault();
            }
        });

        for ( var i = 0; i < searchToggle.length; i++ ) {

            searchToggle[i].addEventListener('click', function(e) {

                e.preventDefault();

                // this == anchor
                var img = this.getElementsByTagName('img')[0];

                if (img) {
                    var attrs = scope.getImgAttributes(scope.searchState);
                    img.setAttribute('alt', attrs.text);
                    img.setAttribute('src', attrs.src);
                }

                scope.searchState = (scope.searchState == 'opened') ? 'closed' : 'opened';

                if (scope.searchState === 'closed') {
                    searchGoButton.setAttribute('tabIndex', -1);
                    searchBox.setAttribute("aria-hidden", "");
                    this.setAttribute("aria-expanded", "false");
                } else {
                    searchGoButton.setAttribute('tabIndex', 0);
                    searchBox.setAttribute("aria-hidden", "false");
                    this.setAttribute("aria-expanded", "");
                }

                body[0].classList.remove('off-canvas-open');
                offCanvas.classList.remove('is-open');
                if (offCanvasButton) { offCanvasButton.innerHTML = 'Menu'; }

                scope.toggleSearchInputs();
                apollo.toggleClass(body[0], 'search-open');

            });
        }
    }

    IUSearch.prototype.getImgAttributes = function(state) {

        if (state === 'closed') {
            return {
                "text": "Close Search",
                "src": "//assets.iu.edu/search/3.x/close.png"
            }
        }

        return {
            "text": "Open Search",
            "src": "//assets.iu.edu/search/3.x/search.png"
        }
    }

    IUSearch.prototype.toggleSearchInputs = function() {
        var scope = this;

        // Disable hidden search inputs
        var search = document.getElementById('search');
        if (search !== null) {

            var inputs = search.getElementsByTagName('input');

            for ( var i = 0; i < inputs.length; i++ ) {
                inputs[i].disabled = (scope.searchState == 'opened') ? false : 1;

                if (scope.searchState == 'opened' && inputs[i].name == 'search') {
                    inputs[i].focus();
                }
            }
        }
    }

    IUSearch.prototype.updateStyles = function() {
        var buttons = document.querySelectorAll('button.gsc-search-button');

        for (i = 0; i < buttons.length; i++) {
            buttons[i].type = 'submit';
            buttons[i].innerHTML = 'Search';
        }

        // Issue with A11y.  This isn't even visible anywhere
        var searchImages = document.querySelectorAll('img.gsc-branding-img');

        for (i = 0; i < searchImages.length; i++) {
            searchImages[i].alt = "Google logo"
        }
    }

    IUSearch.prototype.removeSearchBoxes = function() {
        var elements = ['inline-search'];

        for (index = 0; index < elements.length; ++index) {
            var search = document.getElementById(elements[index]);

            // http://jsperf.com/innerhtml-vs-removechild
            while (search.firstChild) {
                search.removeChild(search.firstChild);
            }
        }
    }

    /** Deletes the current instance of search - so we can re-init **/
    IUSearch.prototype.deleteInstance = function() {
        // 2015-10-12 version
        // function (a){return google.search.F.element.$g?!1:(google.search.F.element.$g=new google.search.F.element.sn(a),google.search.F.element.Rw=google.search.F.element.nh(),!0)}

        // Google is checking if there is a current instance.  If there is, Google returns
        // If there isn't an instance, it initializes a new one.
        // We need to delete the current instance to force Google to initialize a new one
        var initFunc = String(google.search.cse.element.init);

        // Find the first return statement
        var getReturn = /return\s([a-z\[\]A-Z\.\$]*)(?=\?)/;

        // The final property of the return statement is the instance
        var instanceCheck = initFunc.match(getReturn)[1];

        // Create something we can work with
        var arr = instanceCheck.split('.');

        // Get the instance var (currently: $g)
        var instance = arr.pop();

        var obj = eval(arr.join('.'));

        // Delete the instance
        delete (obj[instance]);
    }

    IUSearch.prototype.toggleSearch = function(value) {
        var scope = this;

        // store current search value
        var search = google.search.cse.element.getElement('inline'),
            terms = search.getInputQuery();

        // remove current version of search
        scope.removeSearchBoxes();

        // Delete the current instance of the search element
        scope.deleteInstance();

        // Sets the new cx value
        scope.settings.opts.cx = scope.settings.CX[value];

        // Re-inits the search element
        google.search.cse.element.init(scope.settings.opts);

        scope.renderInlineSearch();

        var search = google.search.cse.element.getElement('inline');
        search.prefillQuery(terms);
        search.execute(terms);
    }

    IUSearch.prototype.init = function(settings) {
        var scope = this;
            scope.settings = scope.extend(scope.settings, settings);

        scope.imageCheck();

        // Insert before the CSE code snippet so that cse.js can take the script
        // parameters, like parsetags, callbacks, and configuration.
        window.__gcse = {
            parsetags: 'explicit',
            callback: scope.gcsCallback.bind(scope)
        };

        // Load Google Search
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = 1;
        gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
            '//www.google.com/cse/cse.js?cx=' + scope.settings.CX.site;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
    }

    window.IUSearch = new IUSearch();

})(window, window.document );
