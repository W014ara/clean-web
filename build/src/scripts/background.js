chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        // read changeInfo data and do something with it
        if (changeInfo.status === 'complete') {
            chrome.tabs.sendMessage( tabId, {
                message: 'completed',
                url: changeInfo.url,
                info: {...tabId, ...changeInfo, ...tab }
            })
        }

        if (changeInfo.url) {
            chrome.tabs.sendMessage( tabId, {
                message: 'urlChanged',
                url: changeInfo.url,
            })
        }
    }
);