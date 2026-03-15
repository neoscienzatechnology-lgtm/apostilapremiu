// Simple SM-2 based SRS implementation (localStorage)
(function(){
  const KEY = 'srs_data_v1';

  function load(){
    try{ return JSON.parse(localStorage.getItem(KEY) || '{}'); }catch(e){ return {}; }
  }

  function save(data){ localStorage.setItem(KEY, JSON.stringify(data)); }

  function today(){ const d=new Date(); d.setHours(0,0,0,0); return d; }

  function addDays(d, n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }

  function ensureItem(data, id){
    if(!data[id]) data[id] = { ef:2.5, interval:0, repetitions:0, nextReview: (new Date()).toISOString() };
    return data[id];
  }

  function record(id, quality){
    // quality: 0-5
    const data = load();
    const item = ensureItem(data, id);
    if (quality < 3) {
      item.repetitions = 0;
      item.interval = 1;
    } else {
      if (item.repetitions === 0) item.interval = 1;
      else if (item.repetitions === 1) item.interval = 6;
      else item.interval = Math.round(item.interval * item.ef) || 1;
      item.repetitions += 1;
    }
    // update ef
    const q = quality;
    item.ef = item.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (item.ef < 1.3) item.ef = 1.3;
    item.nextReview = addDays(today(), item.interval).toISOString();
    data[id] = item;
    save(data);
    return item;
  }

  function getDueItems(){
    const data = load();
    const now = today();
    const due = [];
    Object.keys(data).forEach(id => {
      const it = data[id];
      if (new Date(it.nextReview) <= now) due.push({ id, ...it });
    });
    return due;
  }

  function getItem(id){ const data = load(); return data[id] || null; }

  function getAll(){ return load(); }

  window.SRS = { record, getDueItems, getItem, getAll };
  console.log('SRS ready');
})();
