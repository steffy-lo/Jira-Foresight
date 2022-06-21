(async () => {
  const contentMain = await import(chrome.runtime.getURL("main.js"));
  const { issueKeys, prNum, prLink } = contentMain.main();
  chrome.storage.sync.set({
      [prNum]: JSON.stringify([...issueKeys]),
      prLink
  })
})();