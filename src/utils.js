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

export function getStatusPillClass(status) {
    switch (status) {
        case "To Do":
            return "bg-gray-200 text-gray-800"
        case "In Progress":
            return "bg-blue-500 text-white"
        case "Done":
            return "bg-green-500 text-white"
        default:
            return "bg-gray-200 text-gray-800"
    }
}

export function getAttachmentsHTML(key, attachments) {
    const attachmentsElement = document.createElement("div");
    attachmentsElement.className = "mb-3";
    if (attachments.length > 0) {
        attachments.forEach((attachment, index) => {
            const img = document.createElement("img");
            img.id = `${key}-attachment${index}`;
            img.className = "w-1/4 modal-img";
            img.src = attachment.thumbnail;
            img.alt = attachment.filename;
            attachmentsElement.appendChild(img);
        });
    }
    const wrap = document.createElement('div');
    wrap.appendChild(attachmentsElement.cloneNode(true));
    return wrap.innerHTML;
}

export function addAttachmentsOnClickFunction(issue) {
    issue.fields.attachment.forEach((attachment, index) => {
        const modal = document.getElementById("img-modal");
        const modalImg = document.getElementById("modal-img");
        const captionText = document.getElementById("caption");
        const img = document.getElementById(`${issue.key}-attachment${index}`);
        img.onclick = function () {
            modal.style.display = "block";
            modalImg.src = attachment.content;
            captionText.innerHTML = attachment.filename;
        }
    });
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

