// ==UserScript==
// @name         MDA youtube common
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  my JS YT library GITHUB
// @author       mr-d-r
// ==/UserScript==

// @r equire  file://D:\...\_MDAlib_tampermonkey.js ВСЕГДА добавляет в самое начало скрипта, где он использован
// т.о. переменные объявленные здесь всегда глобальные !!!
var MDAytlib="included";  // real global vars !!!  // dbg - отладка    // verb - немного расширенные сообщения
var scrpt="inited"; // scriptname to define in scripts

var ThreeDotsMenuButton="#actions-inner .dropdown-trigger", ThreeDotsMenuContent="ytd-popup-container tp-yt-iron-dropdown ytd-menu-popup-renderer";
document.ThreeDotsMenuClickStillWorking=false; 	// document var to prevent clicking threedots menu button multiple times simultaneously
document.ThreeDotsMenuClickOWNER='n/a'; 		// script name which clicked threedots menu button

var Save2playlistMenuButton="#mdaSave", 					Save2playlistMenuContent="[aria-label='Save video to...']";
document.Save2playlistClickDONE=false; 			// document var to prevent clicking save2playlist button multiple times simultaneously
document.Save2playlistClickStillWorking-'n/a'; 	// script name which clicked save2playlist button

var isMenuClicked=false; // remove later
var replAA="+";  // my title for save to playlists button


// tmp workaround   // выскакивающее окно - Чтобы скачать это видео, подпишитесь на Premium
	// Кроме того, вы сможете смотреть любимые ролики без рекламы, в фоновом режиме и офлайн.  Высокое – 720 пикс. Стандартное – 480 пкс
/*
ttout(1000, ()=> { 	log("closing offline-promo-renderer шт MDAytlib");
					qS("ytd-offline-promo-renderer yt-button-renderer[id='dismiss-button'] button")?.click();
					qS("ytd-offline-promo-renderer")?.remove();		});
ttout(2000, ()=> { 	qS("ytd-offline-promo-renderer yt-button-renderer[id='dismiss-button'] button")?.click();
					qS("ytd-offline-promo-renderer")?.remove();		});
ttout(3000, ()=> { 	qS("ytd-offline-promo-renderer yt-button-renderer[id='dismiss-button'] button")?.click();
					qS("ytd-offline-promo-renderer")?.remove();		});
ttout(4000, ()=> { 	qS("ytd-offline-promo-renderer yt-button-renderer[id='dismiss-button'] button")?.click();
					qS("ytd-offline-promo-renderer")?.remove();		});
ttout(5000, ()=> { 	qS("ytd-offline-promo-renderer yt-button-renderer[id='dismiss-button'] button")?.click();
					qS("ytd-offline-promo-renderer")?.remove();		});
ttout(6000, ()=> { 	qS("ytd-offline-promo-renderer yt-button-renderer[id='dismiss-button'] button")?.click();
					qS("ytd-offline-promo-renderer")?.remove();		});
*/
					


var ytSavePlaylistButtonAlreadyPressed=false;

        if ( (typeof doc == "undefined")  ||  (typeof doc == undefined) ) 	doc=document;
        if ( (typeof epoc == "undefined") ||  (typeof epoc == undefined) ) 	epoc=0;

	function func1 (scr, caller) { 	var aa,  eC,  startMs, fn='func1set:';
		epoc=Math.round( window.performance.now()*100 )/100; // Date.now(); // global
		eC=Math.round( window.performance.now()*100 )/100; // Date.now();
		startMs=new Date().format("MM:ss..l");

		doc.var1=`var111 ${startMs}`;
		log(`${scr} ${fn}  ${startMs}(+${eC-epoc}):  ${caller}: ${doc.var1}`);
	}

	function func2 (scr, caller) { 	var aa,  eC,  startMs, fn='func2read:';
		eC=Math.round( window.performance.now()*100 )/100; // Date.now();
		startMs=new Date().format("MM:ss..l");

		log(`${scr} ${fn}  ${startMs}(+${eC-epoc}):  ${caller}: ${doc.var1}`);
	}

	function func3 (scr, caller) { 	var aa,  eC,  startMs, fn='func3upd:';
		eC=Math.round( window.performance.now()*100 )/100; // Date.now();
		startMs=new Date().format("MM:ss..l");

		doc.var1=`var111 UPD ${startMs}`;
		log(`${scr} ${fn}  ${startMs}(+${eC-epoc}):  ${caller}: ${doc.var1}`);
	}



const mdaDateTimeSavelistTBL=`<table id="mdaDateTimeSavelist_tbl" style="font-size: 10px;">	<tbody>
					<tr id=mdaDateTime_row1>
						<td id=mdaDateTime_td111>	  <h3 id=mda_datetime> </h3>	</td>
						<td id=mdaDateTime_inf1> 									</td>
					</tr>
	<!--			<tr id=mdaDateTime_row2>
						<td id=mdaDateTime_filler>					</td>
					</tr>  --!>
				</tbody> </table>`  // &#x3000;&#x3000;&#x3000;

const mdaSavelistTBL=`<table id="mdaSavelist_tbl" style="font-size: 10px;">	<tbody>
					<tr id=mdaDateTime_row>
					</tr>
				</tbody> </table>`  // &#x3000;&#x3000;&#x3000;

function chgSavePlaylist (max='700px') {  // save to playlist dialog window size // obsoleted by google !!!
		GM_addStyle(`.ytd-add-to-playlist-renderer { 	padding-bottom: 3px; 	padding-top:   3px; 	margin-bottom:  0px !important;  	}
					 .ytdMenuTitleRendererHost     {	padding-bottom: 1px; 	padding-top:   1px; 										}
					 ytd-add-to-playlist-renderer[dialog] #playlists.ytd-add-to-playlist-renderer {  max-height: ${max}; 					}
					`);
} // chgSavePlaylist()


// candidate 2 remove !!!   replaced by ThreeDotsMenuClick/Close() !!!
function hide_Save2playlistDialog (fl) { 	var a='hidden', bb;
	logdbg("> > > > > > > > hide_Save2playlistDialog ГЛЮК"); //return;

	if(fl) 	a='hidden'
	else 	a=''; // a='visible'

	// закрывать только если aria-hidden != true !!!


	// WORKS, но изображение чуть подрагивает !!!
	if( bb=qS("tp-yt-iron-dropdown  .ytContextualSheetLayoutContentContainer .ytListViewModelHost[role='list']")?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode ) {
		log(`save butt 46593g2as1: made INVISIBLE`)
		bb.style.visibility=a;
		//if(fl) 	bb.style.display='none'
		//else 	bb.style.display='block';
	}
	logdbg(`hide_Save2playlistDialog(${fl}):   bb found: ${bb}  visibility: ${a}` );

	// experim 2 del
	//if( bb=qS("#above-the-fold #top-row") ) {	bb.style.visibility=a;	}
	//logdbg(`hide_Save2playlistDialog(${fl}):   bb found: ${bb}  visibility: ${a}` );

	//if( bb=qS("#mdaSaveButt") ) 	{	bb.style.visibility=a;	}
	//if( bb=qS("#mdaSaveCont") ) 	{	bb.style.visibility=a;	}
	//if( bb=qS("#mdaSave") ) 		{	bb.style.visibility=a;	}
	logdbg(`hide_Save2playlistDialog(${fl}):   bb found: ${bb}  visibility: ${a}` );

} // hide_Save2playlistDialog()


function save2playlist_cosmetic () { // pre-2025 old save2playlist dialogue
	logwarn("save2playlist_cosmetic(): disabled  obsolete 2 delete");
	return;
	aa=document.querySelectorAll("ytd-popup-container.style-scope.ytd-app tp-yt-iron-dropdown.style-scope.ytd-popup-container")[1];
	aa.style.height="800px";
	aa.querySelector("#contentWrapper").style.height="800px";
	aa.querySelector("yt-sheet-view-model").style.height="800px";
	aa.querySelector("yt-sheet-view-model").style.maxHeight="700px";
	aa.querySelectorAll("ytContextualSheetLayoutContentContainer toggleable-list-item-view-model")[1]
} // save2playlist_cosmetic()


function save2playlistResize () {  var aa, bb, cc;  // 2025 new save2playlist dialogue
	aa=document.querySelectorAll("ytd-popup-container.style-scope.ytd-app tp-yt-iron-dropdown.style-scope.ytd-popup-container");
	// еще вариант прямой - "tp-yt-iron-dropdown yt-list-view-model.ytListViewModelHost[role='list']
	if( aa ) {
		if( typeof aa[1] !='undefined' ) {
			logwarn(`---- --- --- save2playlistResize():`, aa, aa[1]);
			if( aa[1].getAttribute("save2playlistResize")=="DONE" )  return;

			if( typeof aa[1].style != 'undefined' )  aa[1].style.height="800px";
			aa[1].querySelector("#contentWrapper").style.height="800px";
			aa[1].querySelector("yt-sheet-view-model").style.height="800px";
			aa[1].querySelector("yt-sheet-view-model").style.maxHeight="700px";
			aa[1].setAttribute("save2playlistResize","DONE");
			//aa[1].querySelectorAll("ytContextualSheetLayoutContentContainer toggleable-list-item-view-model")[1]

			aa[1].querySelectorAll("toggleable-list-item-view-model")?.forEach((it) => {
						//it.querySelector(".yt-list-item-view-model__image-container.yt-list-item-view-model__leading")?.remove(); // icons OLD way
						it.querySelector(".ytListItemViewModelImageContainer.ytListItemViewModelLeading")?.remove(); // icons
						//it.querySelector("span.yt-core-attributed-string.yt-list-item-view-model__subtitle.yt-core-attributed-string--white-space-pre-wrap")?.remove(); // share type OLD way
						it.querySelector(".ytListItemViewModelSubtitleContainer")?.remove(); // share type

						it.querySelector(".ytListItemViewModelMainContainer").style.height='18px';
						it.querySelector(".ytListItemViewModelTextWrapper").style.minHeight='11px';
						if( bb=it.querySelector(".ytListItemViewModelTextWrapper .ytListItemViewModelTitle") ) {  // название плейлиста
							bb.style.maxHeight='18px'; // высота текста
							bb.style.fontSize='12px'; // размер шрифта
						}
						it.querySelector(".ytListItemViewModelImageContainer").style.height='20px'; // но лучше играться со стилем .ytListItemViewModelImageContainer
						if( bb=it.querySelector(".ytListItemViewModelImage") ) {  // флажок
							bb.style.height='13px';
							bb.style.maxHeight='18px';
						}
						if( bb=it.querySelector(".ytListItemViewModelLayoutWrapper") ) {  // padding всей ячейки
							bb.style.paddingTop='1px';
							bb.style.paddingBottom='1px';
						}
		});

			//aa.querySelectorAll("toggleable-list-item-view-model")[1].querySelector(".yt-list-item-view-model__image-container.yt-list-item-view-model__leading").remove()
			//aa.querySelectorAll("toggleable-list-item-view-model")[2].querySelector(".yt-list-item-view-model__image-container.yt-list-item-view-model__leading").remove()
		}
	}
	// при проверке наличия savebutton сначала проверять в открытых местах и только потом внутри threedots !!!!
} // save2playlistResize()



function ThreeDotsMenuClick () {  	var bu, co, _clicked=false, fn="ThreeDotsMenuClick()"; 	// open hiddenly threedots menu if it was not opened previously
	//logwarn("ThreeDotsMenuClick tmp disabled");			return;

	logdbg(`${scrpt} ${fn}: still working? ${document.ThreeDotsMenuClickStillWorking}`);
	//if( typeof ThreeDotsMenuButton == "undefined" 	)	{  logerr(`${fn}: no global variable ThreeDotsMenuButton set`); 	return; 	}
	//if( typeof ThreeDotsMenuContent == "undefined" 	)	{  logerr(`${fn}: no global variable ThreeDotsMenuContent set`); 	return; 	}

	if( document.ThreeDotsMenuClickDONE ) 				{ 	logdbg(`${fn}: already opened/closed by some other instance`); 	return; 	}
	if( document.ThreeDotsMenuClickStillWorking ) 		{ 	logwarn(`${fn}: >>another instance already running`); 			return; 	}
	if( co=qS(ThreeDotsMenuContent) )  					{ 	logdbg(`${fn}: threedots menu content ALREADY exists, NO need to click`); 	return;  }

	document.ThreeDotsMenuClickStillWorking=true;	document.ThreeDotsMenuClickOWNER=GM.info.script.name;
	let cnt=0;
	let ITRV=setInterval( ()=> {
		if( cnt++ <= 500 ) {
			if( document.ThreeDotsMenuClickDONE ) 	{ 	logdbg(`${fn}: already opened/closed by some other instance`);
														clearInterval(ITRV);
														return;
							 						}
			if(!bu) bu=qS(ThreeDotsMenuButton);  // check if button appeared
			if( bu ) {		if( !_clicked ) {  bu?.click(); _clicked=true;
															logdbg(`${fn}: threedots menu found - CLICK`);
							} else { 						logdbg(`${fn}: threedots menu already CLICKED`);			}
			}
			if(!co) co=qS(ThreeDotsMenuContent);
			if( co ) { // check if content appeared
						loginf(`${fn}: threedots content found`);


						// >>> ADD 
							hide_Save2playlistDialog(true); //- скрывает всю полоску с threedots menu !!!


						co.style.visibility="hidden";   co.setAttribute("mdaid", 'opened');
						isMenuClicked=true;  						// remove later - see MDA youtube +SaveButton +Datetime +ArrowJumps +ADs
						//_closethreedots(bu, co);
						ttout(300, ()=> { _closethreedots(bu, co); });
						clearInterval(ITRV);
						document.ThreeDotsMenuClickStillWorking=false;
						document.ThreeDotsMenuClickDONE=true;
						hide_Save2playlistDialog(false);
			} else logdbg(`${fn}: threedots content NOT found, iterating`);
		} else { 	logerr(`${fn}: FAILED due to setInterval timeout `, cnt);
					document.ThreeDotsMenuClickStillWorking=false;
					clearInterval(ITRV);
		}
	}, 10); // setInterval

	function _closethreedots (bu, co) {
		logdbg(`${fn}: threedots menu CLOSING   ariaHidden=${co?.parentNode?.parentNode?.ariaHidden}`);
		bu?.click(); 	// always fails - thus have to set display=none
		bu?.parentNode?.querySelector("yt-button-shape button")?.click(); 			// real way to close threedots menu !!!
		co.style.visibility="visible";  // return normal visibility

		//bu?.dispatchEvent(   new KeyboardEvent("keydown", { key: "Escape" }) );  // попытка его исправить через Escape
		//bu?.parentNode?.querySelector("yt-button-shape button")?.dispatchEvent(   new KeyboardEvent("keydown", { key: "Escape" }) );  // попытка его исправить через Escape
		/*
		// все равно остался мелкий косяк, когда после такого закрытия, и если не было пользовательских кликов, потом приходится тыкать threedots menu мышью дважды
		bu?.parentNode?.querySelector("yt-button-shape")?.dispatchEvent(   new KeyboardEvent("keydown", { key: "Escape" }) );  // попытка его исправить через Escape
		//co.style.display='none'; 		// closing the menu
		co.style.zIndex="";
		//co.ariaHidden=true;
		co.focused=false;  // later change to removeattribute !!!
		*/
		logdbg(`${fn}: threedots menu CLOSED   ariaHidden=${co?.parentNode?.parentNode?.ariaHidden}`);
	}
} // ThreeDotsMenuClick()





function ThreeDotsMenuClose () {  	var aa, bb,  fn="ThreeDotsMenuClose()";
	logerr("ThreeDotsMenuClose obsolete 2 delete");
	return;

	logdbg(`${scrpt} ${fn}: still working? ${document.ThreeDotsMenuClickStillWorking}  clickOWNER: ${document.ThreeDotsMenuClickOWNER}`);
	if( typeof ThreeDotsMenuButton == "undefined" 	)	{  logerr(`${fn}: no global variable ThreeDotsMenuButton set`);   return; }
	if( typeof ThreeDotsMenuContent == "undefined" 	)	{  logerr(`${fn}: no global variable ThreeDotsMenuContent set`);  return; }

	// теоретически надо еще проверять document.ThreeDotsMenuClickOWNER - кто открыл меню, тот и закрывает !!!
	if( document.ThreeDotsMenuClickOWNER != GM.info.script.name ) {	
		logwarn(`${fn}: i'm NOT the clickOWNER - EXITING      owner: ${document.ThreeDotsMenuClickOWNER}`)
		return;
	}
	let cnt=0;
	let ITRV=setInterval( ()=> { 			 // The first execution happens after delay milliseconds.
		if( cnt++ <= 25 ) {
			if( document.ThreeDotsMenuClickDONE  ) { 		logdbg(`${fn}: already opened/closed by some other instance`);
															clearInterval(ITRV);
															return; 				}
			aa=qS(ThreeDotsMenuContent);
			if( !aa )  								logwarn(`${fn}: still NO threedots menu CONTENT - iterating `, cnt);

			if( document.ThreeDotsMenuClickStillWorking )  	logerr(`${fn}: ThreeDotsMenuClickStillWorking == TRUE `, cnt);  else logerr(`${fn}: ThreeDotsMenuClickStillWorking == false `, cnt);
			if( !document.ThreeDotsMenuClickStillWorking  &&  aa  &&  aa?.style.display != 'none' ) {
				bb=qS(ThreeDotsMenuButton);
				logdbg(`${fn}: threedots menu CLOSING   ariaHidden=${bb?.ariaHidden}  `, cnt);
				//bb?.click(); // fails - thus have to set display=none
				document.ThreeDotsMenuClickDONE=true;
				aa.style.display='none';
				aa.style.visibility="visible";  // return normal visibility
				aa.style.zIndex="";
				aa.ariaHidden=true;
				aa.focused=false;  // later change to removeattribute !!!
				// все равно остался мелкий косяк, когда после такого закрытия, и если не было пользовательских кликов, потом приходится тыкать threedots menu мышью дважды
				aa.dispatchEvent(   new KeyboardEvent("keydown", { key: "Escape" }) );  // попытка его исправить
				logdbg(`${fn}: threedots menu CLOSED   ariaHidden=${bb?.ariaHidden}  `, cnt);
				clearInterval(ITRV);
			}
		}
		else { 	logerr(`${fn}: setInterval timeout `, cnt);  clearInterval(ITRV);	}
	}, 500); // setInterval
} // ThreeDotsMenuClose()




function Save2playlist_FindButton () { 	var bu, co, stopFL=false, fn="Save2playlist_FindButton()";
	logdbg(`${scrpt} ${fn}: searching Save2playlist button`);
	if( bu=qS("#mdaSave") )  { logdbg(`${fn}: Save2playlist button found by #mdaSave`); 	return bu; 	}

	// normal place // ("[aria-label^='Save']") можно кликать даже внутри threedots !!!
	if( bu=qS("[aria-label^='Save']") )  {
			logdbg(`${fn}: Save2playlist button found by aria-label 111`, bu);
			bu.id='mdaSaveButt'
			return bu;
	}

	

	// осталось проверить мое место куда делаю drag !!!



	return null;
} // Save2playlist_FindButton()


function Save2playlistClick () {  	var bu, co, _clicked=false, fn="Save2playlistClick()"; 	// open hiddenly Save2playlist menu if it was not opened previously
	logdbg(`${scrpt} ${fn}: still working? ${document.Save2playlistClickStillWorking}`);
	logdbg(`${scrpt} ${fn}: TMP DISABLED`);
	// глюк - пропадает полоса с названием-лайками-дизлайками - возможно конфликт с improved youtube

	//if( typeof Save2playlistMenuButton == "undefined" 	)	{  logerr(`${fn}: no global variable Save2playlistMenuButton set`); 	return; 	}
	//if( typeof Save2playlistMenuContent == "undefined" 	)	{  logerr(`${fn}: no global variable Save2playlistMenuContent set`); 	return; 	}

	if( document.Save2playlistClickDONE ) 				{ 	logdbg(`${fn}: already opened/closed by some other instance`); 	return; 	}
	if( document.Save2playlistClickStillWorking ) 		{ 	logwarn(`${fn}: >>another instance already running`); 			return; 	}
	if( co=qS(Save2playlistMenuContent) )  				{ 	logdbg(`${fn}: Save2playlist menu content ALREADY exists, NO need to click`); 	return;  }

	document.Save2playlistClickStillWorking=true;	document.Save2playlistClickOWNER=GM.info.script.name;
	let cnt=0;
	let ITRV=setInterval( ()=> {
		if( cnt++ <= 300 ) { 
			if( document.Save2playlistClickDONE ) 	{ 	logdbg(`${fn}: already opened/closed by some other instance`);
														clearInterval(ITRV);
														return;
							 						}
			if(!bu) bu=Save2playlist_FindButton();  // check if button appeared

			//return; // tmp return !!!!!

			if( bu ) {		if( !_clicked ) {  bu?.click(); _clicked=true;
															logdbg(`${fn}: Save2playlist menu found - CLICK`);
							} else { 						logdbg(`${fn}: Save2playlist menu already CLICKED`);			}
			} else {
				ThreeDotsMenuClick();   logdbg(`${fn}: running ThreeDotsMenuClick() to reveal Save2playlist button`);
			}
			//return; // tmp return !!!!!

			if(!co) { // co=qS(Save2playlistMenuContent);
				qSA("ytd-app   ytd-popup-container   tp-yt-iron-dropdown").forEach(el=>{
					//log(el);
					let stopFL=false;
					if( !stopFL && el.querySelector(Save2playlistMenuContent) ) {
						el.id='mdaSaveCont'; 	stopFL=true;
						logdbg(`${fn}: Save2playlist button found by aria-label !!! !!! !!! 222`, el);
						co=el;
					}
				});
			}
			// return; // tmp return !!!!!

			if( co ) { // check if content appeared
						loginf(`${fn}: Save2playlist content found `, co);
						// tmp disabled    co.style.visibility="hidden";   co.setAttribute("mdaid", 'opened');
						// tmp disabled    hide_Save2playlistDialog(true);
						//co.style.display="none";

						// какая-то херня с bu
						//ttout(200, ()=> { _closeSave2playlist(bu, co); });
						
						// WORKS GOOD !!!
						ttout(400, ()=> { _closeSave2playlist(qS("#mdaSaveButt"), co); });

						// окно херово закрывается, тоже проверять в цикле aria-hidden=true !!!

						clearInterval(ITRV);
						document.Save2playlistClickStillWorking=false;
						document.Save2playlistClickDONE=true;
			} else logdbg(`${fn}: Save2playlist content NOT found, iterating`);
		} else { 	logerr(`${fn}: FAILED due to setInterval timeout `, cnt);
					document.Save2playlistClickStillWorking=false;
					clearInterval(ITRV);
		}
	}, 30); // setInterval
	return;

	// закрывать также при смене вкладки - navigation?

function _closeSave2playlist (bu, co) {
		logdbg(`${fn}: Save2playlist menu CLOSING   ariaHidden=${co?.ariaHidden}`, bu);
		bu?.click(); 	// always fails - thus have to set display=none
		//bu?.dispatchEvent(   new KeyboardEvent("keydown", { key: "Escape" }) );  // попытка его исправить через Escape
		//bu?.dispatchEvent(   new KeyboardEvent("keyup",   { key: "Escape" }) );  // попытка его исправить через Escape
		//window.dispatchEvent(   new KeyboardEvent("keydown", { key: "Escape" }) );  // попытка его исправить через Escape
		//hide_Save2playlistDialog(false);
		co.style.visibility="visible";  // return normal visibility
		//co.ariaHidden=true;
		//co.style.display='';
		//co.style.zIndex="";
		logdbg(`${fn}: Save2playlist menu CLOSED   ariaHidden=${co?.ariaHidden}`);
	}
} // Save2playlistClick()


function showmsg_mdaDateTime_inf1 (msg, delay=2500) {  var aa, save;
	if( aa=qS("#mdaDateTime_inf1") ) {
		save=aa.innerHTML;
		loginfo(`showmsg_mdaDateTime_inf1(): ${msg} - ${delay}`);
		ttoutSMART(delay, 		'DateTime_inf1', 	'set', ()=>{		aa.innerHTML=msg; 		});
		ttoutSMART(delay+100, 	'DateTime_inf1_a', 	'set', ()=>{		aa.innerHTML=save; 		});
	} else loginfo("showmsg_mdaDateTime_inf1(): no #mdaDateTime_inf1 found");
}
