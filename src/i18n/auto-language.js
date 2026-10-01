/*
 * 처음 들어온 방문자의 언어에 맞춰 같은 페이지의 다른 언어 버전으로 옮깁니다.
 * BaseLayout 이 <head> 맨 앞에 그대로 넣어 `(이 함수)(cfg, window)` 로 실행하므로
 * 오래된 브라우저에서도 돌도록 ES5 문법만 쓰고, 바깥 코드에 기대지 않습니다.
 *
 * cfg = {
 *   current: 이 페이지 언어 코드,  path: 언어 접두사를 뗀 경로 (예: /merge-pdf/),
 *   prefixes: { 코드: '/ja/' … },  match: { 코드: ['ja', …] }  (브라우저 언어 태그 접두사),
 *   fallback: 맞는 언어가 없을 때 코드,  storageKey: 언어 메뉴에서 고른 언어를 기억하는 키
 * }
 * 옮길 주소를 돌려줍니다 (옮기지 않으면 null).
 */
(function (cfg, win) {
  try {
    var nav = win.navigator || {};
    // 검색엔진·광고 크롤러와 자동화 도구는 옮기지 않습니다. (모든 언어 페이지가 그대로 색인되도록)
    if (nav.webdriver || /bot|crawl|spider|slurp|google|yeti|daum|lighthouse|headless|preview|facebookexternalhit|embedly/i.test(nav.userAgent || '')) {
      return null;
    }
    // 사이트 안에서 이동한 경우(언어 메뉴를 고른 경우와 방금 옮겨 온 경우 포함)에는 그대로 둡니다.
    var referrer = win.document.referrer || '';
    if (referrer.indexOf(win.location.origin + '/') === 0) return null;

    var target = null;
    try {
      var saved = win.localStorage.getItem(cfg.storageKey);
      if (saved && Object.prototype.hasOwnProperty.call(cfg.prefixes, saved)) target = saved;
    } catch (e) {
      // 저장소를 쓸 수 없으면 브라우저 언어로 판단합니다.
    }
    if (!target) {
      var tags = nav.languages && nav.languages.length ? nav.languages : [nav.language || ''];
      target = detect(tags);
    }
    if (target === cfg.current) return null;

    var url = cfg.prefixes[target] + cfg.path.slice(1) + (win.location.search || '') + (win.location.hash || '');
    win.location.replace(url);
    return url;
  } catch (e) {
    return null;
  }

  // 선호 언어 목록을 앞에서부터 보며 처음 맞는 언어를 고릅니다.
  function detect(tags) {
    for (var i = 0; i < tags.length; i++) {
      var hit = match(String(tags[i]).toLowerCase());
      if (hit) return hit;
    }
    return cfg.fallback;
  }

  // 태그와 가장 길게 일치하는 접두사를 가진 언어 (zh-hk → zh-tw, zh → zh-cn)
  function match(tag) {
    var best = null;
    var bestLength = 0;
    for (var code in cfg.match) {
      if (!Object.prototype.hasOwnProperty.call(cfg.match, code)) continue;
      var prefixes = cfg.match[code];
      for (var j = 0; j < prefixes.length; j++) {
        var prefix = prefixes[j];
        if ((tag === prefix || tag.indexOf(prefix + '-') === 0) && prefix.length > bestLength) {
          best = code;
          bestLength = prefix.length;
        }
      }
    }
    return best;
  }
})
