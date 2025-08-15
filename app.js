// SafeSpend Web – lógica básica
const $ = (s)=>document.querySelector(s);
const fmt = (n)=> n.toLocaleString('en-US',{style:'currency',currency:'USD'});
const load = ()=> JSON.parse(localStorage.getItem('ss:data')||'{"cards":[],"history":[]}');
const save = (d)=> localStorage.setItem('ss:data', JSON.stringify(d));

let data = load();
let editingCardId = null;
let currentExpenseCardId = null;

function computeTotals() {
  const credit = data.cards.reduce((a,c)=>a + Number(c.limit||0), 0);
  const balance = data.cards.reduce((a,c)=>a + Number(c.balance||0), 0);
  const util = credit>0 ? Math.min(100, Math.round((balance/credit)*100)) : 0;
  return {credit, balance, util};
}

function render() {
  // Totales
  const t = computeTotals();
  $("#creditTotal").textContent = fmt(t.credit);
  $("#balanceTotal").textContent = fmt(t.balance);
  $("#utilTotal").textContent = t.util + "%";
  $("#utilBar").style.width = t.util + "%";

  // Historial
  const hist = $("#historyList");
  hist.innerHTML = "";
  data.history.slice(-10).reverse().forEach(h=>{
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<div class="muted">${new Date(h.date).toLocaleString()} — ${h.desc||'Gasto'}</div><div><strong>${fmt(h.amount)}</strong></div>`;
    hist.appendChild(row);
  });

  // Tarjetas
  const wrap = $("#cards");
  wrap.innerHTML = "";
  data.cards.forEach(card=>{
    const util = card.limit>0 ? Math.min(100, Math.round((card.balance/card.limit)*100)) : 0;
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="row">
        <div><strong>${card.name}</strong><div class="muted">Límite: ${fmt(card.limit)}</div></div>
        <div class="right"><span class="badge">${util}%</span></div>
      </div>
      <div class="progress" style="margin:10px 0"><div style="width:${util}%"></div></div>
      <div class="row">
        <div><div class="muted">Balance</div><div><strong>${fmt(card.balance)}</strong></div></div>
        <div><div class="muted">Restante</div><div><strong>${fmt(Math.max(0, card.limit-card.balance))}</strong></div></div>
      </div>
      <div class="actions" style="margin-top:10px">
        <button data-act="expense" data-id="${card.id}">Añadir gasto</button>
        <button data-act="payment" data-id="${card.id}">Registrar pago</button>
        <button data-act="edit" data-id="${card.id}">Editar</button>
        <button data-act="delete" data-id="${card.id}" class="danger">Eliminar</button>
      </div>
    `;
    wrap.appendChild(el);
  });

  checkThresholds();
}

function addCard(name, limit){
  const id = crypto.randomUUID();
  data.cards.push({id, name, limit:Number(limit||0), balance:0});
  save(data); render();
}
function updateCard(id, name, limit){
  const c = data.cards.find(c=>c.id===id);
  if(!c) return;
  c.name = name;
  c.limit = Number(limit||0);
  if (c.balance > c.limit) c.balance = c.limit; // clamp
  save(data); render();
}
function deleteCard(id){
  data.cards = data.cards.filter(c=>c.id!==id);
  save(data); render();
}
function addExpense(cardId, amount, desc){
  const c = data.cards.find(c=>c.id===cardId);
  if(!c) return;
  const v = Number(amount||0);
  c.balance = Math.max(0, Number(c.balance||0) + v);
  data.history.push({type:'expense', cardId, amount:v, desc, date:new Date().toISOString()});
  save(data); render();
}
function addPayment(cardId, amount, desc){
  const c = data.cards.find(c=>c.id===cardId);
  if(!c) return;
  const v = Number(amount||0);
  c.balance = Math.max(0, Number(c.balance||0) - v);
  data.history.push({type:'payment', cardId, amount:v, desc: desc||'Pago', date:new Date().toISOString()});
  save(data); render();
}

// Threshold notifications (local)
const DEFAULT_THRESHOLDS = [35, 50, 75, 90];
function checkThresholds(){
  if(!data.notified) data.notified = [];
  const t = computeTotals().util;
  DEFAULT_THRESHOLDS.forEach(p=>{
    const key = 'total-'+p;
    if (t>=p && !data.notified.includes(key)){
      // toast simple
      alert(`Aviso: utilización total superó ${p}% (${t}%).`);
      data.notified.push(key);
      save(data);
      // optional Notification API
      if (Notification && Notification.permission === 'granted'){
        new Notification('SafeSpend Web', { body: `Utilización total: ${t}%` });
      }
    }
  });
}

// Event wiring
$("#btnAddCard").addEventListener('click', ()=>{
  editingCardId = null;
  $("#dlgCardTitle").textContent = "Añadir tarjeta";
  $("#cardName").value = "";
  $("#cardLimit").value = "";
  $("#dlgCard").showModal();
});
$("#cancelCard").addEventListener('click', ()=> $("#dlgCard").close());
$("#saveCard").addEventListener('click', ()=>{
  const name = $("#cardName").value.trim();
  const limit = $("#cardLimit").value.trim();
  if(!name || !limit) return alert("Completa nombre y límite");
  if (editingCardId) updateCard(editingCardId, name, limit);
  else addCard(name, limit);
  $("#dlgCard").close();
});

$("#cards").addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id; const act = btn.dataset.act;
  if (act==='edit'){
    const c = data.cards.find(c=>c.id===id); if(!c) return;
    editingCardId = id;
    $("#dlgCardTitle").textContent = "Editar tarjeta";
    $("#cardName").value = c.name;
    $("#cardLimit").value = c.limit;
    $("#dlgCard").showModal();
  } else if (act==='delete'){
    if(confirm("¿Eliminar tarjeta?")) deleteCard(id);
  } else if (act==='expense'){
    currentExpenseCardId = id;
    $("#dlgExpenseTitle").textContent = "Añadir gasto";
    $("#expAmount").value = "";
    $("#expDesc").value = "";
    $("#dlgExpense").showModal();
  } else if (act==='payment'){
    const v = prompt("Monto del pago:");
    if (v) addPayment(id, v, "Pago");
  }
});

$("#cancelExpense").addEventListener('click', ()=> $("#dlgExpense").close());
$("#saveExpense").addEventListener('click', ()=>{
  const v = $("#expAmount").value.trim(); if(!v) return alert("Monto requerido");
  addExpense(currentExpenseCardId, v, $("#expDesc").value.trim());
  $("#dlgExpense").close();
});

$("#btnClearHistory").addEventListener('click', ()=>{
  if (confirm("¿Borrar todo el historial?")){
    data.history = [];
    save(data); render();
  }
});

// Install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt = e; $("#btnInstall").disabled = false;
});
$("#btnInstall").addEventListener('click', async()=>{
  if (deferredPrompt){ deferredPrompt.prompt(); deferredPrompt=null; }
});

// Notifications permission (optional)
if ('Notification' in window && Notification.permission==='default'){
  // pedir permiso sin molestar: usa un timeout corto
  setTimeout(()=> Notification.requestPermission().catch(()=>{}), 1500);
}

// SW
if ('serviceWorker' in navigator){ window.addEventListener('load', ()=> navigator.serviceWorker.register('/sw.js')); }

render();
