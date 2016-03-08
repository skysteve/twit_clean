var tc_arrElements = [
    {
        query: ".js-recommended-followers",
        parent : true,
        setting : "hideFollow"
    },
    {
        query: ".import-prompt",
        parent : false,
        setting : "hidePrompt"
    },
    {
        query: ".js-items-container",
        parent : true,
        setting : "hideFooter"
    },
    {
        query: ".js-moments-tab",
        parent : false,
        setting : "hideMoments"
    }
];

function tc_getTweet(el) {
    var strClassName = "tweet original-tweet";

    while(el.className.indexOf(strClassName) === -1) {
        el = el.parentElement;
    }

    return el;
}

/**
 * Here's the meaty/interesting bit, here was actually do the cleaning up
 * of the rhs and tweets
 */
function tc_cleanPage(docFrag) {

    //loop through elements we want to remove on the rhs (but this could be other elements at some point)
    tc_arrElements.forEach(function (objQuery) {

        //if setting doesn't say hide this element bail out - no point continuing
        if (!tc_objSettings[objQuery.setting]) {
            return;
        }

        //otherwise find the element to remove in the documentFragment if we have one, otherwise search the dom
        //(doc fragment is fast)
        var el = docFrag ? docFrag.querySelector(objQuery.query) : document.querySelector(objQuery.query);

        //if no match - bail out
        if (!el) {
            return;
        }

        //if we have a document fragment get the real one from the dom, otherwise use the element
        el = docFrag ? document.querySelector(objQuery.query) : el;

        //check again - this shouldn't happen, but just incase
        if (!el) {
            return;
        }

        //get the parent element if flag is true
        if (objQuery.parent) {
            el = el.parentNode;
        }

        //if no element bail out - again shouldn't happen
        if (!el) {
            return;
        }

        //remove the element
        el.parentNode.removeChild(el);
    });

    //if we didn't get passed a document fragment, use the actual dom
    if (!docFrag) {
        docFrag = document;
    }

    //get an array of hashtags and user tweets to remove (if any) - note don't query dom if we have nothing in settings
    var arrElUsers = tc_objSettings.ignoreUsers ?  docFrag.querySelectorAll(".username.js-action-profile-name") : [],
        arrElHashtags = tc_objSettings.ignoreHashes ? docFrag.querySelectorAll(".twitter-hashtag") : [],
        i,
        el;

    //if we've matched something and we had a fragment - query the actual dom to get the actual elements
    //if we didn't get passed a document fragment don't re-query it's pointless - likewise if we matched nothing
    if (arguments.length === 1 && arrElUsers.length > 0) {
        arrElUsers = document.querySelectorAll(".username.js-action-profile-name");
    }

    //if we have some user tweets to remove loop through them and remove them (we'll skip the loop if we're not ignoring any users)
    for (i = 0; i < arrElUsers.length; i++) {
        el = arrElUsers[i];

        //try to match users and remove the tweet if they match
        tc_objSettings.ignoreUsers.forEach(function (strUser) {
            if (el.textContent.toLowerCase() === strUser.toLowerCase().trim()) {
                el = tc_getTweet(el);

                el.parentElement.removeChild(el);
            }
        });
    }

    if (arguments.length === 1 && arrElHashtags.length > 0) {
        arrElHashtags = document.querySelectorAll(".twitter-hashtag");
    }

    //this is basically the same as above but for hashtags
    for (i = 0; i < arrElHashtags.length; i++) {
        el = arrElHashtags[i];

        tc_objSettings.ignoreHashes.forEach(function (strHashTag) {
            if (el.textContent.toLowerCase() === strHashTag.toLowerCase().trim()) {
                el = tc_getTweet(el);

                el.parentElement.removeChild(el);
            }
        });
    }
}


/**
 * Callback function for our mutation observer to see if there's actually anything to do
 */
function tc_fnCallback(mutations) {

    var docFrag = document.createDocumentFragment();

    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length < 1) {
            return;
        }

        for (var i = 0; i < mutation.addedNodes.length; i++) {
            docFrag.appendChild(mutation.addedNodes[i].cloneNode(true));
        }

    });

    tc_cleanPage(docFrag);
}

/**
 * Setup a mutation observer to watch for new content loaded so it can be cleaned up too
 * basically this watches for tweets loaded via infinite scroll
 */
function tc_setupObserver() {
    var observer = new MutationObserver(tc_fnCallback),
        elTarget = document,
        objConfig = {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        };

    //then actually do some observing
    observer.observe(elTarget, objConfig);
}


/**
 * Async load the settings panel into the page and setup our mutation observer when done
 * TODO: error cases - what it loading failed
 */
function tc_LoadSettings() {

    //load our settings panel
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL("html/rhsSettings.html"), true);


    /**
     * On success add the panel to the page and setup observer
     * @param resp {Object} the returned xhr response
     */
    xhr.onload = function (resp) {
        if (this.status === 200) {
            //add the dom
            var div = document.createElement("div");
            div.innerHTML = resp.target.responseText;
            var el = document.querySelector(".dashboard.dashboard-right");

            if (!el) {
                //TODO observe for the page changing to add the setting form in
                return;
            }

            el.appendChild(div);

            //set our form element now we have one (var declared in settings.js)
            tc_elForm = document.querySelector("#twitCleanSettings");
            tc_elForm.addEventListener("submit", tc_fnSaveSettings, false);

            //not sure why we need both but the submit doesn't seem to work if we click the button even though type is submit
            document.querySelector("#btnTCSave").addEventListener("click", tc_fnSaveSettings, false);

            //setup our form with existing settings
            tc_fnSetupForm();
            //and init dom observer
            tc_setupObserver();
        }
    };

    xhr.send();
}