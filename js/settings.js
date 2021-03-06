/**
 * Created by steve on 21/06/2014.
 */
var tc_strStorageKey = "twitClean_settings",
    tc_objSettings = localStorage.getItem(tc_strStorageKey),
    tc_elForm = document.querySelector("#twitCleanSettings");

tc_objSettings = tc_objSettings ? JSON.parse(tc_objSettings) : {};
//go and load the settings panel and do an initial page cleanup from our settings
tc_LoadSettings();
tc_cleanPage();

/**
 * Function to save data from the settings form into local storage
 * @returns {boolean} always false to stop form submitting
 */
function tc_fnSaveSettings() {
    var el = tc_elForm.querySelector("#cbHideFollow");
    tc_objSettings.hideFollow = el.checked;

    el = tc_elForm.querySelector("#cbHidePrompt");
    tc_objSettings.hidePrompt = el.checked;

    el = tc_elForm.querySelector("#cbHideFooter");
    tc_objSettings.hideFooter = el.checked;

    el = tc_elForm.querySelector("#cbHideMoments");
    tc_objSettings.hideMoments = el.checked;

    el = tc_elForm.querySelector("#cbHideWYWA");
    tc_objSettings.hideWYWA = el.checked;

    el = tc_elForm.querySelector("#taIgnoreHash");
    tc_objSettings.ignoreHashes = el.value.split(",");

    el = tc_elForm.querySelector("#taIgnoreUsers");
    tc_objSettings.ignoreUsers = el.value.split(",");


    //do the save
    localStorage.setItem(tc_strStorageKey, JSON.stringify(tc_objSettings));

    //refresh the content in page
    tc_cleanPage();

    //show success message & clear after 4 seconds
    el = document.querySelector("#divAlertSaved");
    el.setAttribute("style", "margin-top:10px");

    setTimeout(function () {
        el.setAttribute("style", "display: none; margin-top:10px");
    }, 4000);

    return false;
}

/**
 * Here we set the settings in the form to the values we have
 * stored (if any)
 */
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

    if (tc_objSettings.hideMoments) {
        el = tc_elForm.querySelector("#cbHideMoments");
        el.setAttribute("checked", "checked");
    }

    if (tc_objSettings.hideWYWA) {
        el = tc_elForm.querySelector("#cbHideWYWA");
        el.setAttribute("checked", "checked");
    }
}