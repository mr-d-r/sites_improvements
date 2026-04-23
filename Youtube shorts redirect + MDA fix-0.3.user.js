// ==UserScript==
// @name         Youtube shorts redirect + MDA fix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Youtuebe shorts > watch redirect
// @author       Fuim
// @match        *://*.youtube.com/*
// @exclude      http*://accounts.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @run-at       document-start
// @license      GNU GPLv2
// ==/UserScript==
// @exclude      http*://accounts.youtube.com/*
// // @g rant        none
// @d ownloadURL https://update.greasyfork.org/scripts/439993/Youtube%20shorts%20redirect.user.js
// @up dateURL https://update.greasyfork.org/scripts/439993/Youtube%20shorts%20redirect.meta.js

	console.log("", GM.info.script.name + " script start. version: " + GM.info.script.version);


//log("as13zx", location.host); //.match(/www.google./));   // почему-то на google.com отдает youtube.com !!!
if( location.href.match(/www.youtube.com\/embed\/\?enablejsapi/) )  {  console.log("this is google.com url!!! exiting");  return; }


var wlh, oldHref = wlh = document.location.href;
if (wlh.indexOf('youtube.com/shorts') > -1) {
    window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
}

function chkReboot () {
	var oldT, curT;
	oldT=localStorage.getItem("reloadTime");			console.log("reload  oldT: ", oldT);
	if( oldT!=null && oldT!='NaN' ) {
		curT=Math.floor( Date.now() / 1000 );  // seconds since epoch
		console.log("reload  curT: ", curT);
		if( (curT-oldT) >20 )  {  localStorage.removeItem("reload");  	console.log("reload: remove");  }
	}
	else console.log("reload: oldT is NULL");
} // chkReboot()

window.addEventListener('load', function() {   // window.onload is BAD - only ONE instance for all scripts //window.onload = function() {
    var aa, bb, bodyList = document.querySelector("body")
    console.log('Youtube shorts redirect:  loaded');

    var observer = new MutationObserver(function(mutations) {  var aa, bb;
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = wlh = document.location.href;
                console.log('Youtube shorts redirect:  location changed!');
                if (wlh.indexOf('youtube.com/shorts') > -1) 	{	window.location.replace(window.location.toString().replace('/shorts/', '/watch?v=')); 	}
				if (wlh.indexOf('youtube.com/watch') >  -1)		{
									chkReboot();
									aa=localStorage.getItem("reload");
									console.log("--- RELOAD ---  workaround for bug *GD755*  counter get: ", aa);
									if( aa==null || aa=='NaN' || aa < 1 ) {
											console.log("reload: 6734");
											if( aa==null || aa=='NaN' ) 	bb=0;
											else							bb=aa;
											bb++;
											localStorage.setItem("reload", 		Number(bb));
											localStorage.setItem("reloadTime", 	Number(Math.floor( Date.now() / 1000 )));
											console.log("reload FIRE soon");
											setTimeout(()=>{  window.location.reload();

												// TRY https://github.com/youtube/api-samples/blob/master/player/player_control.js
												//  		player.loadVideoById("me91AGSVsyo");
											}, 200);
									} else {
											console.log("reload stop - giving up")
									}

				}
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
});
