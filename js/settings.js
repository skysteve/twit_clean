/**
 * Created by steve on 21/06/2014.
 */
var strStorageKey = "twitClean_settings",
    tc_objSettings = localStorage.getItem(strStorageKey),
    tc_elForm = document.querySelector("#twitCleanSettings");

tc_objSettings = tc_objSettings ? JSON.parse(tc_objSettings) : {};

function tc_fnSaveSettings() {
    var el = tc_elForm.querySelector("#cbHideFollow");
    tc_objSettings.hideFollow = el.checked;

    el = tc_elForm.querySelector("#cbHidePrompt");
    tc_objSettings.hidePrompt = el.checked;

    el = tc_elForm.querySelector("#cbHideFooter");
    tc_objSettings.hideFooter = el.checked;

    el = tc_elForm.querySelector("#taIgnoreHash");
    tc_objSettings.ignoreHashes = el.value.split(",");

    el = tc_elForm.querySelector("#taIgnoreUsers");
    tc_objSettings.ignoreUsers = el.value.split(",");


    localStorage.setItem(strStorageKey, JSON.stringify(tc_objSettings));
    return false;
}

function tc_fnSetupForm() {
    var el;

    if (tc_objSettings.hideFollow) {
        el = tc_elForm.querySelector("#cbHideFollow");
        el.setAttribute("checked", "checked");
    }

    if (tc_objSettings.hidePrompt) {
        el = tc_elForm.querySelector("#cbHidePrompt");
        el.setAttribute("checked", "checked");
    }

    if (tc_objSettings.hideFooter) {
        el = tc_elForm.querySelector("#cbHideFooter");
        el.setAttribute("checked", "checked");
    }

    if (tc_objSettings.ignoreHashes) {
        el = tc_elForm.querySelector("#taIgnoreHash");
        el.value = tc_objSettings.ignoreHashes.join(",");
    }

    if (tc_objSettings.ignoreUsers) {
        el = tc_elForm.querySelector("#taIgnoreUsers");
        el.value = tc_objSettings.ignoreUsers.join(",");
    }
}