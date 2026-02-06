// ==UserScript==
// @name         MDA google
// @namespace    http://tampermonkey.net/
// @version      1.61
// @description  adds extra links to useful sites
// @author       mr-d-r
// @license      MIT
// @exclude      http*://ogs.google.com/*
// @exclude      http*://accounts.google.com/*
// @exclude      http*://*.google.com/recaptcha/*
// @match        http*://*.google.*/*
// @include      http*://*.google.*/*
// @icon         https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw
// @grant        GM_addStyle
// @grant           GM.setValue
// @grant           GM.getValue
// @require      https://update.greasyfork.org/scripts/524553/1525219/MDA%20library.js
// ==/UserScript==

// добавлять поиск ключевых слов по *.md локального обсидиана !!!

// растянуть вниз поле поиска, чтобы мои йцукен-qwerty при прокрутках не висели в воздухе !!!



// делать qwerty <<->> йцукен по Q b исовать только одну кнопку


/*
	переделать логику так:
		если в DOM есть dynamic, то подставлять в поле ввода мое ручное преобразование и ставить флажок, что на этой странице я уже делал конвертацию !!!
		on load
			- если есть флажок <20 сек - ТО НИЧЕГО НЕ ТРОГАЕМ !!!
			- иначе
			- 	удалили флажок старше 20 сек
			- 	если есть dynamic, то выполнили преобразование руками
			- 	поставили флажок

		чтобы клик по dynamic тоже работал и подставлял то, что он считает нужным!!!

		в добавление к йцукен-qwerty и наоборот, делать toggle на первом месте


*/

(function() {
    'use strict';
	var dbg=0,  aa, bb, gAutoCorrect=false, SEARCHSTRSAVE='',	myLinkID="mda_n", 	onLOADlck=false, onLOADlckTMOUT=2500,  myINITlck=false, myStyleADDED=false,  wlh=WLH();
	if( wlh.match(/accounts.google.com/) ) 		{  log(`${wlh} exiting`);  return; }
	if( wlh.match(/ogs.google.com/) ) 			{  log(`${wlh} exiting`);  return; }
	if( wlh.match(/google.com\/recaptcha/) ) 	{  log(`${wlh} exiting`);  return; }
	console.log("\n", "\n", `${GM.info.script.name}: start -> ${wlh}  debug=${(typeof dbg == "undefined") ? "absent" : dbg}  MDAlib=${(typeof MDAlib == "undefined") ? "absent" : MDAlib}` );


	function fillTD (row, name, searchStr, searchURL, anch) {  var tr, td;
		tr=qS(`[id='${row}']`);		if( !tr )  return;
		td=tr.insertCell(-1);  // -1 means TD at the end of TR  // td=document.createElement('td');    tr.appendChild(td);
		td.id=`TD${name}`;		td.classList.add("mda_td");
		td.innerHTML=`<a id="Amda_${name}" href="${searchURL}${searchStr}"> ${name} </a>`;
	} // fillTD()


	function addElem (type, name, searchStr, searchURL, anch) {  var el;
		el=document.createElement(type);
		el.id=`mda${name}`;  		el.innerHTML=name; 		styl(el);		el.href=encodeURI(`${searchURL}${searchStr}`);
		anch.insertAdjacentElement('afterend', el);
		return el;

		function styl (st) {	st.style.color='blue'; 	st.style.marginLeft='3px'; 	st.style.marginBottom='10px';   }
	} // addElem()

/*
	function mdaExtraLinks0 () {  var tit, txare, anch, aI, st;

		// СОХРАНЕНКА В E:\OneDrive\backup\javascript\from_tampermonkey_copyA\MDA google.user.js

		// КРИВОЙ ЛЕВЫЙ ОТСТУП !!!

		//anch=qS("dynamic-visibility-control"); 			// красивое центрирование, но не везде есть
		if( !anch )  anch=qS("#easter-egg");  			// есть на большинстве типов страниц с результатами
		if( !anch )  anch=qS(".appbar");  				// есть на большинстве типов страниц с результатами
		//if( !anch )  anch=qS("#center_col");			// красивое центрирование, но не везде есть
		if( !anch )  return;
	} // mdaExtraLinks0()
*/

	function mdaExtraLinks1 (upd=false) {  var fn='mdaExtraLinks1', tit, anch, aI;
		var st 	= 	`style="color: blue;  margin-left: 6px;  margin-right: 6px;  	"`;
		var tcss=`	.mda_tab 	{ 	margin-left:  1px;		margin-bottom:  5px; 	margin-top: 10px;		}
					.mda_td 	{	padding-left: 1px; 		padding-right:  19px;	padding-bottom: 3px;	}
				`;

		var htm=`	<div id="mda_tab" style="font-size: 15px;">
						<table class="mda_tab" style="position:relative left: -1px;  margin-bottom: 1px">
							<tbody>
								<tr id="mda1row_1" class="mda_tr">						</tr>
								<tr id="mda1row_2" class="mda_tr">						</tr>
								<tr id="mda1row_3" class="mda_tr">						</tr>
								<tr id="mda1row_4" class="mda_tr">						</tr>
							</tbody>
						</table>
					</div>
		`;			// DivTable.com  https://divtable.com/generator/

		tit = chkCorrectedText(fn);

		if( upd   )  qS("#mda_tab")?.remove();   // если upd = true,  то сносим существующий #mda_tab, чтобы пересоздать заново

		if( !anch )  anch=qS(".main div[jscontroller] [jsname][data-scca][data-ved]");  // right below google menu - КРАСИВЫЙ ЛЕВЫЙ ОТСТУП
		if( !anch )  return;
		aI=qS("#mda_tab"); if( !aI ) 	{	// log(`${GM.info.script.name} make extra links,  anch=`, anch);
			anch.insertAdjacentHTML('afterend', htm);		GM_addStyle(tcss);
			aI = fillTD("mda1row_1",  "google maps", 	tit, "https://www.google.com/maps/place/", 			anch);
			aI = fillTD("mda1row_1",  "wiki RU", 	tit, "https://ru.wikipedia.org/w/index.php?search=", 	anch);
			aI = fillTD("mda1row_1",  "wiki EN", 	tit, "https://en.wikipedia.org/w/index.php?search=", 	anch);

			aI = fillTD("mda1row_2",  "glosbe &nbsp;RU-PL", tit, "https://pl.glosbe.com/ru/pl/", 				anch);
			aI = fillTD("mda1row_2",  "PL-RU", 				tit, "https://pl.glosbe.com/pl/ru/", 				anch);
			aI = fillTD("mda1row_2",  "RU-BY", tit, 		"https://pl.glosbe.com/ru/be/",	 					anch);
			aI = fillTD("mda1row_2",  "BY-RU", 				tit, "https://pl.glosbe.com/be/ru/", 				anch);


			aI = fillTD("mda1row_3",  "bab.la &nbsp RU-PL",	tit, "https://pl.bab.la/slownik/rosyjski-polski/", 	anch);
			aI = fillTD("mda1row_3",  "PL-RU", 				tit, "https://pl.bab.la/slownik/polski-rosyjski/", 	anch);
			aI = fillTD("mda1row_3",  "Webster", 			tit, "https://www.merriam-webster.com/dictionary/", anch);
			aI = fillTD("mda1row_3",  "Oxford",	 			tit, "https://www.oxfordlearnersdictionaries.com/definition/english/", 	anch);
			aI = fillTD("mda1row_3",  "google translate", 	tit, "https://translate.google.com/?sl=auto&tl=ru&text=", anch);

			aI = fillTD("mda1row_4", "rezka", 			tit, "https://hdrezka.me/search/?do=search&subaction=search&q=", 		anch);
			aI = fillTD("mda1row_4", "filmix", 			tit, "https://filmix.my/search/", 					anch);
			aI = fillTD("mda1row_4", "kinogo", 			tit, "https://kinogo.online/search/", 				anch);
			aI = fillTD("mda1row_4", "IMDB", 			tit, "https://www.imdb.com/find/?q=", 				anch);
			aI = fillTD("mda1row_4", "kinopoisk", 		tit, "https://www.kinopoisk.ru/index.php?kp_query=",anch);
			aI = fillTD("mda1row_4", "kino-teatr", 		tit, "https://www.google.com/search?q=+site:kino-teatr.ru ",anch);
		}

	} // mdaExtraLinks1()


	function chkCorrectedText (caller) {  var res, aa, cc;
		if(SEARCHSTRSAVE) return SEARCHSTRSAVE;

		aa 						= qS("form[action='/search'] textarea");
		if( ! gAutoCorrect )  	return aa.value;
		cc 						= qS("dynamic-visibility-control [role='button'] b")?.innerText; 	// corrected by google value
		if( !cc )	cc			= qS("dynamic-visibility-control b")?.innerText; 					// corrected by google value

		if   (cc) 	{ 	if(aa) aa.value=cc, aa.innerHTML=cc; 	document.title=cc;		}   // если нашли исправленный гуглом текст - то супер
		else		{	if    (aa?.value)  	cc=aa?.value;
						else 				cc=document.title;
		}
		//qS("dynamic-visibility-control b")?.parentNode.parentNode.parentNode.remove();
		log(`chkCorrectedText() ${caller}:  textarea: ${aa?.value}  corrected: ${cc}`);
		log(`                               RESULT: ${cc}`);
		SEARCHSTRSAVE=cc;
		return cc;    // cc ?? aa?.value
	} // chkCorrectedText()


	function mdaQWERTY () {  var st, titP, tit, txare;
		st 				 = `	style="color: blue;  font-size: 15px;  margin-left: 1px;  margin-right: 6px;
								cursor: pointer;  color: navy;  text-align: center;
								border-radius: 10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; -khtml-border-radius: 10px; border: 1px solid #000;  padding-left: 4px; padding-right: 4px;
						"`;
		titP			 = qS("dynamic-visibility-control [role='button'] b"); 	// если написано на русском латиницей, то здесь исправленное на русский - если исправления не было - то undefined
		if(!titP)  titP  = qS("dynamic-visibility-control b"); 					// если написано на русском латиницей, то здесь исправленное на русский - если исправления не было - то undefined
		//tit				 = titP?.innerText; 										// если написано на русском латиницей, то здесь исправленное на русский - если исправления не было - то undefined
		txare 			 = qS("form[action='/search'] textarea");
		//if(!tit) 	tit	 = txare?.innerText;  												// если написано на русском латиницей, то здесь латиница
		//if(!tit) 	tit	 = txare?.value; 										// так бывает, что у "textarea" innerText пустой, но value заполнен

		tit=chkCorrectedText("mdaQWERTY()");				log("--- !!! --- tit: ", tit);

		// toooltip в двух местах
		txare?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.appendChild(	fromHTML123(`<div id=mdaQWERTY>
					<span id="mdaQWERT_S" ${st}>Autocorrect: 	<a id="mdaQWERT_ST" data-toggle="tooltip" title=""></a> 	</span>
					<span> 						&nbsp;																		</span>
					<span id="mdaQWERT_1" ${st}>				<a id="mdaQWERT_11">qwerty &#x21E2 йцукен</a>				</span>
					<span id="mdaQWERT_2" ${st}>				<a id="mdaQWERT_22">йцукен &#x21E2 qwerty</a>				</span>
					<span id="mdaQWERT_DBG1">   </span>
					<span id="mdaQWERT_DBG2">   </span>
				</div>
		`) ); // onclick="onclick222() - почему-то гугл не дает сразу прописать в html, но addEventListener("click" РАБОТАЕТ !!!
		qS("#mdaQWERT_11")?.addEventListener ("click", onclick111);
		qS("#mdaQWERT_22")?.addEventListener ("click", onclick222);
		qS("#mdaQWERT_S")?.addEventListener  ("click", onclickST); 	// ставим обработчик на span, но работать он будет и на вложенном <a></a> !!! то, что надо !!!

				function onclick000 (str,jcuken2qwert=false) {	var res, fn="onclick000()";
												res=QWERTYlayoutFix(str, jcuken2qwert);
												SEARCHSTRSAVE=res; 		if(txare) {  txare.innerText=res; 	txare.value=res; 	}
												document.title=res;
												log(`${fn}:::`, res); 		//titP?.parentNode.parentNode.parentNode.remove();  // if(titP)		titP.innerText=res;
												mdaExtraLinks1(true);
												return true;
				}
				function onclick111 () {	onclick000(tit); 									return true;		}   // QWERTYlayoutFix('ghbdtn')  	-> привет
				function onclick222 () {	onclick000(tit,true); 								return true;		} 	// QWERTYlayoutFix('руддщ', true) -> hello
				function onclickST  () {	gAutoCorrect=!gAutoCorrect; 	mdaQWERTY_upd();	return true;		}
	} // mdaQWERTY()

	function mdaQWERTY_upd () 	{			let aa=qS("#mdaQWERT_ST"),	bb=qS("#mdaQWERT_S"), 			tiptext=`Click to switch google auto-correct ${mdaQWERTY_stat(false)}`;
											if(aa && gAutoCorrect)		aa.innerHTML="<b>ON</b>";		else  aa.innerHTML="<b>OFF</b>";
											log("write to storage: ", Number(gAutoCorrect));
											localStorage.setItem("mdaQWERTY_gAutoCorrect", Number(gAutoCorrect));
											if(aa)  					aa.title=tiptext;
											if(bb) 						bb.title=tiptext;										}
//	function mdaQWERTY_upd () { 			if(gAutoCorrect)	 		qS("#mdaQWERT_ST").innerHTML="AutoCorrect<b>ON</b>";
//											else 						qS("#mdaQWERT_ST").innerHTML="AutoCorrect<b>OFF</b>"; 	}
	function mdaQWERTY_stat (norm=true) {	// if norm=true - вернуть нормальное значение, если false - то инвертированное
											let aa=gAutoCorrect;  		if( !norm )  aa=!gAutoCorrect;
											if(aa)	 					return "ON";
											else 						return "OFF"; 											}


	document.addEventListener("keydown", (e) => {
		var MYMSG="press V to show/hide menus"
		var MYDIVhook="section.devsite-wrapper";
		var MYDIVstyle="text-align: center; ";
		if( anyActiveInput() ) 	return; 						//if ((aaBB = document.activeElement) && (editable(a) || (a.tagName === "INPUT") || (a.tagName === "TEXTAREA"))) return;
		chkCorrectedText("on keydown");

	   	switch (e.code) {
	        case "KeyV":
				if (e.ctrlKey || e.altKey || e.shiftKey) 	break;
				log("keyV 2 finish");
				//if (window.location.href.match("developers.google.com")) {
					if( aa=qS("devsite-header[role='banner']") ) {
						bb=qS("button.devsite-book-nav-toggle");
						if( aa.style.display=='none' ) 	{ aa.style.display='';		if(bb) bb.click(); 	showMSGsimple("",    "", MYDIVhook, MYDIVstyle); 	}
						else						 	{ aa.style.display='none'; 	if(bb) bb.click();	showMSGsimple(MYMSG, "", MYDIVhook, MYDIVstyle);	}
					}
				//}
				e.preventDefault();
	            break;
   		}
	}); // addEventListener("keydown"...


	window.addEventListener('click',() => {
		onclick1();
	});


	function onclick1 () { 	var aa, bb,  fn="onclick1()"; // показываем то, что нам надо, а не то, что гугл свое лепит !!!
								aa=qS("form[action='/search'] textarea");
								bb=chkCorrectedText(fn);  //if(SEARCHSTRSAVE  ) 	bb=SEARCHSTRSAVE; 		else		bb=aa?.value;
								log(`${fn} bb=${bb}`);
								ttout(100,  ()=> {  aa.value=bb;  });
								return true;
	} // onclick1()


	window.addEventListener('load', function() {  var aa;
		console.log(`${GM.info.script.name} ===> on load event`);

		chkCorrectedText("on load"); 	//	no need	qS("form[action='/search'] textarea")?.addEventListener("click", onclick111);
		mdaExtraLinks1(); 	// mdaExtraLinks0();

		if( aa=parseInt(localStorage.getItem("mdaQWERTY_gAutoCorrect")) ) 	gAutoCorrect=true; 	else gAutoCorrect=false;
		mdaQWERTY();
		mdaQWERTY_upd();

	}); // addEventListener('load'


})(); // script
