import { getPRInfo } from "./utils.js";

export function main() {
    const url = window.location.href;

    if (url.includes("github.com")) {
        const { prLink, prNum } = getPRInfo(url);
        if (prLink && prNum) {
            const selectorScope = '.edit-comment-hide p';
            const source = document.querySelectorAll(selectorScope)[0].innerHTML;
            const issueKeyRegex = /(\[)?[A-Z]+[-]\d+(\])?/g;
            const issueKeys = new Set(source.match(issueKeyRegex).sort());

            if (issueKeys) {
                /* 
                To find specific element with the key in its text content (currenly not imeplemented)
                issueKeys.forEach(key => {
                  const issueFound = getElementsByTextFromSelector(`${selectorScope} p`, key);
                  if (issueFound) {
                    const descendants = Array.prototype.slice.call(issueFound[0].querySelectorAll("*"));
                    const issueElement = getElementsByTextFromElements(descendants, key);
                  }
                }) 
                */

                return {
                    prLink,
                    prNum,
                    issueKeys
                }
            }
        }
    }
}