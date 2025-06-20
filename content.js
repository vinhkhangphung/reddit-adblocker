let sessionAdCount = 0;

const toRemoveAdTags = ['shreddit-ad-post', 'shreddit-comments-page-ad'];
const toRemoveAdTagsName = toRemoveAdTags.map(tag => tag.toUpperCase());
const toRemoveAdTagsSelector = toRemoveAdTags.join(', ');

function incrementAdCount(num) {
    sessionAdCount += num;

    chrome.storage.local.get(['totalAdCount'], (result) => {
        const newTotal = (result.totalAdCount || 0) + num;
        chrome.storage.local.set({ totalAdCount: newTotal });
    });

    // Update session count in storage for popup access
    chrome.storage.local.set({ sessionAdCount });
}

function removeAdNodesFrom(nodes) {
    let removedCount = 0;

    nodes.forEach(node => {
        if (toRemoveAdTagsName.includes(node.tagName)) {
            node.remove();
            removedCount++;
        } else if (node.querySelectorAll) {
            const ads = node.querySelectorAll(toRemoveAdTagsSelector);

            ads.forEach(ad => ad.remove());
            removedCount += ads.length;
        }
    });

    if (removedCount > 0) {
        incrementAdCount(removedCount);
    }
}

// Initial cleanup
const initialAds = document.querySelectorAll(toRemoveAdTagsSelector);
initialAds.forEach(ad => ad.remove());
incrementAdCount(initialAds.length);

// Observe mutations
const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            removeAdNodesFrom(mutation.addedNodes);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
