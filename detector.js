// ==UserScript==
// @name         detector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.fantazm.net/*
// @grant        GM.xmlHttpRequest
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function(){
    'use strict';

    //var raid_valid = /\d{1,2}[gGㅎ화홍qQㅂ블aㅁ모tTㅅ사실샌vVㅍ평dDㅇ위아악]/;
    var raid_valid = /\d{1,2}[채]{0,1}[gGㅎ화qQㅂ블aAㅁ모tTㅅ실dDㅇ위아]/;
    var ring = new Audio('https://fantazm.net/mabi/sound/newgall/memo/ring.mp3');
    var line;
    var chat;
    var text;
    var t_valid;

    var $ = window.$;

    document.getElementsByTagName('body')[0].click(); // sound hook!

    let logHtml = '';
    logHtml += '<div style="width: 100%;">';
    logHtml += '  <div style="display: flex; align-items: flex-end;"><div style="margin-right: auto;">로그 (파랑:거뿔,빨강:내제보)</div><div class="chat-ico ui-clear-log">청소</div></div>';
    logHtml += '  <table style="width:100%;">';
    logHtml += '    <thead><tr style="display:flex;"><th style="width: 70px;">시간</th><th style="width: 100%">내용</th></tr></thead>';
    logHtml += '    <tbody class="ui-log" style="display:block; overflow-y:auto; height: 210px; border: 1px solid black;"></tbody>';
    logHtml += '  </table>';
    logHtml += '</div>';

    $('#chatframe').append(logHtml);

    var $log = $('.ui-log');

    var addLog = function(o) {
        var $o = $(o);
        $o.find('td:first').css('width', '70px');
        $log.append($o);
        $log.find('tr').sort((a, b) => $('td:first', a).text().localeCompare($('td:first', b).text())).appendTo($log);
        $log[0].scrollTop = $log[0].scrollHeight
        ring.play();
    }


    $('.ui-clear-log').click(() => $log.empty());

    var hornObserver = new MutationObserver((mutations) => {
        for(var i = 0; i < mutations.length; i++) {
            mutations[i].addedNodes.forEach(n => {
                var node = n.cloneNode(true);
                node.lastElementChild.style.color='blue';
                addLog(node);
            })
        };
    });

    var horntimetable = $('#horntimetable tbody')[0];
    if(horntimetable) {
        hornObserver.observe(horntimetable, {childList: true});
    }


    var dtFormat = new Intl.DateTimeFormat('en-GB', {timeStyle: 'medium',timeZone: 'Asia/Seoul'});

    var observer = new MutationObserver((mutations) => {
        for(var i = 0; i < mutations.length; i++) {
            line = mutations[i].addedNodes[0];
            if(!line) break; // 지운것 혹은 정상적인 줄이 아님
            if(line.classList.contains('system')) { // 시스템메세지는 보여야하나
                if(line.innerText.startsWith('관리자 재량')) { // 관리자메세지는 필터링한다
                     line.parentNode.removeChild(line);
                }
                break;
            }
            chat = line.getElementsByClassName('chatContent')[0];
            if(chat && chat.textContent) {

                var created = chat.parentElement.getAttribute('created');
                var d = new Date(created * 1e3);

                text = chat.textContent.replace(/\s/g, '');

                t_valid = undefined;
                if(text.startsWith('http')) break;
                if(raid_valid.test(text)) t_valid = text;
            
                if(t_valid) {
                    chat.style.color = '#ff0000';
                    chat.style['font-weight'] = 'bold';

                    addLog('<tr><td style="min-width: 70px">'+ dtFormat.format(d) +'</td><td style="color: '+(line.classList.contains('myLine') ? 'red' : 'black')+'; width: 100%; text-overflow: ellipsis;">'+t_valid+'</td></tr>');
                } else if(/^[0-9]+$/.test(text)) {
                    chat.style.color = 'purple';
                    chat.style['font-weight'] = 'bold';

                    addLog('<tr><td style="min-width: 70px">'+ dtFormat.format(d) +'</td><td style="color: purple; width: 100%">'+ text +'</td></tr>');
                }
                chat = undefined;
            }
        }
    });


    var it;
    var detector = function() {
        // var chat_frame = document.getElementById('chatframe');
        // console.log(chat_frame.getElementsByTagName('u-chat')[0]);
        var iframe = document.getElementsByTagName('iframe')[0];
        if(iframe) {
            var content = iframe.contentWindow.document.querySelectorAll('.content.nano-content')[0];
            if(content) {
                clearInterval(it);
                //content.click(); // sound hook!
                observer.observe(content, { childList: true });
            }
        }
    };

    it = setInterval(detector, 100);
})();
