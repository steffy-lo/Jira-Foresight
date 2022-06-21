import { getActiveTabURL, getPRInfo } from "./utils.js";

const addNewIssue = (issues, issue) => {
  const issueTitleElement = document.createElement("div");
  const newIssueElement = document.createElement("div");

  issueTitleElement.textContent = issue;
  issueTitleElement.className = "issue-title";

  newIssueElement.id = "issue-" + issue;
  newIssueElement.className = "issue";
  newIssueElement.setAttribute("key", issue);

  newIssueElement.appendChild(issueTitleElement);
  issues.appendChild(newIssueElement);
};

const viewIssues = (issues=[]) => {
  const issuesElement = document.getElementById("issues");
  issuesElement.innerHTML = "";

  if (issues.length > 0) {
    for (const issue of issues) {
      addNewIssue(issuesElement, issue);
    }
  } else {
    issuesElement.innerHTML = '<i class="row">No issues to show</i>';
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const { prNum } = getPRInfo(activeTab.url);

  if (activeTab.url.includes("github.com") && prNum) {
    chrome.storage.sync.get([prNum], (data) => {
      const issues = data[prNum] ? JSON.parse(data[prNum]) : [];
      console.log(issues);
      viewIssues(issues);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = '<div class="title">This is not a GitHub Pull Request page.</div>';
  }
});

