var arrElements = [
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
    }
];

var xhr = new XMLHttpRequest();

xhr.open("GET", chrome.extension.getURL("html/rhsSettings.html"), true);
xhr.onload = function (e) {
    if (this.status === 200) {
        var div = document.createElement("div");
        div.innerHTML = e.target.responseText;
        document.querySelector(".dashboard.dashboard-right").appendChild(div);

        tc_elForm = document.querySelector("#twitCleanSettings");
        tc_elForm.addEventListener("submit", tc_fnSaveSettings, false);
        tc_fnSetupForm();
    }
};

xhr.send();

/**
 * Created by steve on 26/05/2014.
 */
function twit_clean_fnCallback(mutations) {

    var docFrag = document.createDocumentFragment();

    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length < 1) {
            return;
        }

        for (var i = 0; i < mutation.addedNodes.length; i++) {
            docFrag.appendChild(mutation.addedNodes[i].cloneNode(true));
        }

    });

    arrElements.forEach(function (objQuery) {
        var el = docFrag.querySelector(objQuery.query);
        if (!tc_objSettings[objQuery.setting]) {
            return;
        }

        //if no match - bail out
        if (!el) {
            return;
        }

        //otherwise find the node in the dom
        el = document.querySelector(objQuery.query);

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

    var arrElUsers = document.querySelectorAll(".username.js-action-profile-name"),
        i,
        el;

    if (tc_objSettings.ignoreUsers) {
        for (i = 0; i < arrElUsers.length; i++) {
            el = arrElUsers[i];

            tc_objSettings.ignoreUsers.forEach(function (strUser) {
                if (el.textContent.toLowerCase() === strUser.toLowerCase()) {
                    el = el.parentElement.parentElement.parentElement.parentElement;

                    el.parentElement.removeChild(el);
                }
            });
        }
    }

    var arrElHashtags = document.querySelectorAll(".twitter-hashtag");

    if (tc_objSettings.ignoreHashes) {
        for (i = 0; i < arrElHashtags.length; i++) {
            el = arrElHashtags[i];

            tc_objSettings.ignoreHashes.forEach(function (strHashTag) {
                if (el.textContent.toLowerCase() === strHashTag.toLowerCase().trim()) {
                    el = el.parentElement.parentElement.parentElement;

                    el.parentElement.removeChild(el);
                }
            });
        }
    }
}

var observer = new MutationObserver(twit_clean_fnCallback),
    elTarget = document,
    objConfig = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };

//then actually do some observing
observer.observe(elTarget, objConfig);



