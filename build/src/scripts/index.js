chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if ((request.message === 'urlChanged')) {
            isFirstLoading = false;
            main();
        }

        if(request.message === 'completed'){
            main();
        }
    });


//////////////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////
const DOMAINS = {
    'react': {
        'domains': /reactjs\.org/,
        'script': removeReactBanners,
    },

    'angular': {
        'domains': /angular\.io/,
        'script': removeAngularBanners,
    },

    'ngrx': {
        'domains': /ngrx\.io/,
        'script': removeNgRxBanners,
    },

    'svelte': {
        'domains': /svelte\.dev/,
        'script': removeSvelteBanners,
    }
}

const BAN_SLOGANS = [/ukr/, /blm/, /укр/, /блм/, /ua/, /ucrania/]


let isFirstLoading = true;




//////////////////////////////////////////////////////////////////// METHODS ///////////////////////////////////////////

function findTextContent(el){
    let res = null
    let isElContainText = false;

    for(let word of BAN_SLOGANS){
        if(word.test(el.textContent.trim().toLowerCase())){
            isElContainText = true;
            break;
        }
    }

    if(el && isElContainText){
        res = el
        return res
    }else{
        if(el && el.hasChildNodes()){
            [...el.children].forEach((ch) => {
                return findTextContent(ch)
            })
        }
        return res
    }
}


function removeReactBanners() {
    const targetBanner = document.querySelector('header');

    if (targetBanner && findTextContent(targetBanner)) {
        targetBanner.childNodes[0].remove();
    }
}

function removeAngularBanners(){
    const targetBanner = document.querySelector('.mat-toolbar-row.notification-container');

    if (targetBanner && findTextContent(targetBanner.childNodes[0])) {
        targetBanner.remove();
    }
}

function removeNgRxBanners(){
    let timerNumber = undefined;

    if(isFirstLoading){
        let targetBanner = document.querySelector('ngrx-mff');

        if(targetBanner && findTextContent(targetBanner)){
            targetBanner.remove();
        }
    } else{
        window.clearTimeout(timerNumber);

        timerNumber = window.setTimeout(()=>{
            let targetBanner = document.querySelector('ngrx-mff');

            if(targetBanner && findTextContent(targetBanner)){
                targetBanner.remove();
            }
        }, 400)

    }

}

function removeSvelteBanners() {
    window.requestAnimationFrame(() => {
        const targetIconBanner = document.querySelector('nav').childNodes[0];
        const targetFooterBanner = document.querySelector("body > div > a:nth-child(5)");

        if (findTextContent(targetFooterBanner)) {
            targetFooterBanner.remove();
        }


        if (targetIconBanner) {
            targetIconBanner.style.backgroundImage = `url("${chrome.runtime.getURL('/src/img/stopwar.svg')}")`;
        }
    })
}


function main(){
    const currentDomain = window.location.hostname;

    for(const key of Object.keys(DOMAINS)){
        if(currentDomain.match(DOMAINS[key].domains)){
            DOMAINS[key].script();
            return;
        }
    }
}





