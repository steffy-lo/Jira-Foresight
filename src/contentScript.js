(() => {
  // TODO: this function also exists in utils.js, currently cannot figure out how to import it from there...
  const getPRInfo = url => {
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

  const main = () => {
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
  const { issueKeys, prNum, prLink } = main();
  chrome.storage.sync.set({
    [prNum]: JSON.stringify([...issueKeys]),
    prLink
  })
})();