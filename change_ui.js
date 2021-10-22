// ==UserScript==
// @name         change ui
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.fantazm.net/*
// @grant        GM.xmlHttpRequest
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var $ = window.$;

    // 안보는 개빡쳐...
    $('.navbar-right').remove();

    // 로고제거
    $('.navbar-brand').remove();

    // 광고창 제거
    $('#adplease-div').remove();

    // 시크바. 시퓨점유율봐라..
    $('.chic_power_bar').remove();

    // 로그인창 가림 제거
    $('.alert.adplease-info.bg-danger').remove();

    let $multiview = $('.raid_multiview');
    // 매번 두탕뛰기 클릭 귀찮아서 만듬
    $multiview.removeClass('closeContent').css({right: 'auto', left: 0, bottom: 0, width: 'auto'});

    // 메뉴바 흔들거림 삭제
    $('li.dropdown').each((i, e) => {
        let $e = $(e);
        let w = $e.find('.dropdown-menu2').width();
        $e.width(w);
        if(($e.find("a:contains('레이드')").length)) $e.prependTo('.nav.navbar-nav')
    });

    //$multiview.find('.multiRaidViewBtn').remove();
    //$multiview.find('h4').remove();

    // 화블실목 말고 다 날려!
    let dr = $multiview.find('img').css({'width':'55px', 'height':'55px'});
    let html = [];
    dr.map((i, a) => {
       let boss = a.getAttribute('data-boss');
        if(boss != 'agu' && boss != 'saja' && boss != 'sdw' && boss != 'red') {
        //if(boss == 'wd' || boss == 'bd' || boss == 'sb' || boss == 'mk') {
            html.push(a.outerHTML);
        }
    });

    $multiview.find('div')
      .css({
        'min-width': 'auto',
        'padding': '4px 4px 4px 4px'
      })
      .html(html.join(''));

    let removeGuide = () => {
        $('.raid-guide').remove();
        $('.raid-time-div').css({
            'height' : '196px',
            'padding' : '4px 4px 4px 4px',
            'left' : 0
        });
        $('.raid-time-sub').css({
            'border-bottom': 'unset'
        });
        $('.raid-time-head').css({
            'margin-bottom': 0
        });
    }

    // 알림 가이드가 너무 커!
    removeGuide();

    var observer = new MutationObserver(function(mutations) {
        for(var i = 0; i < mutations.length; i++) {
            mutations[i].addedNodes.forEach(n => {
                removeGuide();
            })
        };
    });

   var raid_status_table = $('.raid_status_tables')[0];
    if(raid_status_table) {
        observer.observe(raid_status_table, {childList: true});
    }


})();
