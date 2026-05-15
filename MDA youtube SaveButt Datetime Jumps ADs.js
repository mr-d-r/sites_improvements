// ==UserScript==
// @name         MDA youtube SaveButt Datetime Jumps ADs
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  started 2024-11-26
// @author       mr-d-r
// @license      MIT
// @match        http*://*.youtube.com/*
// @include      http*://*.youtube.com/*
// @exclude      http*://accounts.youtube.com/*
// @exclude      http*://www.google.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/524553/MDA%20library.js
// @require      https://update.greasyfork.org/scripts/577495/Date%20Format%20123.js
// @require      https://update.greasyfork.org/scripts/577494/MDA%20youtube%20common.js
// ==/UserScript==

// @i nclude      http*://*.youtube.com/*
// @in clude      http*://*.youtube.com/*  	// НЕ ТРОГАТЬ !!! иначе вообще не запускается !!!
// @m atch        http*://*.youtube.com/*  	// НЕ ТРОГАТЬ !!! иначе не находит методов YT плеера !!!


//
//
// показывать качество и скорость видео во всплывающем блоке выше ползунка !!!!!!!!!!!
//
//

// 2025 сент глюк *GD755* - следующее видео в текущем tab-е не обновляет инфу о канале и/или времени видео и/или лайках - в devtools тоже глючило

	// 	пробовать yt-update-title вместо reload страницы !!! !!! !!!

	//      при переходе между роликами ютюб по ctrl-left/right тоже этот глюк
	// 		1. сделал disable/enable скрипту в tampermonkey - чуть помогло, но не до конца - РАЗБИРАТЬСЯ ЕЩЕ !!!
	//		2. закомментил intervSMART(1000, 	"showRealRemainTime_interv111", 'set',   ()=>{ 	showRealRemainTime("onINTERV");        });  // set interval
	// 		3. минимизировал количество таймеров в onload


// при окончании ролика (onPlayerStateChange 0) посылать 'v' чтобы показали не 3 видоса, а 9-12 на весь экран
// WORKS:
// 		qS("#movie_player").classList.remove("ytp-fullscreen-grid-peeking"); 	qS("#movie_player").classList.add("ytp-fullscreen-grid-active"); 	// 3 штуки
// 		qS("#movie_player").classList.remove("ytp-fullscreen-grid-active");		qS("#movie_player").classList.add("ytp-fullscreen-grid-peeking"); 	// 9-12 штук


// контролировать закрытие three dots menu !!!    сохранить body до закрытия меню и после и сравнить sdiff !!!
// 	function ThreeDotsClick ()
/*
three dots & save2playlist признаки открытия:
<tp-yt-iron-dropdown horizontal-align="auto" vertical-align="top" aria-disabled="false" class="style-scope ytd-popup-container" prevent-autonav="true"
     style="outline: none; position: fixed; left: 500.233px; top: 858.801px; z-index: 2202;       focused">
<tp-yt-iron-dropdown horizontal-align="auto" vertical-align="top" aria-disabled="false" class="style-scope ytd-popup-container" prevent-autonav="true"
    style="outline: none; position: fixed; left: 500.233px; top: 858.801px; display: none;"          aria-hidden="true">
*/


//  ВОЗМОЖНО делать глобальную переменную MUTEX, которая дает кликать в savebutton

// в новом диалоге save удалять иконки и строки про тип доступа к плейлисту !!!
//		посл удаления ставить style="height: 15px;" у текста 		#contentWrapper > yt-sheet-view-model > yt-contextual-sheet-layout > div.ytContextualSheetLayoutContentContainer > yt-list-view-model > toggleable-list-item-view-model:nth-child(1) > yt-list-item-view-model > div
//   	и флажка 													#contentWrapper > yt-sheet-view-model > yt-contextual-sheet-layout > div.ytContextualSheetLayoutContentContainer > yt-list-view-model > toggleable-list-item-view-model:nth-child(1) > yt-list-item-view-model > div > div.yt-list-item-view-model__image-container.yt-list-item-view-model__trailing




/* HELP/description for tampermonkey site
    - Shows remaining time УЧИТЫВАЯ  speed recalculation
    - KeyA/Z - increase/decrease video quality

    Some function was taken from ...
    I express my gratitude to authors      Thanks to ... for some function
*/

// был глюк - возможно случайность:  помимо ctrl alt shift перехватывать еще и event code AltRight !!!  иначе не работает browse back !!!


// 2do: у shorts тоже вытаскивать кнопку Save to playlist наружу !!!
//     сделать showMsgVSC() через ttoutSMART() !!! !!! !!!


// сделать включение-выключение режима show more при листании комментов

// сделать мини-хелп, добавив мои комбинации в стандартный хел youtube
//     посмотреть, как это сделано у  More YouTube Hotkeys.user.js - More Hotkeys checkHotkeyPopup()

// при выходе из полного экрана всегда показывать элементы плеера toggleYtVideoControls();

// крутейшая библиотека !!!					// https://github.com/raingart/Nova-YouTube-extension/blob/master/README.md !!!
// 	try	...("#ytd-player").wakeUpControls();

// высчитывать и показывать оставшееся время в зависимости от скорости !!!
// 		добавлять span чуть ниже ytp-time-duration  <span class="mda111">ttt</span>
// 		убирать иконки autoplay/theater mode/mini player   "ytp-miniplayer-button ytp-button"  "ytp-pip-button ytp-button"    theatr class="ytp-size-button ytp-button"
// 				<button class="ytp-button"  data-tooltip-target-id="ytp-autonav-toggle-button" aria-label="Autoplay is off"
// 		скорость - class="ytp-bezel-text"

// !!! чтобы сделать listview - см.C:\Users\mda\AppData\Local\Google\Chrome\User Data\Default\Extensions\gefbgfmdacpikggkopbjdjlpfcmgmkop\2.0.6_0\background.js
// для Home канала - нужно у document.querySelector("#items") /html/body/ytd-app/div[1]/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer[1]/div[3]/ytd-shelf-renderer/div[1]/div[2]/yt-horizontal-list-renderer/div[2]/div/div
//    просто вставить в стиль #items.yt-horizontal-list-renderer   display: -webkit-box !important;     width: 50% !important;
// для youtube главной - у ytd-rich-item-renderer[rendered-from-rich-grid] - то же самое !!!
// можно пробовать как у https://www.youtube.com/@ByLOL_fun/featured  <ytd-video-renderer class="style-scope ytd-channel-featured-content-renderer" bigger-thumbs-style="BIG" lockup="true" inline-title-icon="">
// https://www.w3schools.com/howto/howto_css_two_columns.asp

// сделать параметризацию и меню вкл/выкл фич - по аналогии с rezka rub4ek
// 2do: вести свой черный список каналов (@watop_ru) и при появлении во вкладе такого ролика - писать крупно, что он в черном списке
// 		ytInitialPlayerResponse 								& ytInitialData
//		console.log(JSON.stringify(ytInitialPlayerResponse))
// 2do: export youtube history и импорт в свою БД  "youtube api whole history export"  https://github.com/menggatot/youtube-watch-history-to-csv?tab=readme-ov-file
// 2do: - при загрузке ролика проверять его наличие в истории ютюб (или своей БД) и ставить пометку (там где дата ролика), что я его уже смотрел
//		- вести свою БД просмотренных роликов (локальную, но синхронизированную например с github), по идее достаточно держать только id видоса !!!
//		- при загрузке главной страницы ютюб, удалять ролики, которые есть в базе просмотренных
// 2do: там где фильтр поиска видео добавлять пункты за последние 2,4,8 часов и последние 2,3,5 дней
// 2do: повторные settimeout перебивают предыдущие:  делать через ttoutSMART
// 2do: у shorts вычислять рекламу и резать
// 2do: самому высчитывать сколько лет/месяцев/недель/дней/часов назад

// javascript youtube controls    https://stackoverflow.com/questions/65586000/keep-youtube-controls-always-visible

// выяснил, что видимую кнопку Save (to playlist) херит расширение Return YouTube Dislike 3.0.0.18

var scrpt="MDA youtube +SaveButton";
// start of the script - MUST BE AT THE VERY BEGIN - right below 'use strict'; !!!   иначе у гугла выполняется 3 раза несмотря на if( wlh.match(/accounts.google.com/) ) 	{  return; } !!!
(function() {
    'use strict';
var dbg=0, dbg_tmp=0, verb=0,  isSaveVisible=false,  tickNAME, tickCURR, tickCURR1, tickPROC=null, tickPROC1=null, wlh=WLH(), pare1, aa, bb;
// isMenuClicked=false moved to mdaytlib
var newloc="#top-row #flexible-item-buttons";  // "#actions-inner" WORKS чуть ниже кнопок like/dislike - НЕ глючит ;;;  document.querySelector("#top-row").querySelector('#flexible-item-buttons'); // WORKS - самое правильное место, но периодически мерзко дергается  //  if (wlh == "accounts.yotube") 	return 11;  // scripts starts twice: for normal youtube URL and "accounts.yotube", but we need only the 1st !!!
var shortsDatetimeAdded=false,  oldHref = document.location.href;
var VSCenabled="no";
//var scrollLOCK=0;

console.log("\n", "\n", `${GM.info.script.name}: start -> ${wlh}  debug=${(typeof dbg == "undefined") ? "absent" : dbg}  MDAlib=${(typeof MDAlib == "undefined") ? "absent" : MDAlib}` );
if (window.location.href.match("accounts.youtube"))  {  console.log("accounts.youtube is detected, exiting this instance...");      return null;  }
	// else console.log("normal youtube is detected");

//log("as13zx", location.host); //.match(/www.google./));   // почему-то на google.com отдает youtube.com !!!
if( location.href.match(/www.youtube.com\/embed\/\?enablejsapi/) )  {  console.log("this is google.com url!!! exiting");  return; }





	var sc="YTinterop111:";




		function click_show_more_replies () {

			log("click_show_more_replies() disabled");
			return;

			log("click_show_more_replies()");
			qSA("ytd-item-section-renderer#sections.style-scope.ytd-comments").forEach(el=>{
				el.querySelectorAll(".yt-spec-button-shape-next__button-text-content").forEach(e=>{
					el.querySelectorAll(".yt-spec-touch-feedback-shape__fill").forEach(e=>{

						// кликать первые 10 штук !!!

						e.click(); log(`click`);		//if( item?.style?.display && item?.style?.display != 'none' )  item.style.display='none';	log(`ad had been hidden`);
						return;
					});
				});
			});

		} // click_show_more_replies()

        function wake() {
			let a=qS("#movie_player");
			if (a) 	{ 	mouseMove(a); 				//a.classList.remove('ytp-autohide');
						setTimeout(function () {	mouseMove(a); 	}, 300); // 500
					}
			//let b=qS("#ytd-player"); 	if(b) 	b.wakeUpControls();  // не находит - рыть еще
			function mouseMove (ytp) { ytp.dispatchEvent(new Event("mousemove")); 	ytp.dispatchEvent(new Event("mouseup"));	ytp.dispatchEvent(new Event("mouseover"))}
        }


	function showRealRemainTime (caller="") {   var a, b, mda_overl, secC, secT, secRem, secRemDivSpeed, tC, tT, tR, tRDS, spd, RUNMAN='&#x1F3C3;-';
        // доделать чтобы пересчитывало по кнопкам и mousemove !!!
        //     вешать таймер, чтобы щелкало только если полоска внизу плеера видима - пока ytp-progress-bar aria-valuenow меняется!!!

		a=qS(".ytp-time-current");                                		b=qS(".ytp-time-duration");
			// лучше брать из document.querySelector(".ytp-chrome-bottom .ytp-progress-bar").getAttribute("aria-valuenow") и aria-valuemax

		//log("showRealRemainTime " + caller,a,b);
// 2del	spd=vsc_control("getspeed","showRealRemainTime()");		    	if( !spd ) 	spd=qS('.html5-main-video')?.playbackRate;        // 2debug: if( !isNumber(spd) )  spd=1;
		spd=vsc_control("getspeed");		   						 	if( !spd ) 	spd=qS('.html5-main-video')?.playbackRate;        // 2debug: if( !isNumber(spd) )  spd=1;
		if( !a || !b || !spd ) return;
        if( ! a?.innerText ) return;
		secC=hmsToSec( a?.innerText ) *1000;							tC=new Date(secC).toISOString().substr(11, 8);
		//secT=hmsToSec( b?.innerText.replace(/\(.*\)/,'') ) *1000;		tT=new Date(secT).toISOString().substr(11, 8);  // old way
		secT=hmsToSec( b?.innerText.replace(/ .*/,'') ) *1000;		    tT=new Date(secT).toISOString().substr(11, 8);
        secRem=secT-secC;        										tR=		new Date(secRem        ).toISOString().substr(11, 8).replace(/^00:/g, '');
        secRemDivSpeed=(secT-secC)/spd; 								tRDS=	new Date(secRemDivSpeed).toISOString().substr(11, 8).replace(/^00:/g, '');
        if( secRem==secRemDivSpeed ) RUNMAN='&#x3000;-';  // no acceleration

		if(navigator.userAgentData.mobile) 		b.innerHTML=`${new Date(secT).toISOString().substr(11, 8).replace(/^00:/g, '')}`;  					// - ${spd}x)`; 	// без скобок
		else 									b.innerHTML=`${new Date(secT).toISOString().substr(11, 8).replace(/^00:/g, '')} ${RUNMAN}${tRDS}`;  // - ${spd}x)`; 	// без скобок
		//log("showRealRemainTime " +caller + "DONE");

		//b.innerHTML=`${new Date(secT).toISOString().substr(11, 8).replace(/^00:/g, '')} (${RUNMAN}${tRDS})`;   // - ${spd}x)`;     // в скобках

		if( mda_overl=qS("#mda_overl") ) {
			a=selectQuality("get");				b=spd; // getSpeed();
			if(navigator.userAgentData.mobile) 	mda_overl.innerHTML=`&#x3000;&#x1F5B5; ${a} &#x3000;${b}x ${RUNMAN}${tRDS}`;	// shows quality, speed, remaining time
			else 								mda_overl.innerHTML=`&#x3000;&#x1F5B5; ${a} &#x3000;${b}x`;  					// shows only quality and speed
		}

	} // showRealRemainTime()



function getSpeed () {  // get youtube/vsc speed
		var bb, aa=vsc_control("getspeed");
		if ( aa ) 	return aa;
		else 		return document.querySelector(".video-stream.html5-main-video")?.playbackRate;  // youutube speed
} // getSpeed()




function showMsgYTplayer (msg, delay) {  var aa;
		// мой оверлей поверх видео !!!

		//if( aa=qS("#mdaYTplayerINFtxt") )

		// 		ytd-player  container  делать firstchild
		var htm=`<div id="mdaYTplayerINF" style="top: 300px; left: 300px; opacity: 0.7;">
					<span id="mdaYTplayerINFtxt" style="font-size: 16px;">Sample text 12345
					</span>
				</div>`;

		//if( aa=qS("#mdaDateTime_inf1") ) {
		//}
} // showMsgYTplayer()



function showMsgVSC (msg, delay=2000, hook="") { 	// show message bound to HTML element
	var vscTextSave="", a, mydiv, myP, myI=false;
	var vsc=qS(".vsc-controller"); 									//	if(!vsc) 	{  if(dbg) log("showMsgVSC():  no VSC detected"); 	return; }
	var ytSTD=qS("#movie_player").querySelector('.ytp-bezel-text-wrapper').parentElement;	if(!ytSTD) 	{  log("showMsgVSC():  no ytSTD div detected"); 		}
	var ytSTDtext=qS("#movie_player").querySelector('.ytp-bezel-text');	if(!ytSTD) 	{  log("showMsgVSC():  no ytSTD text detected"); 		}
	if(dbg) log("showMsgVSC() " + msg, "hook=", hook);
	wake(); 	myI=setInterval(function () {	wake();
												ytSTDtextSet(msg); 		ytSTDshow();
											}, 200);

// сделать многострочный вывод, отдельные сообщения в отдельный span и по истечение таймаута удалять только этот span


	if(vsc) VSCtextSave();
	//setTimeout(function () { 	VSCtextSet(msg); 		VSCshow();			}, 150);
	// // // // setTimeout(function () { 	ytSTDtextSet(msg); 		ytSTDshow();		},  50);  // 150
	//setTimeout(function () { 	VSChide();				VSCtextRest(); 		if(myI) clearInterval(myI);		}, delay);
	setTimeout(function () { 	ytSTDhide();			ytSTDtextSet("");  	if(myI) clearInterval(myI);		}, delay);

	/*
	a=document.querySelector("#movie_player").querySelector('.ytp-bezel-text-wrapper');
	mydiv = document.createElement("div"); 	mydiv.id="mda_text_" +Math.floor(Math.random()*10000); 	mydiv.className="ytp-bezel-text";
	mydiv.innerText = ""; // line 111
	myP = document.createElement("p");
	a.insertBefore(myP,   a.firstChild);
	a.insertBefore(mydiv, a.firstChild);
	//mydiv.insertAdjacentElement('afterbegin', myP);
	//setTimeout(function () { 	mydiv.parentNode.removeChild(mydiv); 	myP.parentNode.removeChild(myP);	}, 4000);
	*/

	return; // !!!
	function VSCshow 	 ()		{ 	vsc.classList.add("vsc-show");		vsc.classList.remove("vsc-hidden"); 	vsc.classList.add("vsc-manual");			}
	function VSChide 	 ()		{ 	vsc.classList.remove("vsc-show");	vsc.classList.add("vsc-hidden"); 					}
	function VSCtextSave ()		{ 	let a=vsc.shadowRoot.querySelector("#controller > span.draggable").innerText;
									if(  a.match(/[0-9]\.[0-9][0-9]/) ) 	vscTextSave=a;									}
	function VSCtextRest ()		{ 	if (vscTextSave)
										vsc.shadowRoot.querySelector("#controller > span.draggable").innerText=vscTextSave;	}
	function VSCtextSet  (t)	{ 	vsc.shadowRoot.querySelector("#controller > span.draggable").innerHTML=t; 				}

	function ytSTDshow 	 	()	{ 	ytSTD.style.display="block"; 	ytSTD.classList.remove("ytp-bezel-text-hide");			}
	function ytSTDhide 	 	()	{ 	ytSTD.style.display="none"; 	ytSTD.classList.add("ytp-bezel-text-hide");				}
	function ytSTDtextSet 	(t)	{ 	ytSTDtext.innerHTML=t; 																	}

	if (hook=="") hook=".html5-video-player";
	var aa = qS(hook); 		if (!aa) return;
	var dialog = document.createElement("dialog");
	dialog.id="mda_dialog"; 		dialog.innerText = msg;		dialog.style.zIndex=1;
	aa.appendChild(dialog);
	dialog.show(); 								setTimeout(function () { 	dialog.close(); 	}, delay);
} // showMsgVSC()


function removeShit (forcedClick=0)  {
			let a, b;
			// logwarn("removeShit tmp disabled"); 	return;

			//arr2delFLEX=[ "Clip", "Download",  "Thanks", "More actions" ]; // aria-label="Clip" title="Clip"  // aria-label="Thanks" title="Show support with Super Thanks"  // aria-label="Download"  style-scope ytd-download-button-renderer  // aria-label="More actions"
			a=qS('[aria-label="Clip"]'); 				if (a) {	if (dbg) log("removeShit():  clip is found"); 		a.remove(); 		}
			a=qS('[aria-label="Download"]');	 		if (a) {	if (dbg) log("removeShit():  downl is found"); 		a.remove(); 		}
			a=qS('[aria-label="Thanks"]');				if (a) {	if (dbg) log("removeShit():  thanks is found"); 	a.remove(); 		}
			// no need to remove a=document.querySelector('[aria-label="More actions"]');

			// inside THREE dots menu
			const arr2delTHREE=[ "Clip", "Создать клип", "Download",  "Thanks",  "Become a member of this channel",  "Join now and get access to exclusive perks" ];  // "Report"
			if (forcedClick) 	qS("#actions-inner")?.querySelector(".dropdown-trigger")?.click();
			if (forcedClick)	ttout(500,  ()=>{	document.dispatchEvent( new KeyboardEvent("keydown", { key: "Escape" }) ); 		});
			//if (dbg) log("removeShit():  arr2delTHREE ", arr2delTHREE.length);
			for (let i = 0; i < arr2delTHREE.length; i++) {
				qS("ytd-app > ytd-popup-container")?.querySelectorAll("yt-formatted-string")?.forEach((el)=> {		// if (dbg) console.log("THREE ", el.innerText);
									if (el?.innerText==arr2delTHREE[i])  { 	// if (dbg) console.log(arr2delTHREE[i] + " found inside three dots - 2del");
																			el.parentNode.parentNode.remove();
									}
				});
			}

			qS('[id="buttons"]')?.querySelector("[aria-label='Create']")?.parentElement.remove();   // remove Create button on the very top near the bell
			qS('[id="buttons"]')?.querySelector("[aria-label='Создать']")?.parentElement.remove();  // remove Create button on the very top near the bell
			qS(".ytp-paid-content-overlay")?.remove();  // paid content warning overlay in the top left corner of video
            qS("yt-button-view-model[id='dismiss-button'].ytd-enforcement-message-view-model")?.click() // remove "Ad blockers are not allowed on YouTube"
            qS("[href='/feed/storefront']")?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.remove();  // primetime movies
			qS("div#masthead-ad")?.remove();  //("div#rendering-content") //"("a#banner.yt-simple-endpoint")  // 2025oct

			qS(".ytp-button[data-tooltip-target-id='ytp-miniplayer-button']")?.remove();  	// delete player button
			qS(".ytp-button[data-title-no-tooltip='Theater mode']")?.remove();  			// delete player button
} // removeShit()


function removeSomeADs () { let c;
	//logwarn("removeSomeADs tmp disabled"); 	return;

	deleteElement("ytd-page-top-ad-layout-renderer");

	// делать через mutation !!!
	deleteElement("ytd-offline-promo-renderer"); 	// выскакивающее окно - Чтобы скачать это видео, подпишитесь на Premium
													// Кроме того, вы сможете смотреть любимые ролики без рекламы, в фоновом режиме и офлайн.  Высокое – 720 пикс. Стандартное – 480 пкс

	deleteElement("ytd-banner-promo-renderer");
	deleteElement("#masthead-ad");
    document.querySelector(".yt-mealbar-promo-renderer")?.parentNode?.parentNode?.parentNode?.remove();  // youtube premium ad  // document.querySelectorAll(".yt-mealbar-promo-renderer")[1].parentNode.parentNode.parentNode.remove()

    c=0; qSA("ytd-in-feed-ad-layout-renderer").forEach(el=>{     //deleteElement("ytd-in-feed-ad-layout-renderer");      // document.querySelector("feed-ad-metadata-view-model")?.parentNode?.parentNode?.parentNode?.remove();  // ytd-in-feed-ad-layout-renderer уже удалило
        el?.parentNode?.parentNode?.parentNode?.parentNode?.remove();  // remove whole AD block to avoid blank spaces
        c++;
    }); if(c) log("ADs removed: ", c);

    c=0; qSA(".badge-style-type-members-only").forEach(el=>{     // members only
        el?.parentNode?.parentNode?.parentNode?.parentNode?.remove();  // remove whole AD block to avoid blank spaces
        c++;
    }); if(c) log("members only removed: ", c);

    // same for badge-style-type-ad  // sponsored

} // removeSomeADs()

//function removeSomeADs_wrapper () {  // no need anymore - see myOnChange()   //was window.addEventListener('scroll', (event) => {
//    let scrollTIMEOUT=1000;     if(scrollLOCK) return;      scrollLOCK=1;
//	log("dbg3759403 on scroll,  scrollTIMEOUT=", scrollTIMEOUT);
//	removeSomeADs();
//	ttout(scrollTIMEOUT,()=>{ 	scrollLOCK=0;	});
//}


function addSaveButton () {

	return;
	var aa,bb;
	const saveBtnShortHTML='<yt-button-view-model class="ytd-menu-renderer"><button-view-model class="ytSpecButtonViewModelHost style-scope ytd-menu-renderer"><button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment" title="Save" aria-label="Save to playlist" aria-disabled="false" style=""><div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span class="yt-icon-shape ytSpecIconShapeHost"><div style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M19 2H5a2 2 0 00-2 2v16.887c0 1.266 1.382 2.048 2.469 1.399L12 18.366l6.531 3.919c1.087.652 2.469-.131 2.469-1.397V4a2 2 0 00-2-2ZM5 20.233V4h14v16.233l-6.485-3.89-.515-.309-.515.309L5 20.233Z"></path></svg></div></span></span></div><div class="yt-spec-button-shape-next__button-text-content">Save</div><yt-touch-feedback-shape style="border-radius: inherit;"><div aria-hidden="true" class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response"><div class="yt-spec-touch-feedback-shape__stroke"></div><div class="yt-spec-touch-feedback-shape__fill"></div></div></yt-touch-feedback-shape></button></button-view-model></yt-button-view-model>';
	const anch='#top-row #flexible-item-buttons';

	// пробовать делать дубликат кнопки !!!

	aa=qS(anch); 		if( !aa ) return;
	aa.appendChild( fromHTML123(saveBtnShortHTML) );

	// искать как вызвать диалог сохранения видео в плейлист !!!

} // addSaveButton()


function dragSaveButton (forcedClick) {
	//log("dragSaveButton tmp disabled");  	return;
	let 	tmout=400, tmout1=400, isret=0, el, pareEl, aa, bb, cc;  // replAA="+" became super global - see mdaytlib

	if( ! wlh.match("youtube.*\/watch") )   {  log("dragSaveButton(): URL is not /watch/ - exiting..."); 	return; }

	// см. коммент у глобальной переменной var newloc !!! >>> qS("#top-row").querySelector('#flexible-item-buttons') самое правильное место, но периодически мерзко дергается

	// СДЕЛАНО через document.onvisibilitychange - при загрузке во вкладках не в фокусе передвижка не работает
	// НЕ ПОМОГЛО !!! пробовать сначала вычищать downloads & etc из трех точек - может тогда save станет видимой

	// чтобы Save стабильно была видима - надо в uBlock Origin убрать галочку "Disable cosmetic filtering" !!!

	// когда Save видима, то в HTML это так:	div id="above-the-fold" ->	id="actions-inner" -> id="menu" -> id="flexible-item-buttons"
	//											document.querySelector("#above-the-fold").querySelector('#flexible-item-buttons').querySelectorAll(".yt-spec-button-shape-next__button-text-content")[2].innerText
	//											aria-label="Save to playlist" title="Save"   >>>>>  document.querySelector('[aria-label="Save to playlist"]')
	//                                          <div id="save-button" class="style-scope ytd-playlist-panel-renderer"></div>
	// когда Save скрыта в трех точках: 		document.querySelector("ytd-app > ytd-popup-container")?.querySelectorAll("yt-formatted-string")[0].innerText
	// 											хотя она невидимо присутствует в видимом месте document.querySelector("ytd-app > ytd-popup-container")?.querySelectorAll("yt-formatted-string")[3].innerText

	if (! window.location.href.match("youtube.com\/watch")) 	{ if(dbg) log("save button - wrong url"); 	return; } // works only on pages with video playing

	aa=qS('#mdaSave');  if(aa) {	aa.innerText=replAA;   // set save button text
									aa.isEmpty='true';      				// если да - то текст не показывается !!!
									//aa.removeAttribute("is-empty"); 	// удалить, чтобы текст показался !!!
									aa.style.marginRight='1px';
									aa.parentNode.style.paddingLeft  ='1px';		aa.parentNode.style.paddingRight ='1px';
									bb=aa.parentNode.querySelector('yt-icon');  	if(bb) 	bb.style.marginRight='1px';
	}

	// ютюб кривой - заипало - закомментил   // 		в дереве save button часто есть   	//		но почему-то не отображается - ЗАВИСИТ ОТ МАСШТАБА !!!
	//if (document.querySelector("#actions-inner")?.querySelector('#flexible-item-buttons > yt-button-view-model')?.querySelector('[aria-label="Save to playlist"]')) {
	if (aa=qS("#actions-inner")?.querySelector("[aria-label='Save to playlist'],  [aria-label='Добавить в плейлист']")) {
		isSaveVisible=true;
		aa.id='mdaSave';  		// чтобы легче добираться
		log("Save button is visible !!! - do nothing"); //} // save изначально на правильном видимом месте
		let choice="no_icon";
		if( choice=="no_icon" )		aa.innerText='Save';  // ставим тут именно Save, т.к. это убирает иконку !!!
		else 						if( bb=aa.querySelector(".yt-spec-button-shape-next__button-text-content")  )  bb.innerText=replAA;

//  /*
		qS(newloc)?.querySelectorAll("yt-formatted-string")?.forEach((el) => { 	let itt=el.innerText;
				if (itt=="Save" || itt=="Сохранить" || itt==replAA)  { 			pareEl=qS("ytd-app > ytd-popup-container");   // el.innerText=replAA;
																				log("Save button found in newloc - MOVING back to THREE DOTS menu " + pareEl);
																				pareEl.append(el.parentNode.parentNode);  // move element to another parent
				}
		});
//  */

		isret=1; // return;
	}
	else
	{		isSaveVisible=false;
			log("Save button is INVISIBLE 23789");
	}

	// document.querySelector("#flexible-item-buttons > yt-button-view-model > button-view-model > button")
	// /html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[2]/ytd-watch-metadata/div/div[2]/div[2]/div/div/ytd-menu-renderer/div[2]/yt-button-view-model/button-view-model/button
	// document.querySelector("#flexible-item-buttons > ytd-download-button-renderer")
	// document.querySelector("#top-row")?.querySelector('#flexible-item-buttons > yt-button-view-model')?.querySelector('[aria-label="Save to playlist"]')
	pareEl=qS(newloc);
	pareEl?.querySelectorAll("yt-formatted-string")?.forEach((el) => {  let itt=el.innerText;  // check Save button in NEW location
			if (itt=="Save" || itt=="Сохранить" || itt==replAA) { 	console.log("Save button is already in NEW parent"); //, el.parentNode.parentNode);
																	//isMenuClicked=true; moved to ThreeDotsMenuClick()    // почему-то нижерасположенные settimeout-ы выполнялись даже после return-а тут
																	isret=1; //return;
																}
	});
	ttout(tmout,  ()=>{	// click three dots menu with share/report/save/download
							if ( (!isMenuClicked && !isSaveVisible) || forcedClick) { 	log("SaveButton:  threedots CLICK ! <<<<<<<<<<<<<<<  forced=" + forcedClick);
								ThreeDotsMenuClick();
								//setTimeout(() => 	{ 		isMenuClicked=true; 		},tmout+tmout1+200);
								//document.body.style.visibility='hidden';
							}
	});

	if (isret) return;
	ttout(tmout+tmout1+400,  ()=>{

		// здесь лучше и надежнее через SetInterval проверять isMenuClicked=true и не надо ttout !!!

		qS("ytd-app > ytd-popup-container")?.querySelectorAll("yt-formatted-string").forEach((el) => {
				if (dbg) console.log("dragSaveButton 4578: ", el.innerText);
				let itt=el.innerText;
				if (itt=="Save" || itt=="Сохранить" || itt==replAA)  { 	console.log("Save button found inside three dots - MOVING to NEW parent " + newloc); //, el.parentNode.parentNode);
																		el.id='mdaSave';  		// теперь можно пробовать легче добираться до этой кнопки !!!
																		el.innerText=replAA;	// ставим свой символ
																		// log("7776 itt style", itt.style);
																		pareEl.append(el.parentNode.parentNode);  // move element to another parent
				}
		});
	});

} // dragSaveButton()



// see ThreeDotsClick()   ThreeDotsClick ()   !!!




  function videoSeekBy(t, v) {
    (v = document.querySelector('.html5-video-player')) && v.seekBy(t);
  }


  function videoSeekTo(p, v) {
    (v = document.querySelector('.html5-video-player')) && v.seekTo(v.getDuration() * p);
  }


  function videoSeekChapter(d, v, s, t) {
    if (
      (v = document.querySelector('.html5-video-player')) && (s = v.getPlayerResponse().videoDetails) &&
      (s = s.shortDescription)
    ) {
      t = v.getCurrentTime();
      if (s = s.match(/^(?:\s*\d+\.)?\s*(\d{1,2}:)?\d{1,2}:\d{1,2}\s+\S+.*/gm)) {
        s = s.map(s => {
          s = s.match(/^(?:\s*\d+\.)?\s*(\d{1,2}:)?(\d{1,2}):(\d{1,2})/);
          s[1] = s[1] ? parseInt(s[1]) : 0;
          s[2] = s[2] ? parseInt(s[2]) : 0;
          s[3] = s[3] ? parseInt(s[3]) : 0;
          return (s[1] * 3600) + (s[2] * 60) + s[3]
        })
      }
    }
    if (
      (!s || !s.some || !s.length) && (s = window["page-manager"]) && (s = s.getCurrentData()) && (s = s.response) && (s = s.playerOverlays) &&
      (s = s.playerOverlayRenderer) && (s = s.decoratedPlayerBarRenderer) && (s = s.decoratedPlayerBarRenderer) && (s = s.playerBar) &&
      (s = s.multiMarkersPlayerBarRenderer) && (s = s.markersMap)
    ) {
      s.some(m => {
        if (/^(AUTO|DESCRIPTION)_CHAPTERS$/.test(m.key)) {
          if ((m = m.value) && (m = m.chapters) && m.length && m[0] && m[0].chapterRenderer && m[0].chapterRenderer) {
            s = m.map(a => Math.floor(a.chapterRenderer.timeRangeStartMillis / 1000))
          }
          return true
        }
      })
    }
    if (s && s.some) {
      if (s.length && (s[0] > 1)) s.unshift(0);
      s.some((c, i) => {
        if ((d < 0) && (c <= t) && (!s[i + 1] || (s[i + 1] > t))) {
          if ((c + 1) >= t) { 	v.seekTo(s[i - 1]); 	}
		  else 					v.seekTo(c);
          return true
        } else if ((d > 0) && (c > t) && i) {
          v.seekTo(c);
          return true
        }
      })
    }
  }


function toggleYtVideoControls (fl=69) { // returns 1 if showing overlays, 0 - if hiding overlays
	var v = document.querySelector('.html5-video-player'); 			if(!v) log("html5-video-player is NOT found");
	v.classList.remove("ytp-autohide-active");
	switch (fl) {
		case 0:			v.classList.add("ytp-autohide");		return 0; 		break;
		case 1: 		v.classList.remove("ytp-autohide");		return 1;		break;
		case 69: 		if (v.classList.contains("ytp-autohide-active")) 	{       v.classList.remove("ytp-autohide-active"); 		return 1;	}
	  					else if (v.classList.contains("ytp-autohide")) 		{       v.classList.remove("ytp-autohide"); 			return 1;   }
	  					else 												{ 		v.classList.add("ytp-autohide");  				return 0;	}
						break;
	}
} // toggleYtVideoControls()


function toggleYtOverlaysAtTheEndOfVideo (fl=0) {
	document.querySelectorAll(".ytp-ce-element.ytp-ce-video.ytp-ce-element-show,   .ytp-ce-element.ytp-ce-channel.ytp-ce-channel-this,   .ytp-ce-covering-overlay,   .ytp-ce-element") 	// remove overlays (cards) with recommended at the end of video
		.forEach((el) =>	{   	if(fl) 	el.style.display="block";				else  		el.style.display="none";				});
} // toggleYtOverlaysAtTheEndOfVideo()



  function selectQuality (qual, v, e, c) {
	var i, qq, aba;
    if ((v = document.querySelector('.html5-video-player')) && (v.getAvailableQualityLabels().length > 1)) {
	  qq=v.getAvailableQualityLabels(); 				// console.log("quality arr: ", qq);
      if (qual === "get") {
		(e = v.getAvailableQualityLevels()).pop(); 		c = e.indexOf(v.getPlaybackQuality());
		//showMsgVSC("Current: " +qq[c], 2500);  			// log(c, '\n', aa[c]);
		return qq[c];
	  }
      if (qual === "A") {
        v.setPlaybackQualityRange("auto", "auto"); 		// console.log("qweasdzxc auto");
		showMsgVSC("Quality Auto", 2500);
      } else {
        (e = v.getAvailableQualityLevels()).pop();
        c = e.indexOf(v.getPlaybackQuality()); 			// console.log("curr qual c=", c, '\n', qq[c]);
		if(qual == "up") 	{ i=-1; 	aba=((c+i)<0) 				? 0 			: c+i; 	}
		if(qual == "dn") 	{ i=1; 		aba=((c+i)>(qq.length-1))	? qq.length-1 	: c+i;  }
		if(qual == "max") 	{ i=-c;				aba=c+i;						} // jump to max quality, which index is 0, 			so c+i must give 0
		if(qual == "min") 	{ i=qq.length-1-c; 	aba=c+i;						} // jump to min quality, which index is qq.length-1, 	so c+i must give qq.length-1
		if (e = e[c + i]) v.setPlaybackQualityRange(e, e); 	//	if (e = e[c + i]) setTimeout(() => {    v.setPlaybackQualityRange(e, e);  }, 500);
		showMsgVSC(qq[c] +" -> " +qq[aba], 2500);  		// console.log("next qual ", aba, '\t', qq[aba]); 	// console.log("c=" +c, '\n', "i=" +i);
      }
    }
  }


document.addEventListener("keydown", (e) => {
		var j, set=false, aa, bb, za, np="";
		// moved to MDAlib  function anyActiveInput() {   const inputs = document.querySelectorAll("input,textarea");    return Array.from(inputs).includes(document.activeElement);    }
		if( anyActiveInput() ) 	return; 					//if ((aaBB = document.activeElement) && (editable(a) || (a.tagName === "INPUT") || (a.tagName === "TEXTAREA"))) return;

		//aa=qS("div.html5-video-player");
		//if( aa && elementIsVisibleInViewport(aa) ) 	ttout(1500, ()=>{  	aa.focus();				}); 		// focus on player if it is visible
		//else 											ttout(10,   ()=>{  	qS("body")?.focus();	}); 		// FAILS focus on body if it is NOT visible

	    //log(e.code);
		showRealRemainTime();  // immediately
		for(let i=1;i<=5;i++) {		ttout(i*1000, ()=>{  		showRealRemainTime(); 		});			} 	// five iterations

		switch (e.code) {
	        case "KeyR":  // show speed and quality !!!
				if (event.shiftKey || event.ctrlKey || event.altKey)	break;
				aa=selectQuality("get");								bb=getSpeed();		showMsgVSC(`${aa} - ${bb}x`, 2500);
				e.preventDefault();		e.stopImmediatePropagation();
	            break;

	        case "KeyQ":  // ex.keyA
				if (!set && event.shiftKey && event.ctrlKey)	{ 	selectQuality("A");		set=1; 	} // quality: auto
				if (!set && event.shiftKey) 					{ 	selectQuality("max");	set=1; 	}
				if (!set) 										{ 	selectQuality("up"); 	set=1; 	}
				if (event.ctrlKey)								{ 	document.activeElement.blur();	 break; 	} // to allow normal Select All
				if (set) 										{ 	e.preventDefault();		e.stopImmediatePropagation();	}
	            break;
	        case "KeyA":  // ex.keyZ
				if (!set && event.shiftKey && event.ctrlKey)	{ 	aa=selectQuality("get");	set=1; 	showMsgVSC("Current: " +aa, 2500);  } // get current quality
				if (!set && event.altKey)                    	{ 	aa=selectQuality("get");	set=1; 	showMsgVSC("Current: " +aa, 2500);  } // get current quality
				if (!set && event.shiftKey) 					{ 	selectQuality("min");	set=1; 	}
				if (!set) 										{ 	selectQuality("dn"); 	set=1; 	}
				if (event.ctrlKey)								{ 	document.activeElement.blur();	 break; 	} // to allow normal Ctrl-Z
				if (set) 										{ 	e.preventDefault();		e.stopImmediatePropagation();	}
	            break;

			case "ArrowLeft":          //  mda  set arrow - 5 sec !!!  shift-arrow - 30 sec  ctrl-arrows 5 мин
				j=-5; 	wake();
				if (!set && event.AltRight) 	                {  log("AltRight break");  break;    } // писать в кукисы или переменную для отладки !!!
				if (!set && event.shiftKey && event.ctrlKey) 	{  j=-240;	set=1; 	videoSeekBy(j);	}
				if (!set && event.shiftKey) 					{  j=-30;	set=1; 	videoSeekBy(j);	}
				if (!set && event.ctrlKey)  					{  j=-120;	set=1; 	videoSeekBy(j);	}
				//videoSeekBy(j); // videoSeekBy(5) прыгает на 10 сек, поэтому закоментировал, чтобы по стрелке срабатывал штатный прыжок yt на 5 сек
				showMsgVSC("&#x23EA; " +j +" sec");	set=0;
				// обновлять также <div class="ytp-doubletap-tooltip-label">5 seconds</div>  <<< 30 sec, 120 sec, 240 sec
				// сука глючит на 120 и 240 секундах, не убирает срелки с текстом
				// вообще ВЫРЕЗАТЬ нахер !!! document.querySelector("#movie_player > div.ytp-doubletap-ui-legacy").remove();
				/* za=document.querySelector("#movie_player > div.ytp-doubletap-ui-legacy");
				if(za) { 	za.classList.add("ytp-time-seeking");
							za.style.display="";	//	setTimeout(() => 	{	za.classList.remove("ytp-time-seeking"); 	za.style.display="none";	},2000);
							za.setAttribute("data-side", "back"); 	}
				*/
				// WORKS
				za=qS("#movie_player > div.ytp-doubletap-ui-legacy > div.ytp-doubletap-seek-info-container > div.ytp-doubletap-tooltip > div.ytp-doubletap-tooltip-label");
				if(za) za.innerText=j +" seconds";
				e.stopImmediatePropagation(); 	e.preventDefault();
				break;
			case "ArrowRight":
				j=5; 	wake();
				if (!set && event.AltRight) 	                {  log("AltRight break");  break;    } // писать в кукисы или переменную для отладки !!!
				if (!set && event.shiftKey && event.ctrlKey) 	{  j=240;	set=1; 	videoSeekBy(j);	}
				if (!set && event.shiftKey) 					{  j=30;	set=1; 	videoSeekBy(j);	}
				if (!set && event.ctrlKey)  					{  j=120;	set=1; 	videoSeekBy(j);	}
				//videoSeekBy(j); // videoSeekBy(5) прыгает на 10 сек, поэтому закоментировал, чтобы по стрелке срабатывал штатный прыжок yt на 5 сек
				showMsgVSC( j +" sec"  +" &#x23E9;");	set=0;
				//			za.setAttribute("data-side", "forward"); 	}
				// WORKS
				//za=qS("#movie_player > div.ytp-doubletap-ui-legacy > div.ytp-doubletap-seek-info-container > div.ytp-doubletap-tooltip > div.ytp-doubletap-tooltip-label");
				//if(za) za.innerText=j +" secs";
				e.stopImmediatePropagation(); 	e.preventDefault();
				break;

	        case "KeyD":
				if (event.shiftKey  ||  event.ctrlKey  ||  event.altKey)  break;
				//click_show_more_replies();
				showRealRemainTime();
				//vsc_font("",0); // vsc_font("23px",1);
				return;

				j=20000;
				if (!dbg && !dbg_tmp) {  // если НЕ включено ни постоянной ни временной отладки, то включаем на 20 сек
					dbg_tmp=1;	dbg=1; 		setTimeout(()=>{ 	dbg=0;  dbg_tmp=0;		},j);
				}
				vsc_font("23px",1);
				showMsgVSC(`vsc: ${vsc_control("getspeed")} debug`, 2500);
				myOnChange("KeyD debug for " +j +" msec",  400,  1,  j);
						//localStorage.setItem( 'key1', 'My Poland' );  // GM_setValue("mdaVal", "test val 13 upd");
						//j=localStorage.getItem( 'key1');      //GM_getValue("mdaVal");
						//console.log( j );
				e.preventDefault();		e.stopImmediatePropagation();
	            break;

	        case "KeyN": 			np="Next", j=1;
	        case "KeyP": if (!np) 	np="Prev", j=-1;
				if (event.shiftKey  ||  event.ctrlKey  ||  event.altKey)  break;
				wake();			//			toggleYtVideoControls();
				showMsgVSC(np + " chapter");
				videoSeekChapter(j); 		if(np=="Prev") videoSeekChapter(j); 	// for Prev we jump 2 times !!!
				// >>> ТЕОРЕТИЧЕСКИ можно имитировать отправку ctrl-left/right <<<
				// главы не переключались на ролике https://www.youtube.com/watch?v=gua1j4bz3hQ&t=814s - ЭТО кривые чаптеры в конкретном ролике !!!
				e.preventDefault();			e.stopImmediatePropagation();
	            break;

	        case "KeyV":
				if (event.shiftKey  ||  event.ctrlKey  ||  event.altKey)  break;
				set=toggleYtVideoControls(69);
				toggleYtOverlaysAtTheEndOfVideo(set);
				showMsgVSC("toggle video controls & overlays", 1200);
				e.preventDefault();		e.stopImmediatePropagation();
	            break;

			case "Insert":
				if (event.shiftKey  ||  event.ctrlKey  ||  event.altKey)  break;
				toggleYtVideoControls(1);
				toggleYtOverlaysAtTheEndOfVideo(1);
				showMsgVSC("ENABLE video controls & overlays", 1200);
					aa=qS('#mdaSave');  if(aa) {	aa.innerText="+"; 	aa.removeAttribute("is-empty");	}   // tmp
				e.preventDefault();		e.stopImmediatePropagation();
	            break;

			case "Delete":
				if (event.shiftKey  ||  event.ctrlKey  ||  event.altKey)  break;
				toggleYtVideoControls(0);
				toggleYtOverlaysAtTheEndOfVideo(0);
				showMsgVSC("DISABLE video controls & overlays", 1200);
					aa=qS('#mdaSave');  if(aa) {	aa.innerText="+"; 	aa.isEmpty='true';	}   // tmp
				e.preventDefault();		e.stopImmediatePropagation();
	            break;


			case "Period": 	// vsc стал глючить c показом скорости - workaround
			case "Comma":
				if (event.shiftKey  ||  event.ctrlKey  ||  event.altKey)  break;
				ttout(50,()=>{ 		showMsgVSC(`vsc speed: ${vsc_control("getspeed")}`, 2000);		});  // 50ms to let vsc to switch the speed
				// e.preventDefault();  ТУТ preventDefault НЕ НУЖЕН !!!
			break;

	  		case "Backquote":  // for embedded youtube videos on rezka site
		  		log("MDA youtube +SaveButton: Backquote: ", window.location.href);
				event2parent('closeIFrame', "some_random_2984j");
				e.preventDefault();
        		break;
   		}
}); // addEventListener("keydown"...




	function event2parent (cmd, msg="") {  // for embedded youtube videos on rezka site
			log("event2parent(): sent "  +cmd  +" "  +msg, '\n', location.ancestorOrigins, "\n", window.crossOriginIsolated, "\nparent: ", parent);
			parent.postMessage(cmd, "*");
			// let aa=window.parent.document.dispatchEvent(evCL);  						// cross-origin error
			//parent.postMessage('MDAiframe2parentBB',"*");                    			// WORKS
			//window.parent.postMessage('MDAiframe2parent',"https://hdrezka.me");   	// WORKS
			//window.parent.document.postMessage('MDAiframe2parent',"*");           	// cross-origin error
			//window.parent.dispatchEvent(evCL);										// cross-origin error
			// window.parent.direct_run_from_iframe();  								// cross-origin error
			//window.parent.trigger(evCL,"https://hdrezka.me");
	} // event2parent()








// повесить на mouseover для плеера !!

/* убрал, т.к. перестает работать кнопка скачки из YouTube Converter/Downloader + MDA FIX
document.addEventListener("click",() => {
		log(`!!! Click`);
		showRealRemainTime();  // immediately
		for(let i=1;i<=5;i++) {		ttout(i*1000, ()=>{  		showRealRemainTime(); 		});			} 	// five iterations
}); // addEventListener("click"
*/







function showDateTime (triesCNT, showdelay=2000)  { 	// shows exact date/time right below video title
	var pEl,  dt=null, dt1, dt1d, dt2, dt2d="",  dt3, dt3d, ttip, dtsrc='n/a', dtAgo="", dtAgo2="", mydiv, mydiv1,  a, b,	fn=fnName();
	var htm, mydivID="mda_datetime"; 	    // >>> РАБОТАТЬ c датами только в EN-US, показать в ru-RU только в самом конце !!! <<<
	var show_mda_debug1="none"; 	if(dbg) show_mda_debug1="block";
	if( (! window.location.href.match("youtube.*\/watch")) && (! window.location.href.match("youtube.*\/shorts")) )   {  log(`${fn}: url is not /watch or /shorts, exiting`); 	return;	}
	a=qS("ytd-watch-flexy > #microformat > .playerMicroformatRendererHost"); 			// JSON.parse(document.querySelector("ytd-watch-flexy > #microformat > .playerMicroformatRendererHost")?.innerText).uploadDate
	if (a) 	{	dt=JSON.parse(a?.innerText)?.uploadDate, 			dtsrc="playerMicroformatRendererHost"; // https://www.vidbeo.com/blog/json-ld-for-video-seo/
				dt=dt.replace(/(-[0-9][0-9]:[0-9][0-9])$/gis,''); 	} // иногда формат бывает такой "2024-11-17T04:00:09-08:00" - НАДО ОБРЕЗАТЬ
	if (!dt) dt=qS('[itemprop="datePublished"]')?.content, 			dtsrc="datePublished"; 	// бывает, что даты нет
	if (!dt) dt=qS('[itemprop="uploadDate"]')?.content, 			dtsrc="uploadDate";
	if (!dt) dt=0, 													dtsrc="no_upload&published";
	dt1  = new Date(dt).toLocaleString('en-US');  		dt1d = new Date(dt1).toLocaleDateString('en-US');	// 'en-GB'  // изредка глючит и не отдает ни datePublished ни uploadDate ни PlayerMicroformatRendererHost

	ttip=qS("#bottom-row > #description > #description-inner > ytd-watch-info-text > tp-yt-paper-tooltip > #tooltip")?.innerText;
	if(ttip) {	dt2  = ttip.replace(/(.*)((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec).*[0-9][0-9].*[0-9][0-9])(.*)/gis,'$2'); 	//dt2  = ttip.replace(/(.*)((янв|фев|мар|апр|май|июн|июл|авг|сен|окт|ноя|дек).*[0-9][0-9].*[0-9][0-9])(.*)/gis,'$2');
				dt2  = new Date(dt2).toLocaleString('en-US'); 		dt2d = new Date(dt2).toLocaleDateString('en-US');  } //dt2d = dt2.getFullYear() +dt2.getMonth() +dt2.getDate();

	if (dt2 && dt2!='Invalid Date') { 	if (dt1d != dt2d) dt1=dt2; 	} 	// dt2 - на 100% актуальна, но без часов:минут, поэтому если dt1 взялась от предыдущего ролика (см. *nb1*), то пользуем dt2

	// for shorts:  ytInitialPlayerResponse - НЕ ОБНОВЛЯЕТСЯ при скролле вниз на следующий ролик
	// window?.ytInitialPlayerResponse?.microformat?.playerMicroformatRenderer?.publishDate  - WORKS
	// window?.ytInitialPlayerResponse?.microformat?.playerMicroformatRenderer?.uploadDate   - WORKS
	// document.querySelector("#content > ytd-structured-description-content-renderer > #items > ytd-video-description-header-renderer > #factoids > factoid-renderer > .ytwFactoidRendererFactoid")?.innerText - WORKS
	//  no way to stop or break a forEach() loop other than by throwing an exception <<<  https://stackoverflow.com/questions/2641347/short-circuit-array-foreach-like-calling-break
	dt3=""; dt3d=""; a=document.querySelectorAll("#content > ytd-structured-description-content-renderer > #items > ytd-video-description-header-renderer > #factoids > factoid-renderer > .ytwFactoidRendererFactoid")?.forEach(xx => {
		//if(dbg) log(">>forEach xx", xx, ">>forEach xx END");
		if ( xx.ariaLabel.match(/[a-zA-Z][a-zA-Z][a-zA-Z] .*[0-9]+.*20[0-9][0-9]/) ) { // is datetime?
			dt3=xx.ariaLabel;	dt3d=new Date(dt3).toLocaleString('en-US');   if(dbg) log(">>forEach xx FOUND", xx.ariaLabel, dt3);
			if (dt3d != 'Invalid date') { 	dtsrc="arialabel";	return true;	}   // return true is an attempt to break forEach()
		}
	}); // .forEach

	//	пробовать выдергивать publishedTimeText ("x hours ago") из ytInitialData (новый!!!)

	// совсем будут проблемы, то  тогда кликать мышью в document.querySelector("#info-container > #date-text").click() <<<<<<<<<<<<<<<<
	// 			там где "x hours ago" и брать оттуда document.querySelector("#info-container > [id='info']").innerText
	if ( a=document.querySelector("#info-container > [id='info']") ) {
 		if( a.innerText.match(/(.*) ([0-9]+ .* ago)($|.*)/) ) dtAgo=a.innerText.replace(/(.*) ([0-9]+ .* ago)($|.*)/gis,"$2");
 		if( a.innerText.match(/(.*)((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec).*[0-9][0-9].*[0-9][0-9])(.*)/gis) ) dtAgo=a.innerText.replace(/(.*)((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec).*[0-9][0-9].*[0-9][0-9])(.*)/gis,'$2');
	}
	// dtAgo2 - после открытия нового ролика в том же окне дату показывает от предыдущего !!! if ( a=document.querySelector("div[id='factoids']")?.querySelector("upload-time-factoid-renderer")?.querySelector(".ytwFactoidRendererFactoid") )  dtAgo2=a?.ariaLabel; 	if (dtAgo2) dtAgo=dtAgo2;

	if(dbg) 	log(">== dt1 & dt2==", dt1 +"\t" +dt1d +" " +dtsrc,'\n',  dt2 +"\t" +dt2d, '\n',  "dt1 == Invalid Date ? ", dt1=='Invalid Date', "dt3d: " +dt3d, " dtAgo: " +dtAgo);
	   				// *nb1*: если в окне с видео щелкнуть на следующее, то youtube не обновляет дату виде ни в datePublished ни в uploadDate,  в ytInitialPlayerResponse тоже дата не обновляется
					// обновляется иногда только PlayerMicroformatRendererHost !!!  но иногда он почему-то ВООБЩЕ недоступен !!!
   					// НО тут ВСЕГДА актуальная дата, но без времени     document.querySelector("#bottom-row > #description > #description-inner > ytd-watch-info-text > tp-yt-paper-tooltip > #tooltip").innerText  // '\n  656,386 views • Dec 13, 2024 • #орешник #путин #солдаты\n'

	if( window.location.href.match("youtube.*\/watch") ) { 	// for normal videos !!!
		if (a=qS(`#${mydivID}`)) 	{ 	if(dbg) log("showDateTime(): "+ mydivID +" already exists, updating once more", a);
									a.innerHTML = mkdate(dt1);
									b=qS("#mda_debug1"); 												if(dbg) log("existing mydiv1 zxc: ", b, b?.innerText);
									if(b) 			{	b.innerHTML = mkdebug1(); 	b.style.display=show_mda_debug1; 	}
									setTimeout(()=>	{	if(b) b.style.display="none";									},showdelay);
									return;
		}

		if( typeof MDAytlib == "undefined" )  {  log("1177294552 no youtube lib included - exiting");  return;  }

		pEl=qS("#above-the-fold > #title");
		if (!pEl) { 	if(dbg) log("parent #above-the-fold > #title  is NOT FOUND", pEl);		return; 	}

		a=qS("#mdaDateTimeSavelist_tbl");
		if (!a) { 	b=pEl.appendChild( fromHTML123(mdaDateTimeSavelistTBL) );		log("showDateTime(): NEW TABLE --- ", b); 	}

    	mydiv1 = document.createElement("h3"); 	mydiv1.id="mda_debug1";	 	if(dbg) log("NEW mydiv1: ",mydiv1);
    	mydiv1.innerHTML = mkdebug1(); 										// triesCNT +" ... " +"dtsrc: " +dtsrc +" " +ttip;
		mydiv1.style.display=show_mda_debug1;
		pEl.insertAdjacentElement('afterend', mydiv1);
									b=qS("#mda_debug1"); 												if(dbg) log("existing mydiv1 zxc: ", b, b?.innerText);
									if(b) 			{	b.innerHTML = mkdebug1(); 	b.style.display=show_mda_debug1; 	}
									setTimeout(()=>	{	if(b) b.style.display="none";									},showdelay);

		pEl=qS("#mdaDateTime_row1");
		htm=`<td id="mdaDateTime_td111">	<h3 id=${mydivID}>	${mkdate(dt1)}	</h3>	</td>`; 		// mydiv.style.position="relative";		mydiv.setAttribute("style",`width:auto; height:auto; top:10%; left:5%;  padding: 10px;  color:Silver; font-size:15px; background-color:#00008B; z-index:99;`); //	opacity:0.9;   text-shadow: 5px 5px 20px #00FF00;`);
		a=qS(`#${mydivID}`);  // doublecheck, т.к. эту таблицу конкурентно создает и MDA youtube playlists
		if( !a ) {  a=pEl.appendChild(fromHTML123(htm));		log("showDateTime(): NEW --- ", a);  }
	}

	if (window.location.href.match("youtube.*/shorts/")) { 	// for shorts // нет PlayerMicroformatRendererHost   если в окне с видео прокрутить на следующее, то youtube не обновляет дату виде ни в datePublished ни в uploadDate,
					// пробовать  "contentDetails"."videoPublishedAt": datetime -  	https://developers.google.com/youtube/v3/docs/videos#snippet.publishedAt
					// 																https://stackoverflow.com/questions/70960233/youtube-data-api-playlistitems-list-snippet-publishedat-returning-uploaded-d     https://developers.google.com/youtube/v3/docs/playlistItems#resource
					// нашел apiKey НО он зашкварен  'AIzaSyA7dAzzNvPCxTSsSGiV7dvoj3rkt0qbdXg' https://www.sitepoint.com/community/t/display-published-date-and-category-from-youtube-video/292713?page=2
		if (a=qS('#' +mydivID +"shorts")) 	{ 	if(dbg) log("showDateTime(): " +mydivID +"shorts" +" already exists, updating once more");
												a.innerHTML = mkdateSh();
												return; 	}
		a=qS("#shorts-player");
		if (!a) { 	log("showDateTime(): #shorts-player is not found");  return; 	}
		mydiv1 = document.createElement("div"); 	mydiv1.id=mydivID + "shorts";	 if(dbg) log("mydivshorts: ",mydiv1);
		mydiv1.innerHTML = mkdateSh();
		a.insertBefore(mydiv1, a.firstChild);  // prepend() вроде как предпочтительнее https://stackoverflow.com/questions/2007357/how-to-set-dom-element-as-first-child

		a=qS(".paragraphs");
		if(a && !shortsDatetimeAdded) a.innerText=dt1.replace(/:[0-9][0-9]$/, '') + " " + a.innerText,   shortsDatetimeAdded=true;
	}

	function mkdate (inp) 	{ 	return new Date(inp).toLocaleString('ru-RU').replace(/:[0-9][0-9]$/, '') +"&#x3000;" +dtAgo; 	} 	// +" ...  " +dt2     	//function mkdate (inp) { 	return inp.replace(/:[0-9][0-9]$/, ''); 	} 	// +" ...  " +dt2
	function mkdebug1 ()	{ 	return triesCNT +"<br> dt1: "  +dt1 +" " +dtsrc +"<br>" +"ttip:" +ttip +"<br>dt3: " +dt3d  +"<br> dtAgo: " +dtAgo; 	}
	function mkdateSh ()	{ 	//return "&#x3000;&#x3000;" +dt1.replace(/:[0-9][0-9]$/, '') +"&#x3000;&#x3000;" +triesCNT +" ... " +dtsrc +" " +ttip +"<br>&#x3000;&#x3000;dt3: " +dt3;
								let ret="&#x3000;&#x3000;" +new Date(dt3).toLocaleString('ru-RU').replace(/:[0-9][0-9]$/, '')
								if(dbg) ret=ret +"&#x3000;&#x3000;" +triesCNT +" ... " +dtsrc +" " +ttip;
								return ret; 		}
} // showDateTime()


function rightFocusOnVideosPage (caller)  {  // когда на странице с щелкаешь в videos или shorts, то фокус остается на том элементе и невозможно стрелками прокрутить список видосов
	let hr=window.location.href;
	if(dbg) log("rightFocusOnVideosPage(): chk " + caller, hr);
	if (hr.match("youtube.*/videos$") || hr.match("youtube.*/shorts$") || hr.match("youtube.*/featured$") || hr.match("youtube.*/podcasts$") || hr.match("youtube.*/community$")) {
		document.activeElement.blur(); 		log("rightFocusOnVideosPage(): unfocused " + caller);
	}
} // rightFocusOnVideosPage()


function 	myOnChange (caller, delay, forcedClick, showdelay=2000) {
	if(dbg) log("myOnChange " +caller +"   dbg: " +dbg  +"  showdelay: "  +showdelay);
	if(dbg) console.log("dragSaveButton() on "+ caller + "--- --- ---");
	tickCURR=Date.now();
	// tickCURR, tickPROC - MUST BE GLOBAL !!!
	if (!tickPROC) 		tickPROC=setInterval(function () {  // если быстро нажали Ctrl +/- несколько раз подряд, то отработать только последнее
									let cu=Date.now();
									if ((cu-tickCURR) < 500) {
										if (dbg)  log("interv: <500 - skip")
									}
									else { 	if (dbg)  log("myOnChange: finally fire");	clearInterval(tickPROC);	tickPROC=null;
											setTimeout(() => 	{ 	dragSaveButton(forcedClick); 	click_show_more_replies();  removeShit(0);	},delay);
											showDateTime(caller, showdelay);
											showDateTime(caller, showdelay*2);
											showRealRemainTime();
											LikeDislike_n_Other_Reshape();
                                            removeSomeADs();
									}
						}, 600);
} // myOnChange()



function pageDown_onLoad () {  // to load comments
    log("scroll pageDown_onLoad() disabled");
	return;

	scroll_style('default');
	scroll453422(0, 4000);  				// jump down  		//window.scrollTo({ top: 3000, left: 0, behavior: 'default' });
	ttout( 500,  ()=>{ scroll453422(0, 0); 										});
	ttout(1700,  ()=>{ scroll453422(0, 0);										}); 	//setTimeout(()=>{ window.scrollTo({ top: 0, left: 0, behavior: 'default' }); 	},2000);

	function scroll_style (type) {
		GM_addStyle(` 	/* css scroll */	html, body{ scroll-behavior: ${type}; }	`);
	}
	function scroll453422 (x,y) {
		window.scrollTo(x, y);
		log("scroll:  " +x +", " +y);
	}
} // pageDown_onLoad()



// 2do:
// dbg  - отладка
// verb - немного расширенные сообщения

document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
        console.log("tab is active");
        myOnChange("TAB VISIB chg", 900, 0);	myOnChange("TAB VISIB chg", 3000, 0);  // если перерисовка страницы долгая, то надо запускать два раза
    } else {
        console.log("tab is inactive");
    }
});
window.onresize 			= function() {		myOnChange("TAB SCALE chg", 900, 0);	myOnChange("TAB SCALE chg", 3000, 0);	};
window.addEventListener('scroll', (event) => {    myOnChange("SCROLL chg", 400, 0);                                             });

window.navigation.addEventListener("navigate", (event) => {   // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
	rightFocusOnVideosPage("on navigate event"); 	if(dbg)	log("navigate event fired for rightFocusOnVideosPage()");
	showDateTime("on nav");
})


function LikeDislike_n_Other_Reshape () {  var aa, bb;
	aa=qS(".ytLikeButtonViewModelHost    .yt-spec-button-shape-next__button-text-content"); if(aa && ! aa.textContent.match("01234567890123456789") ) {
																											aa.textContent = aa.textContent.replace("тыс.","k");	aa.textContent = aa.textContent.replace("Нравится","");
																											aa.textContent = aa.textContent.replace("млн","m");
																											log("mda like");										aa.parentNode.style.paddingLeft ='12px';	aa.parentNode.style.paddingRight ='7px';	}
	aa=qS(".ytDislikeButtonViewModelHost .yt-spec-button-shape-next__button-text-content"); if(aa && ! aa.textContent.match("01234567890123456789") ) {
																											aa.textContent = aa.textContent.replace("тыс.","k");
																											aa.textContent = aa.textContent.replace("млн","m");
																											log("mda dislike"); 									aa.parentNode.style.paddingLeft ='7px';		aa.parentNode.style.paddingRight ='10px';	}

	aa=qS("#above-the-fold  #flexible-item-buttons  .ytSpecButtonViewModelHost  button");	if(aa) { aa.style.paddingLeft ='11px';	aa.style.paddingRight ='8px';		} // кнопка save to playlist

	aa=qS("#notification-preference-button button.yt-spec-button-shape-next"); 	if(aa) { aa.style.paddingLeft ='12px';	aa.style.paddingRight ='6px';		} // блок с колокольчиком
	aa=qS("#subscribe-button-shape         button.yt-spec-button-shape-next"); 	if(aa) { aa.style.paddingLeft ='6px';	aa.style.paddingRight ='5px';		} // колокольчик
	aa=qS("#above-the-fold                 #owner"); 							if(aa) {								aa.style.marginRight  ='6px';		} // весь блок с лого, названием канала и колокольчиком
	aa=qS("#above-the-fold                 yt-img-shadow");						if(aa) {								aa.style.marginRight  ='6px';		} // лого канала
	aa=qS("#above-the-fold                 #upload-info");						if(aa)	{ 								aa.style.marginRight  ='6px'; 		  // блок с названием канала и подписчиками
																						 // if(bb=qS("#attributed-channel-name",aa)) bb.style.fontSize='13px';  // no more fontsize property
																						}
} // LikeDislike_n_Other_Reshape()




function onSSS(caller) {
	log("--- +++ --- on ", caller);
	qS("#movie_player").classList.remove("ytp-fullscreen-grid-active");		qS("#movie_player").classList.add("ytp-fullscreen-grid-peeking"); 	// 9-12 штук
		// FAILS: а может с самого начала в onload это сделать один раз и не париться ?!?!?!?!?*
}


function testSSS () {
document.addEventListener('readystatechange', (event) => {    	onSSS("readystatechange doc");        });
document.addEventListener('yt-navigate-finish', (event) => {    onSSS("yt-navigate-finish doc");        });
document.addEventListener('ended', (event) => {    				onSSS("ended doc");        });
document.addEventListener('PlayerStateChange', (event) => {  	onSSS("PlayerStateChange doc");        });
document.addEventListener('StateChange', (event) => {    		onSSS("StateChange doc");        });
document.addEventListener('PlayerReady', (event) => {    		onSSS("PlayerReady doc");        });
window.addEventListener('readystatechange', (event) => {    	onSSS("readystatechange win");        });
window.addEventListener('yt-navigate-finish', (event) => {    	onSSS("yt-navigate-finish win");        });
window.addEventListener('ended', (event) => {    				onSSS("ended win");        });
window.addEventListener('PlayerStateChange', (event) => {    	onSSS("PlayerStateChange win");        });
window.addEventListener('StateChange', (event) => {    			onSSS("StateChange win");        });
window.addEventListener('PlayerReady', (event) => {    			onSSS("PlayerReady win");        });



//aa=qS("video");  // WORKS но не для всех
aa=qS("#movie_player video"); // WORKS но не для всех
aa.addEventListener('play', (event) => {    				onSSS("play");         });
aa.addEventListener('playing', (event) => {    				onSSS("playing");  });
aa.addEventListener('suspend', (event) => {    				onSSS("suspend");   });
aa.addEventListener('ended', (event) => {   				onSSS("ended");        });
aa.addEventListener('PlayerStateChange', (event) => {    	onSSS("PlayerStateChange");        });
aa.addEventListener('StateChange', (event) => {    			onSSS("StateChange");        });
aa.addEventListener('PlayerReady', (event) => {    			onSSS("PlayerReady");        });
aa.addEventListener('YouTubePlayerReady', (event) => {    	onSSS("YouTubePlayerReady");        });
aa.addEventListener('YouTubeIframeAPIReady', (event) => {  	onSSS("YouTubeIframeAPIReady");        });
aa.addEventListener('YouTubePlayerAPIReady', (event) => {   onSSS("YouTubePlayerAPIReady");        });


aa=qS("#movie_player"); // FAIL
aa.addEventListener('play', (event) => {    				onSSS("1play");         });
aa.addEventListener('playing', (event) => {    				onSSS("1playing");  });
aa.addEventListener('suspend', (event) => {    				onSSS("1suspend");   });
aa.addEventListener('ended', (event) => {   				onSSS("1ended");        });
aa.addEventListener('PlayerStateChange', (event) => {    	onSSS("1PlayerStateChange");        });
aa.addEventListener('StateChange', (event) => {    			onSSS("1StateChange");        });
aa.addEventListener('PlayerReady', (event) => {    			onSSS("1PlayerReady");        });
aa.addEventListener('YouTubePlayerReady', (event) => {    	onSSS("1YouTubePlayerReady");        });
aa.addEventListener('YouTubeIframeAPIReady', (event) => {  	onSSS("1YouTubeIframeAPIReady");        });
aa.addEventListener('YouTubePlayerAPIReady', (event) => {   onSSS("1YouTubePlayerAPIReady");        });
}


function mda_showRemain_overlay () { 	var aa, bb;  // показывает качество и скорость видео и оставшееся время видео во всплывающем блоке выше ползунка !!!!!!!!!!!
	if( aa=qS(".ytp-progress-bar-container") ) {
		if( ! qS("#mda_overl") )	aa.insertAdjacentElement("beforebegin", fromHTML123(`<div id=mda_overl> --- </div>`) );
	}
	if( aa=qS("#mda_overl") ) 	{ 	aa.style.background = 'black';		aa.style.fontSize="13px";	aa.style.opacity="0.5";
									if( bb=qS(".ytp-time-display") ) 		bb.style.paddingTop='1px'; 	// чуть поднимаем вверх элементы 1/5
									if( bb=qS(".ytp-play-button") ) 		bb.style.marginTop='1px'; 	// чуть поднимаем вверх элементы 2/5
									if( bb=qS(".ytp-volume-area") ) 		bb.style.marginTop='1px'; 	// чуть поднимаем вверх элементы 3/5
									if( bb=qS(".ytp-chapter-container") ) 	bb.style.paddingTop='1px'; 	// чуть поднимаем вверх элементы 4/5
									if( bb=qS(".ytp-right-controls") ) 		bb.style.marginTop='1px'; 	// чуть поднимаем вверх элементы 5/5
	}
} // mda_showRemain_overlay()


window.addEventListener('load', function() { var aa, bb;  // onload
	console.log(`${GM.info.script.name} ===> on load event`);

 	/*aa=sessionStorage.getItem('mdaYT');
	if (aa)  	log(`found EXISTING sessStor: ${aa}`);
	else    { 	log(`set NEW sessStor`)
				sessionStorage.setItem('mdaYT', '111');
	}*/

		func1(sc, "immed");
		func2(sc, "immed");
		ttout(10, ()=>{ func2(sc, "10 ms delay"); });

		ttout(720, ()=>{ func2(sc, "720 ms delay"); });
		ttout(750, ()=>{ func2(sc, "750 ms delay"); });
		ttout(800, ()=>{ func2(sc, "800 ms delay"); });
		ttout(1000, ()=>{ func2(sc, "1000 ms delay"); });
		ttout(1200, ()=>{ func2(sc, "1200 ms delay"); });


	TrustedHTMLworkaround2();  	//TrustedHTMLworkaround();
	//document.body.style.visibility='hidden';



	const obs1 = new MutationObserver((mutations, ob) => {

		// пасти наличие tp-yt-paper-radio-button

		for (let mut of mutations) {
			if (mut.type === 'childList' && mut.attributeName != null) {						console.log('Были добавлены дочерние элементы ', 		mut.attributeName, "\n", ob);
			} else 	if (mut.type === 'attributes') {			console.log('Произошло изменение атрибутов тега', 		mut.attributeName, "\n", ob);
			} else 	if (mut.type === 'characterData') {			console.log('Текстовое содержимое элемента изменилось', mut.attributeName, "\n", ob);
					}
   		}
		//mutations.forEach(({type, attributeName}) => {
			// if( attributeName )	logerr(`mutation Тип изменения: ${type}, изменённый атрибут: ${attributeName}`);  // одни null !!!
		//});
	});

	obs1.observe(qS("ytd-app"), {  attributes: false,  childList: true,  subtree: true 	});  // ytd-offline-promo-renderer
	// obs1.disconnect();  // При необходимости отключите наблюдатель

	LikeDislike_n_Other_Reshape();
    removeSomeADs();
	removeShit(0);

	setTimeout(() => 	{	showRealRemainTime("onLOAD");			},200);
	setTimeout(() => 	{	showDateTime(2); 	removeSomeADs();	},600);

	// УБРАЛ intervSMART тут из-за глюка *GD755*
	//	 intervSMART(1000, 	"showRealRemainTime_interv111", 'set',   ()=>{ 	showRealRemainTime("onINTERV");        });  // set interval
	//	 intervSMART(60000, 	"showRealRemainTime_interv111", 'del',   ()=>{ 	showRealRemainTime("onINTERV");        });  // remove interval after 1 min

	//pageDown_onLoad();
	//click_show_more_replies();
	rightFocusOnVideosPage("on load1");


	ttout(1000,  ()=>{ // three dots появляется не сразу !!!
								log("ThreeDotsMenuClick to test only - remove later");
								if( wlh.match("youtube.*\/watch") || wlh.match("youtube.*\/shorts") )   {
									ThreeDotsMenuClick();
									Save2playlistClick();
								}
    });

	ttout(1500,  ()=>{	window.scrollTo(0, 0); 		// workaround, т.к. на некоторых страницах делается самопроизвольный scroll на экран вниз
						// pageDown_onLoad(); click_show_more_replies();
						dragSaveButton(0);	removeShit(0);	showDateTime(2);	removeSomeADs();	rightFocusOnVideosPage("on load2");	wake();   //addSaveButton();
						//chgSavePlaylist('900 px');  // obsoleted  save to playlist dialog window size
						save2playlist_cosmetic();
						mda_showRemain_overlay();
						//document.body.style.visibility='';
						// testSSS();
						qS("#movie_player video")?.addEventListener('ended', (event) => {   log("video ended");  qS("#movie_player").classList.remove("ytp-fullscreen-grid-active");		qS("#movie_player").classList.add("ytp-fullscreen-grid-peeking");
						});
    });

	ttout(3500,  ()=>{	window.scrollTo(0, 0); 		// workaround, т.к. на некоторых страницах делается самопроизвольный scroll на экран вниз
						dragSaveButton(0); 	removeShit(0);	showDateTime(3);	removeSomeADs();	rightFocusOnVideosPage("on load3");	wake();
						LikeDislike_n_Other_Reshape();
						// deleteElement("#columns #secondary"); logwarn("tmp remove secodary column with recommended videos"); // tmp workaround // remove secodary column with recommended videos
						save2playlist_cosmetic();
						mda_showRemain_overlay();

						//log('--- ', document.querySelector("meta[property='og:title']")?.content); 				// prev title RU
						//log('--- ', document.querySelector("meta[name='title']")?.content); 					// previous title
						//log('--- ', document.title);  															// actual title RU + цифры впереди
						//log('--- ', document.querySelector(".ytp-title-text .ytp-title-link").textContent);  	// actual title EN - НЕ всегда доступен
	});

	ttout(5500,  ()=>{	LikeDislike_n_Other_Reshape();
						// testSSS();
	});

}); // addEventListener('load'


window.addEventListener('mousemove', e => {
	// var cnt=0;
	tickCURR1=Date.now();
	if (!tickPROC1) {	tickPROC1=setInterval(function () {
									if ( (Date.now()-tickCURR1) > 350 ) {
										//if (dbg)
										log("mousemove: finally fire");	clearInterval(tickPROC1);	tickPROC1=null;
										showRealRemainTime();  // immediately
										for(let i=1;i<=25;i++) {		ttout(i*400, ()=>{  		showRealRemainTime(); 		});			} 	// five iterations
									}
						}, 400);
	}
}); // addEventListener('mousemove'



/* // test
var myI=setInterval(function () {	wake();  		showMsgVSC("wake test", 4000); 	 	}, 1500);  // таймаут yt плеера, по истечению которого он убирает кнопки с видео - около 3 секунд
setTimeout(function () { 	if(myI) clearInterval(myI);	showMsgVSC("wake test END", 4000);	}, 30000);
*/


/*
setInterval(() => {  // WORKS
    // Keep controls visible
    const container = document.querySelector('#movie_player')
    container.classList.remove('ytp-autohide')

	// Getting played time
    const video = document.querySelector('.video-stream')
    const hours = Math.floor(video.currentTime / 3600)
    let minutes = Math.floor(video.currentTime / 60) - (hours * 3600)
    let seconds = Math.round(video.currentTime % 60)
    if(seconds < 10){ seconds = `0${seconds}` }
    if(hours > 0 && minutes < 10){ minutes = `0${minutes}` }

    // Displaying played time
    const timeDisplay = document.querySelector('.ytp-time-current')
    timeDisplay.innerText = `${(hours > 0 ? `${hours}:` : '')}${minutes}:${seconds}`

    // Progress bar
    const percentagePlayed = video.currentTime / video.duration
    const progressBar = document.querySelector('.ytp-play-progress')
    progressBar.style = `left: 0px; transform: scaleX(${percentagePlayed})`

    // Buffered bar
    const percentageBuffered = video.buffered.end(0) / video.duration
    const bufferedBar = document.querySelector('.ytp-load-progress')
    bufferedBar.style = `left: 0px; transform: scaleX(${percentageBuffered})`
}, 1000);
*/


//return;

})(); // END


// try !!!

/* youTube.search(Query, 5, function(error, result) {
  if (error) {
    console.log(error);
  } else {
    var snippet = result.items[0].snippet;
    let post = new videosNews ({
      title: snippet.title,
      url: snippet.url,
      description: snippet.description,
      publishedAt: snippet.publishedAt  // <<< <<< <<<
    })
    console.log(post)
    post.save(function(err, data) {
      if(err){console.log('rong')}
      else {console.log('save')}
    })
  }
})
 */
