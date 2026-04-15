/**
 * 네오래빗 영업 인센티브 · 정산 구간
 * - 입점(매장 등록) 1만원, 활성화 시 해당 구간에 2만원 추가(합 3만/매장·구간별 누적)
 * - 정산 구간: 매월 26일 0시 ~ 익월 25일 24시(예: 3/26~4/25)
 * - 지급일: 구간 종료월의 다음 달 20일(예: 4/25 종료 → 5/20 지급)
 */
(function (global) {
  var ENTRY = 10000;
  var ACT = 20000;
  var START_DAY = 26;
  var END_DAY = 25;
  var PAYOUT_DAY = 20;

  function tsToMillis(t) {
    if (t == null) return null;
    try {
      if (typeof t.toMillis === "function") return t.toMillis();
      if (typeof t.toDate === "function") {
        var d = t.toDate();
        return isNaN(d.getTime()) ? null : d.getTime();
      }
      if (typeof t === "object" && typeof t.seconds === "number") {
        return t.seconds * 1000 + Math.floor((t.nanoseconds || 0) / 1e6);
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  global.neoIncentiveConstants = function () {
    return { entryWon: ENTRY, activationWon: ACT, cycleStartDay: START_DAY, cycleEndDay: END_DAY, payoutDay: PAYOUT_DAY };
  };

  /** asOf 시각이 속한 정산 구간 + 지급 예정일 */
  global.neoSettlementContainingDate = function (asOfDate) {
    var d = asOfDate instanceof Date ? new Date(asOfDate.getTime()) : new Date(asOfDate);
    var y = d.getFullYear();
    var m = d.getMonth();
    var day = d.getDate();
    var sy, sm, ey, em;
    if (day >= START_DAY) {
      sy = y;
      sm = m;
      if (m === 11) {
        ey = y + 1;
        em = 0;
      } else {
        ey = y;
        em = m + 1;
      }
    } else {
      ey = y;
      em = m;
      if (m === 0) {
        sy = y - 1;
        sm = 11;
      } else {
        sy = y;
        sm = m - 1;
      }
    }
    var start = new Date(sy, sm, START_DAY, 0, 0, 0, 0);
    var end = new Date(ey, em, END_DAY, 23, 59, 59, 999);
    var payY = em === 11 ? ey + 1 : ey;
    var payM = em === 11 ? 0 : em + 1;
    var payout = new Date(payY, payM, PAYOUT_DAY, 12, 0, 0, 0);
    return {
      start: start,
      end: end,
      payout: payout,
      startMs: start.getTime(),
      endMs: end.getTime(),
      payoutMs: payout.getTime(),
    };
  };

  global.neoFormatSettlementRangeShort = function (range) {
    if (!range || !range.start || !range.end) return "";
    var a = range.start;
    var b = range.end;
    return (a.getFullYear() + "." + (a.getMonth() + 1) + "." + a.getDate())
      + " ~ "
      + (b.getFullYear() + "." + (b.getMonth() + 1) + "." + b.getDate());
  };

  global.neoFormatPayoutLine = function (range) {
    if (!range || !range.payout) return "";
    var p = range.payout;
    return "수수료 지급 예정: " + p.getFullYear() + "년 " + (p.getMonth() + 1) + "월 " + p.getDate() + "일";
  };

  global.neoStoreEntryMillis = function (store) {
    if (!store) return 0;
    var c = tsToMillis(store.createdAt);
    if (c != null && Number.isFinite(c)) return c;
    if (store.date && /^\d{4}-\d{2}-\d{2}$/.test(String(store.date))) {
      var p = String(store.date).split("-");
      return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10), 12, 0, 0, 0).getTime();
    }
    return 0;
  };

  global.neoStoreActivatedMillis = function (store) {
    if (!store || !store.activated) return null;
    var a = tsToMillis(store.activatedAt);
    if (a != null && Number.isFinite(a)) return a;
    var e = global.neoStoreEntryMillis(store);
    if (e > 0) return e + 1;
    return null;
  };

  /** 구간 내 이 매장 인센티브(원) */
  global.neoStoreIncentiveInRange = function (store, startMs, endMs) {
    if (startMs == null || endMs == null) return 0;
    var total = 0;
    var em = global.neoStoreEntryMillis(store);
    if (em >= startMs && em <= endMs) total += ENTRY;
    if (store && store.activated) {
      var am = global.neoStoreActivatedMillis(store);
      if (am != null && am >= startMs && am <= endMs) total += ACT;
    }
    return total;
  };

  global.neoSumIncentiveForStoresInRange = function (stores, startMs, endMs) {
    if (!stores || !stores.length) return 0;
    var s = 0;
    for (var i = 0; i < stores.length; i++) {
      s += global.neoStoreIncentiveInRange(stores[i], startMs, endMs);
    }
    return s;
  };

  global.neoCountIncentivePiecesInRange = function (stores, startMs, endMs) {
    var entries = 0;
    var activations = 0;
    if (!stores) return { entries: entries, activations: activations };
    for (var i = 0; i < stores.length; i++) {
      var st = stores[i];
      var em = global.neoStoreEntryMillis(st);
      if (em >= startMs && em <= endMs) entries++;
      if (st && st.activated) {
        var am = global.neoStoreActivatedMillis(st);
        if (am != null && am >= startMs && am <= endMs) activations++;
      }
    }
    return { entries: entries, activations: activations };
  };
})(typeof window !== "undefined" ? window : this);
