import { addNewIssue } from "./popup.js";
import {
  addAttachmentsOnClickFunction,
  getPRInfo
} from "./utils.js";
import { getIssueDetails } from "./jira.js";


(() => {
  const main = () => {
    const url = window.location.href;
    if (url.includes("github.com")) {
      const { prLink, prNum } = getPRInfo(url);
      if (prLink && prNum) {
        const selectorScope = ".edit-comment-hide p";
        const sources = document.querySelectorAll(selectorScope);
        const issueKeyRegex = /(\[)?[A-Z]+[-]\d+(\])?/g;
        const issueKeys = new Set();
        sources.forEach((source) => {
          let matches = source.innerHTML.match(issueKeyRegex);
          //if a PRNum is found, add to the set and get any links
          if (matches) {
            issueKeys.add(source.innerHTML.match(issueKeyRegex).sort());
            const links = source.getElementsByTagName("a");
            if (links.length > 0) {
              for (let link of links) {
                let match = link.innerHTML.match(issueKeyRegex);
                //add hover listener if link is a ticket
                if (match) {
                  getIssueDetails(match).then((data) => {
                    console.log(data);
                    link.addEventListener("mouseenter", () => {
                      const issuesElement = document.createElement("div");
                      issuesElement.setAttribute("id", "issue-div");
                      addNewIssue(issuesElement, data.issues[0]);
                      addAttachmentsOnClickFunction(data.issues[0]);
                      source.appendChild(issuesElement);
                    });

                    link.addEventListener("mouseleave", () => {
                      document.getElementById("issue-div").remove();
                    });
                  });
                }
              }
            }
          }
        });

        if (issueKeys) {
          /* 
          //To find specific element with the key in its text content (currenly not implemented)
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
            issueKeys,
          };
        }
      }
    }
  };
  const { issueKeys, prNum, prLink } = main();
  chrome.storage.sync.set({
    [prNum]: JSON.stringify([...issueKeys]),
    prLink,
  });
})();