export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });

    return tabs[0];
}

export function getPRInfo(url) {
    const prLinkRegex = /pull\/\d*$/g;
    const prLinkResult = url.match(prLinkRegex);
    let prLink;
    let _, prNum;
    if (prLinkResult) {
        prLink = url;
        [_, prNum] = url.match(prLinkRegex)[0].split('/');
    }
    return {
        prNum,
        prLink
    }
}

/* currently unused */
export function getElementsByTextFromSelector(selector, text) {
    var elements = document.querySelectorAll(selector);
    return getElementsByTextFromElements(elements, text);
}

export function getElementsByTextFromElements(elements, text) {
    return [].filter.call(elements, function (element) {
        var contents = element.textContent || element.innerText || '';
        return contents.indexOf(text) != -1;
    });
}

