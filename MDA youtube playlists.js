// ==UserScript==
// @name         MDA youtube playlists
// @namespace    http://tampermonkey.net/
// @version      2026.5.15.b
// @description  started 2024-11-26
// @author       mr-d-r
// @license      MIT
// @match        http*://*.youtube.com/*
// @include      http*://*.youtube.com/*
// @exclude      http*://accounts.youtube.com/*
// @exclude      http*://www.google.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @require      https://update.greasyfork.org/scripts/524553/1821889/MDA%20library.js
// @require      https://update.greasyfork.org/scripts/577495/1821180/Date%20Format%20123.js
// @require      https://update.greasyfork.org/scripts/577494/1821178/MDA%20youtube%20common.js
// ==/UserScript==



// !!! супер полезно Improved youtube - bnomihfieiccainjcjblhegjgglakjdd\4.1350_0\js&css\web-accessible\www.youtube.com\playlist-complete-playlist.js
// 	можно пользоваться всеми функциями напрямую - ImprovedTube.playlistAttachQuickButtons()
// 	getPlaylistId, playlist_id    ytd-playlist   YouTube's edit_playlist API





// не работает без MDA youtube SaveButt Datetime Jumps ADs DEVEL !!!

// упорядочивать код !!!!!!!!!

// когда save диалог document.querySelector("tp-yt-iron-dropdown yt-list-view-model.ytListViewModelHost[role='list']")
// 						открыт, то он tp-yt-iron-dropdown focused
// 						закрыт, то aria-hidden=true

// ставить флажок автонажатия save в виде тега в html c таймстемпом и названием скрипта, который выставил этот флажок

// сделать отдельную версию через MUTATION !!!!!!!!!!!!!!! если не получится, то при клике запоминать текущее состояние, а потом ловить его изменение и стопить процесс
// 		см. Youtube Save to... playlist incremental search.user.js !!!!!!!!!!!






// кнопка Save на нормальном месте !!! - https://www.youtube.com/watch?v=QxeyEiQXRK0   https://www.youtube.com/watch?v=12PIeXmSfsA



// как-то выковырять локализованное название кнопки save2playlist

// MORE_VERT <==> ccessibilityText: "Ещё"   <==>  button[aria-label="Ещё"]

// ytInitialData -> ... MenuButton   playlistEditEndpoint -> {"listItemViewModel":{"title":{"content":"Добавить в плейлист"}
// "PAadd_to_playlist"







// ДООТЛАЖИВАТЬ на https://www.youtube.com/watch?v=_65uFu5Twlg !!! - кнопка Save стандартная   см.также https://www.youtube.com/watch?v=7dcw1bi0YMc&t=3s
//	  срабатывает через раз и НЕ подсвечивает жирным !!!


// добавлять кнокни плейлистов И сразу под видео И справа от datetime !!! !!! !!!
// 		или оставить место справа от datetime только для моих сообщений


// строчка плейлистов _выше_ названия ролика - выглядит норм
//   таблица при масштабировании не переносится на другие строчки пробовать делать таблицу из div-ов
/* var qqqqqqq=`<div class="divTable">
<div class="divTableBody">
<div class="divTableRow">
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
</div>
<div class="divTableRow">
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
<div class="divTableCell">&nbsp;</div>
</div>
</div>
</div>
<!-- DivTable.com -->`

var asasasasas=`
.divTable{
	display: table;
	width: 100%;
}
.divTableRow {
	display: table-row;
}
.divTableHeading {
	background-color: #EEE;
	display: table-header-group;
}
.divTableCell, .divTableHead {
	border: 1px solid #999999;
	display: table-cell;
	padding: 3px 10px;
}
.divTableHeading {
	background-color: #EEE;
	display: table-header-group;
	font-weight: bold;
}
.divTableFoot {
	background-color: #EEE;
	display: table-footer-group;
	font-weight: bold;
}
.divTableBody {
	display: table-row-group;
}
`
*/

// пробовать  перед кликом в save to playlist делать окно невидимым или временно УМЕШЬШАТЬ ЕГО РАЗМЕР ДО 0  !! чтобы не моргало !!!

// решить, как обновлять жирные, если внес в сохраненные через стандартное меню
// 		вешать onclick на стандартную кнопку сохранения !

// максимизировать стандартное окно со списком сохраненных плейлистов - закончить - донастроить прокрутку
//	- <tp-yt-paper-dialog style-target="host" role="dialog" tabindex="-1" class="style-scope ytd-popup-container" prevent-autonav="true" style="outline: none; height: 800px; z-index: 2202; position: fixed; top: 0.0041629px; left: 201.479px; box-sizing: border-box; max-height: 774.004px; max-width: 659px;" modern=""><!--css-build:shady--><!--
// 	- сначала смотреть сколько высота окна в пикселях !!!
// #playlists.ytd-add-to-playlist-renderer>*.ytd-add-to-playlist-renderer:not(:last-child) {    margin-bottom: -4px;  <<<
// ytd-add-to-playlist-renderer[dialog] #playlists.ytd-add-to-playlist-renderer {     max-height: 557px;  <<<
// try min-height: 100%

// еще функцию, которая вытаскивает все плейлисты в массив !!

// округлые окантовки https://ru.stackoverflow.com/questions/120246/%D0%9A%D0%B0%D0%BA-%D1%81%D0%BA%D1%80%D1%83%D0%B3%D0%BB%D0%B8%D1%82%D1%8C-%D0%BA%D1%80%D0%B0%D1%8F-%D1%83-%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%86%D1%8B-border-radius

// - хранить мои ключи в файле D:\Work\gdrive_obs\myJavascript\youtube.pers.js
// - потом генерировать OAuth2 токен с минимальными правами - чтение playlists и добавление в playlist, чтобы в случае утечки никто ничего не похерил

// разместить кнопки плейлистов в строчке даты 22.09.2025, 09:39 под названием видео
// 	делать не стандартные синие ссылки на сохранёнки, а пытаться назначить стандартные ютюбовские yt-button - подбирать


/*
fetch(url, options)
  .then(response => response.json())
  .then(result => // обрабатываем результат )
*/

var scrpt="MDA playlists";
(function() {
    'use strict';
	// start of the script - MUST BE AT THE VERY BEGIN - right below 'use strict'; !!!   иначе у гугла выполняется 3 раза несмотря на if( wlh.match(/accounts.google.com/) ) 	{  return; } !!!
	var dbg=0, wlh=WLH();
	var scrpt="MDA playlists";
	var t_id="mdaAJRTE", isSaveButtonClicked=false, SaveButtonMUTEX=false, userKeyS_press=false;

//	console.log("\n", "\n", `${GM.info.script.name}: start -> ${wlh}  debug=${(typeof dbg == "undefined") ? "absent" : dbg}  MDAlib=${(typeof MDAlib == "undefined") ? "absent" : MDAlib}` );
	console.log("\n", "\n", `${GM.info.script.name}` );
	if (window.location.href.match("accounts.youtube"))  {  console.log("accounts.youtube is detected, exiting this instance...");      return null;  }
		// else console.log("normal youtube is detected");

	//if(dbg) log("--> 1");		try1();
	// //if(dbg) log("--> 2");		try2();
	//if(dbg) log("--> 3");		tryOAUTH();
	// //if(dbg) log("--> -end-");





	var sc="YTinterop222:";




	// ONLY ONCE!!!!:  A top-level observer that waits for <ytd-popup-container> to show up, then calls handlePopupContainer() exactly once.
  	const documentObserver11 = new MutationObserver(function (mutations, me) {
		if(SaveButtonMUTEX) 	return;
		const popupContainer = query(document, 'tp-yt-iron-dropdown'); // pre-2025: 'tp-yt-paper-dialog')[0];
		if (popupContainer) {
			SaveButtonMUTEX=true;
			ttout(2000, () =>{ SaveButtonMUTEX=false; });					// все равно срабатывает слишком часто !!!
				/* пробовать для сокращения срабатываний рецепт *s123646 НИЖЕ
		  		*/
			console.log("2make later only once:  Found ytd-popup-container via MUTEX");
			mkCheckedBold("mutation");
			me.disconnect(); // stop once found
		}
		});

		function query(startNode, selector) {
		try {
				return Array.prototype.slice.call(startNode.querySelectorAll(selector));
		} catch (e) {
				return [];
		}
	}
	documentObserver11.observe(document, { childList: true, subtree: true });


/* 		// задействовать и этот *s123646 !!!
		// 	и там есть еще !!!
  // When the dialog closes, re-attach the observer so we see the next open event.
  function observePaperDialogClose(paperDialog, onCloseDialog) {
    let ob = new MutationObserver((mutations, me) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          me.disconnect();
          onCloseDialog();
        }
      });
    });
    ob.observe(paperDialog, { attributes: true });
  }
*/




function closeChaptersInFullscreen () { var aa
	// In this video | В этом видео  - это от 'Improve YouTube!' 🎧 (for YouTube & Videos) !!!
	if( aa=qS("#panels-full-bleed-container [target-id='engagement-panel-macro-markers-description-chapters'] #visibility-button  button") ) {
		aa.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.visibility='hidden';
		aa.click();
		logdbg("closeChaptersInFullscreen: closed1");
	}
	deleteElement("#panels-full-bleed-container"); // workaround 2
	if( aa=qS("#header #title-container [aria-label='Key moments'],   #header #title-container [aria-label='Ключевые моменты']") ) {
		aa?.parentNode?.parentNode?.querySelector("#visibility-button button")?.click();
		logdbg("closeChaptersInFullscreen: closed2");
	}
} // closeChaptersInFullscreen()


window.matchMedia('(display-mode: fullscreen)').addListener(({ matches }) => {  var aa;
    if (matches) {
        log("fullscreen !!!  ", document.fullscreenElement=true); // Apply fullscreenmode mode related changes
		closeChaptersInFullscreen();
		ttout(100,  ()=>{ closeChaptersInFullscreen() });
		ttout(300,  ()=>{ closeChaptersInFullscreen() });
		ttout(1000, ()=>{ closeChaptersInFullscreen() });
		ttout(2000, ()=>{ closeChaptersInFullscreen() });
    } else {
        log("fullscreen exit  ", document.fullscreenElement=true); // Remove fullscreenmode mode related changes
		if( aa=qS("#panels-full-bleed-container [target-id='engagement-panel-macro-markers-description-chapters'] #visibility-button  button") ) {	aa.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.visibility='';	}
		if( aa=qS("#secondary                   [target-id='engagement-panel-macro-markers-description-chapters'] #visibility-button  button") ) {	aa.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.visibility='';	}
    }
});





async function try1 () {  var fn='try1'
	const channel = "UC6xr8g8bl6Muw5OdHebEpMw"   					// 'UCr1QVPhsNT9cMI8FXAbzlig' // 'UChOIeBWpgfnSYN9nk1Ns0Bw';
	const API_KEY = "AIzaSyCqWLx-j3Woi1x9JqJ-xkDUALyDWu--rhI"    	// левый из интернета 'AIzaSyAbbXpzVK4jD_ILNRZLBhD89BSn3vu726k';
	//const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel}&maxResults=100&order=date&type=video&key=${API_KEY}`;   // WORKS
	// var url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channel}&maxResults=100&order=date&type=video&key=${API_KEY}`; // WORKS
	var url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channel}&maxResults=100&order=date&type=video&key=${API_KEY}`;
	(async()=> {	const res = await fetch(url);					const data = await res.json();
					log(fn,"playlists data", data);				log(fn, "data pageInfo: ", data.pageInfo);			log(fn, "data items[0]: ", data.items[0]);

					data.items.forEach( (it,idx,arr)=>{
					log(fn,"playlist:", it.id, " - ", it.snippet.localized.title);   // it.snippet.localized.title
		});
	})();
	log(fn, "() END");
} // try1()


async function try2 () {  var fn='try2'
	const channel = "UC6xr8g8bl6Muw5OdHebEpMw"   					// 'UCr1QVPhsNT9cMI8FXAbzlig' // 'UChOIeBWpgfnSYN9nk1Ns0Bw';
	const API_KEY = "AIzaSyCqWLx-j3Woi1x9JqJ-xkDUALyDWu--rhI"    	// левый из интернета 'AIzaSyAbbXpzVK4jD_ILNRZLBhD89BSn3vu726k';
	var playlistId = 'PLtuD-NjJNBJzOAvsrlHfKBOGtEvPcGAM3' // 'PL_oXsSI8g_a-E4g_PmS5s5fRceVhUAPrW' //'PLVqpOPG2Lex-CL8kKFxsGSGiPZZbfiNsR' //'PL2Nc0vlZLqfnqPjZ_jc8r6iumGqTi8Zlu';    //'PL2Nc0vlZLqfnqDjRqKDewG3llbfO9MmpE'; // OK
	// var url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet&channelId=${channel}&maxResults=200&order=date&type=video&key=${API_KEY}`; // WORKS
	var url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet&maxResults=200&order=date&type=video&key=${API_KEY}`;
	(async()=> {
		const res = await fetch(url);
		const data = await res.json();
		log(fn, "playlists data", data);	// WORKS
		log(fn, "data pageInfo: ", data.pageInfo);
		log(fn, "data items[0]: ", data.items[0]);
		data.items.forEach( (it,idx,arr)=>{
			log(fn,"-- idx:",idx, " - ", it.snippet.resourceId.videoId, " - ", it.snippet.title);   // it.snippet.resourceId.videoId, " - ", it.title);
		});
	})();
	log(fn, "() END");
} // try2()


async function tryOAUTH () {  var fn='tryOAUTH';
	const channel = "UC6xr8g8bl6Muw5OdHebEpMw"   					// вроде мой mdasysadm
	const API_KEY = "AIzaSyCqWLx-j3Woi1x9JqJ-xkDUALyDWu--rhI"    	// mda api key
	var playlistId = 'PLtuD-NjJNBJzOJrUxDBW5NngXpIbNwpWj'; 			// publicTEST playlist

	var OAUTH2_CLIENT_ID = '17933679225-shdikvhk0de8goa52up3jd49qgsp6s8u.apps.googleusercontent.com';  // my real clientid
	var OAUTH2_SCOPES = [  'https://www.googleapis.com/auth/youtube'	];

	// заполнить аккуратно поля тут https://developers.google.com/youtube/v3/docs/playlists/list#properties

	// https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps
	// 		https://www.googleapis.com/auth/youtube.force-ssl
	// 		JavaScript sample code
	//			function oauthSignIn()


} // try2()


function crTable () { var pEl, htm, a, b, t, anch;
	var st=`cursor: pointer;  color: navy;  text-align: center;
			border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; -khtml-border-radius: 10px; border: 1px solid #000; padding-left: 2px; padding-right: 5px;  `; // display: block;
	if( typeof MDAytlib == "undefined" )  {  log("1122947652 no youtube lib included - exiting");  return;  }

	pEl=qS("#above-the-fold > #title");
	if (!pEl) { 	if(dbg) log("2745632 parent #above-the-fold > #title  is NOT FOUND", pEl);		return; 		}

//	 a=qS("#mdaDateTimeSavelist_tbl");
	a=qS("#mdaSavelist_tbl");
//	if (!a) { 	b=pEl.appendChild( fromHTML123(mdaSavelistTBL) );				log("2745632 NEW TABLE --- ", b); 	}
	if (!a) { 	b=pEl.insertAdjacentHTML('afterbegin', mdaSavelistTBL); 	};  //logwarn("2745632 NEW TABLE --- ", b); 	}

	if( t=qS(`#${t_id}_dummy12133`) )  {  log("--- already created", t);  return;  }

//	if( anch=qS("#mdaDateTime_row1") ) {
	if( anch=qS("#mdaDateTime_row") ) {
		a=qS(`#${t_id}_dummy12133`);  // doublecheck
		htm = `	<td style="${st}" id="${t_id}_беларусь"	  title="Беларусь"> 			&nbsp;BY			</td>
				<td style="${st}" id="${t_id}_польша" 	  title="Польша"> 				&nbsp;PL			</td>
				<td style="${st}" id="${t_id}_украина"	  title="Украина"> 				&nbsp;UA 			</td>
				<td style="${st}" id="${t_id}_англ." 	  title="Английский"> 			&nbsp;EN 			</td>

				<td style="${st}" id="${t_id}_политика"	  title="Политика"> 			&nbsp;политика 		</td>
				<td style="${st}" id="${t_id}_история"	  title="История"> 				&nbsp;история 		</td>
				<td style="${st}" id="${t_id}_старое - ностальгия" title="Ностальгия"> 	&nbsp;ностальгия 	</td>
				<td style="${st}" id="${t_id}_юмор"		  title="Юмор">   				&nbsp;&nbsp;&#x1F602;&nbsp; 	</td>
				<td style="${st}" id="${t_id}_интересное" title="Интересное"> 			&nbsp;цікава 		</td>
				<td style="${st}" id="${t_id}_travel" 	  title="Путешествия"> 			&nbsp;&#x2708;&nbsp;&#x1F334;		</td>
				<td style="${st}" id="${t_id}_котики" 	  title="Котики"> 				&nbsp;&#x1F639;&#x1F408;		</td>
				<td style="${st}" id="${t_id}_кулинария"  title="Кулинария"> 			&nbsp;&#x1F37D;&nbsp;cook&nbsp;&#x1F355;		</td>

				<td style="${st}" id="${t_id}_films" 	  title="Фильмы"> 				&nbsp;&nbsp;&#x1F39E;&nbsp;		</td>
				<td style="${st}" id="${t_id}_музыка" 	  title="Музыка"> 				&nbsp;&nbsp;&#x1F39D;&nbsp;		</td>
				<td style="${st}" id="${t_id}_аудиокниги" title="Аудиокниги"> 			&nbsp;&#x1F509;&nbsp;&#x1F56E;	</td>
				<td style="${st}" id="${t_id}_lifehacks"  title="Лайфхаки">				&nbsp;&#x1F6E0;&nbsp;&#x2699;		</td>
				<td style="${st}" id="${t_id}_здоровье"   title="Здоровье"> 			&nbsp;&#x2695;&nbsp;&#x1F48A;		</td>

				<td 			  id="${t_id}_dummy12133"></td>
				`

		if( !a ) {  anch.insertAdjacentHTML('beforeend', htm);						log('---crTable() new: ', qS(`#${t_id}_11`) );
					qS(`#${t_id}_беларусь`)?.addEventListener("click", onclick110);	function onclick110() {  	save2playlist('беларусь');  	}
					qS(`#${t_id}_украина`)?.addEventListener("click", onclick111);	function onclick111() {  	save2playlist('украина');  	}
						// go to playlist on dblclick !!! // https://www.youtube.com/watch?v=&list=PLtuD-NjJNBJyA3WcjDd8zxL6dXwcGRTkQ - пока нигде в html не нашел
					qS(`#${t_id}_украина`)?.addEventListener("dblclick", onDBLclick111);	function onDBLclick111() { // make direct jump to playlist:  https://www.youtube.com/playlist?list=PLtuD-NjJNBJzOJrUxDBW5NngXpIbNwpWj
																			alert('double click on украина');  	}
					qS(`#${t_id}_политика`)?.addEventListener(	"click", onclick112);	function onclick112() {  	save2playlist('политика');  	}
					qS(`#${t_id}_интересное`)?.addEventListener("click", onclick113);	function onclick113() {  	save2playlist('интересное');  	}
					qS(`#${t_id}_котики`)?.addEventListener(	"click", onclick114);	function onclick114() {  	save2playlist('котики');  	}
		}
	}

	if( anch=qS("#mdaDateTime_row") ) {  // #mdaDateTime_row2
		//htm = `	<td style="${st}" id="${t_id}_англ"> 			&nbsp;англ 				</td>
		//		<td style="${st}" id="${t_id}_история"> 		&nbsp;история 			</td>
		//		<td style="${st}" id="${t_id}_аудиокниги"> 	&nbsp;аудиокниги		</td>`
		//anch.insertAdjacentHTML('beforeend', htm);		log('---crTable() new: ', qS(`#${t_id}_21`) );
	// CSS.escape() !!!
		qS(`#${t_id}_${CSS.escape("англ.")}`)?.addEventListener("click", onclick211);function onclick211() {  	save2playlist('англ.');  		} // css.escape надо, т.к. "англ." содержит точку
		qS(`#${t_id}_история`)?.addEventListener(			"click", onclick212);	function onclick212() {  	save2playlist('история');  	}
		qS(`#${t_id}_аудиокниги`)?.addEventListener(		"click", onclick213);	function onclick213() {  	save2playlist('аудиокниги');  	}
		qS(`#${t_id}_films`)?.addEventListener(				"click", onclick214);	function onclick214() {  	save2playlist('films');  	}
		qS(`#${t_id}_музыка`)?.addEventListener(			"click", onclick241);	function onclick241() {  	save2playlist('музыка');  	}
		qS(`#${t_id}_здоровье`)?.addEventListener(			"click", onclick217);	function onclick217() {  	save2playlist('здоровье');  	}
		qS(`#${t_id}_юмор`)?.addEventListener(				"click", onclick215);	function onclick215() {  	save2playlist('юмор');  	}

		qS(`#${t_id}_lifehacks`)?.addEventListener(			"click", onclick231);	function onclick231() {  	save2playlist('lifehacks');  	}
		qS(`#${t_id}_кулинария`)?.addEventListener(			"click", onclick232);	function onclick232() {  	save2playlist('кулинария');  	}
		qS(`#${t_id}_польша`)?.addEventListener(			"click", onclick233);	function onclick233() {  	save2playlist('польша');  	}

		qS(`#${t_id}_${CSS.escape("старое - ностальгия")}`)?.addEventListener("click", onclick216);	function onclick216() {  	save2playlist('старое - ностальгия');  	}
	}
} // crTable()



function mkCheckedBold (caller) {  var pEl, a, b, t, anch, ab, accum='',  fn="mkCheckedBold():";
	if( ! wlh.match("youtube.*\/watch") )   {  loginfo(`${fn} URL is not /watch/ - exiting...`); 	return; }

	if( !userKeyS_press )	hide_Save2playlistDialog(true);	// hide...
	clickSaveButton();    			// ... then click


ttout(700,  ()=>{ // EXPERIMENTAL ttout !!!!!!!!!!!!!!
	logwarn(`${fn} 48fg45: ${caller} `);
	// a=qS("#mdaDateTimeSavelist_tbl");
	a=qS("#mdaSavelist_tbl");

	save2playlistResize();  // костыль, надо потом разобраться, почему НЕ работает при инициализации и убрать отсюда !!!

	if (!a) { 	log("23434632 mkCheckedBold()  no table", b); 	return; 	}
	ab=qSA("tp-yt-iron-dropdown  .ytContextualSheetLayoutContentContainer .ytListViewModelHost[role='list'] .ytListItemViewModelHost");
	//logwarn(`chkbold: found: ${ab.length} >>> ${ab}`);

	// НАДО сначала открыть-закрыть save, а потом проверять !!!

	// делать флажок, чтобы функция отрабатывала полностью !!!

	qSA(`[id^=${t_id}_]`)?.forEach(el=>{   a=el.id.replace(`${t_id}_`,'');	// log("el23423: ", a);  // для всех моих ярлыков
		ab?.forEach(it=>{	//log(">>", it.getAttribute("aria-label") );
							let rege = new RegExp(`^${a},`, 'gi');      		// от начала строки до запятой !!!
							if( it.getAttribute("aria-label").match(rege) ) {	// было it.getAttribute("aria-label").match(а) но это кривова-то
								b=it?.getAttribute("aria-pressed"); 	//logwarn(`chkbold: ${a} ${b}`);
								if( b=='true' ) {	intervSMART(0, 'plum1', 'del', null );	intervSMART(0, 'plum2', 'del', null );
													el.style.fontWeight="bold",  	el.style.fontColor="red", accum=accum +" " +a, 	el.style.backgroundColor='cyan';   // 2 debug more
												}
								else 			{	intervSMART(0, 'plum1', 'del', null );	intervSMART(0, 'plum2', 'del', null );
													el.style.fontWeight="normal",  	el.style.fontColor="blue", 						el.style.backgroundColor='white';  // try gray background !!!!
												}
					// может стоит добавлять '>' к названию плейлиста ?!?!
							}
		});
	});
	//if(accum) showmsg_mdaDateTime_inf1(`found in ${accum}`, 3000);
	ttout(500, ()=> {  closeSaveButton();  		hide_Save2playlistDialog(false);  });
}); // ttout(700,  ()=>{

	/* pre-2025 way:
	qSA(`[id^=${t_id}_]`)?.forEach(el=>{   a=el.id.replace(`${t_id}_`,'');	// log("el: ", a);
		b=qS("ytd-add-to-playlist-renderer")?.querySelector(`#checkbox-label.ytd-playlist-add-to-option-renderer > #label[title='${a}']`)?.parentNode?.parentNode?.parentNode?.parentNode?.ariaChecked;
		//log("checked: ", b);
		if( b=='true' ) 	el.style.fontWeight="bold";
		else 				el.style.fontWeight="normal";
	});
	*/
} // mkCheckedBold()


function clickSaveButton () {  var aa, bb;

	// ждать пока сделается drag ?

	if(userKeyS_press) 	return;

	if( aa=qS("#mdaSave") ) {  // нашли кнопку там, куда я ее перетащил
		///////////////if(ytSavePlaylistButtonAlreadyPressed) { logdbg(`clickSaveButton():  SavePlaylistButtonAlreadyPressed=true` );  return; }
		// hide_Save2playlistDialog(true);
		aa?.click(); 	log("savebutton clicked");

		isSaveButtonClicked=true;
		// после клика ждать пока не появится в DOM
		// зарядить несколько ttout c проверкой, что появилась в DOM

		//ttout(3000, ()=>{  	// hide_Save2playlistDialog(false);
		//					ttout(1000, ()=> { save2playlistResize(); });
		//});  // make savelist visible again
	}
} // clickSaveButton()



function closeSaveButton () {  var aa;
	if(userKeyS_press) 	return;
	// ДООТЛАЖИВАТЬ !!!
		//log("closeSaveButton() obsoleted. return");
	//return;
		//clickSaveButton(); // to close
		cl1212();
		isSaveButtonClicked=false;
		ttout(500,  ()=>{	cl1212(); 	log("savebutton closed 1");	});
		ttout(1000,  ()=>{	cl1212();; 	log("savebutton closed 2");	});
	function cl1212 () {   document.querySelector("#mdaSave")?.dispatchEvent( new KeyboardEvent("keydown", { key: "Escape" }) );		}
} // closeSaveButton()


function save2playlist (plname) { var aa, ab, bb,  tto=300;
	log(`save2playlist(${plname}) started`);
	if( !plname )  return;
	//if( !isSaveButtonClicked)  {  clickSaveButton();	tto=1500; 	}   // устарело, т.к. современная реализация на youtube ТРЕБУЕТ всегда кликать save button
	hide_Save2playlistDialog(true);

	ttout(tto, ()=> { var aa, ab, ccc;
			// ab=qS("ytd-add-to-playlist-renderer")?.querySelectorAll("#checkbox-label.ytd-playlist-add-to-option-renderer > #label");  // pre-2025 way
			ab=qSA("tp-yt-iron-dropdown  .ytContextualSheetLayoutContentContainer .ytListViewModelHost[role='list'] .ytListItemViewModelHost");
			log("dropdown found: ", ab ? "ok" : null);
			ab?.forEach(el=>{
				if( el.getAttribute("aria-label").match(plname) ) { 	log(`--1 ${plname} found`, "\nchcked: ", el.getAttribute("aria-pressed") );
						// fails to set custom attribute el.setAttribute("mda_plName", plname);
						el.click();
						ccc=CSS.escape(`mdaAJRTE_${plname}`);
						if( aa=qS(`#mdaSavelist_tbl #${ccc}`) ) {  	aa.style.backgroundColor="plum"; // tmp paint in some tmp color to show the button clicked
																	intervSMART(600,  'plum1', 'set', ()=>{  aa.style.backgroundColor="white";	});
																	intervSMART(1200, 'plum2', 'set', ()=>{  aa.style.backgroundColor="plum";	});
																}
						ttout(2000,  ()=>{  mkCheckedBold("save2playlist(): try1 2sec");  });
						ttout(4000,  ()=>{  mkCheckedBold("save2playlist(): try2 4sec");  });
						ttout(7000,  ()=>{  mkCheckedBold("save2playlist(): try3 7sec");  });
						//}
				}  //else { 		log(`--1else ${plname} found`, "\nchcked: ", el.parentNode.parentNode.parentNode.parentNode.ariaChecked);  }
			});


			// new way:
			ab=qS("tp-yt-iron-dropdown  .ytContextualSheetLayoutContentContainer")?.querySelectorAll(`[aria-label^='${plname},']`);
			log("--2 ab new way plname found? ", ab ? "ok" : null);
			// document.querySelector("tp-yt-iron-dropdown .ytContextualSheetLayoutContentContainer  [aria-label^='films,']")?.getAttribute("aria-pressed")
			// НО эта гребаная блядота не обновляет флаг сразу при нажатии на пункт, т.е. надо переоткрывать меню save to playlist повторно !!!

			//closeSaveButton();
			//hide_Save2playlistDialog(false);
	});
} // save2playlist()



document.addEventListener("keydown", (e) => {
		var j, set=false, aa, bb, za, np="";
		if( anyActiveInput() ) 	return; 					//if ((aaBB = document.activeElement) && (editable(a) || (a.tagName === "INPUT") || (a.tagName === "TEXTAREA"))) return;

		switch (e.code) {
	        case "KeyS":
				if (event.shiftKey  ||  event.ctrlKey  ||  event.altKey  ||  event.metaKey)  break;
				userKeyS_press=true;
				ttout(2000, ()=>{  userKeyS_press=false;  });
				// no need  e.preventDefault();
	            break;

			case "KeyD":
				// no need to run mkCheckedBold() for  case "KeyV":    case "ArrowLeft":       case "ArrowRight":
				if (event.shiftKey  ||  event.ctrlKey  ||  event.altKey  ||  event.metaKey)  break;
				mkCheckedBold(`keydown ${e.code} :37fh4742s:`);
				// no need  e.preventDefault();
	            break;

   		}
}); // addEventListener("keydown"...



	window.addEventListener('load', function() { var aa;
		console.log(`${GM.info.script.name} ===> on load event`);
		TrustedHTMLworkaround2();  	//TrustedHTMLworkaround();

		//func1(sc, "immed");
		//func2(sc, "immed");
		//ttout(10, ()=>{ 	func2(sc, "10 ms delay"); 	});
		//ttout(700, ()=>{ 	func3(sc, "700 ms delay UPD"); 	});

	//ttout(1000,  ()=>{
								if( wlh.match("youtube.*\/watch") || wlh.match("youtube.*\/shorts") )   {
									//log("ThreeDotsMenuClick to test only - remove later");
									//ThreeDotsMenuClick();
									//Save2playlistClick();  // глюк - пропадает полоса с названием-лайками-дизлайками
								}
    //});

		ttout(2000, ()=> { save2playlistResize(); 			});
		ttout(7000, ()=> { save2playlistResize();			});


		ttout(1500, ()=> { 	crTable(); 	if( !isSaveButtonClicked) { clickSaveButton();	ttout(1500, ()=> { 		closeSaveButton(); 	mkCheckedBold("onLoad 1"); 	});  	}
		});
		ttout(3000, ()=> { 	crTable(); 	if( !isSaveButtonClicked) { clickSaveButton();	ttout(1500, ()=> { 		closeSaveButton(); 	mkCheckedBold("onLoad 2"); 	}); 	}
							if( wlh.match("youtube.*\/watch") || wlh.match("youtube.*\/shorts") )   {
								ThreeDotsMenuClick();			ThreeDotsMenuClose();		log("ThreeDotsMenuClick delayed 3 sec - 2 test only")
							}
							if( aa=qS("#primary #below ytd-watch-metadata") ) 	aa.style.marginTop='4px'; // уменьшаем верт.белое поле между плеером и моей таблицей плейлистов 1/2
							if( aa=qS("#primary #below #clarify-box") )  		aa.style.marginTop='4px'; // уменьшаем верт.белое поле между плеером и моей таблицей плейлистов 2/2
		});

		ttout(7000, ()=>  { 		mkCheckedBold("onLoad 3"); 	});
		ttout(10000, ()=> { 		mkCheckedBold("onLoad 4"); 	});
	}); // addEventListener('load'


document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {        mkCheckedBold("aasdqqwwe11753 onVisibilitychange"); 	crTable();
    } //else {									        console.log("tab is inactive");    }
});


})(); // END


/*
(async () => {
  const url = "https://example.org/products.json";
  log("try1");
  try {
	log("try2");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`try2 Response status: ${response.status}`);
    }

    const result = await response.json();
	log("try3");
    console.log("try3", result);
  }
  catch (error) {
    console.error("try3", error.message);
  }
})()
*/
