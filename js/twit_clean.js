var arrElements = [
    {
        query: ".js-recommended-followers",
        parent : true
    },
    {
        query: ".import-prompt",
        parent : false
    },
    {
        query: ".js-items-container",
        parent : true
    }
];

var blockUsers = [
    "@samsmithworld"
];

var blockHashTags = [
    "#FreedomToMakeaStatement",
    "#UnionJForever"
];


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

    for (i=0; i < arrElUsers.length; i++) {
        el = arrElUsers[i];

        blockUsers.forEach(function (strUser) {
            if (el.textContent.toLowerCase() === strUser.toLowerCase()) {
                el = el.parentElement.parentElement.parentElement.parentElement;

                el.parentElement.removeChild(el);
            }
        });
    }


    var arrElHashtags = document.querySelectorAll(".twitter-hashtag");

    for (i=0; i < arrElHashtags.length; i++) {
        el = arrElHashtags[i];

        blockHashTags.forEach(function (strHashTag) {
            if (el.textContent.toLowerCase() === strHashTag.toLowerCase()) {
                el = el.parentElement.parentElement.parentElement;

                el.parentElement.removeChild(el);
            }
        });
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



