chrome.storage.local.get(['sessionAdCount', 'totalAdCount'], (result) => {
    document.getElementById('session-count').textContent = result.sessionAdCount || 0;
    document.getElementById('total-count').textContent = result.totalAdCount || 0;
});
