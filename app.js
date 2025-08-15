
// Datos en localStorage
const STORAGE_KEY = 'ss:data';

function loadData(){
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
function saveData(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function render(){
    const app = document.getElementById('app');
    const data = loadData();
    app.innerHTML = '';
    data.forEach((card, i) => {
        const dueDate = getNextDueDate(card.payDay);
        const daysLeft = Math.ceil((dueDate - new Date())/(1000*60*60*24));
        const div = document.createElement('div');
        div.innerHTML = `<strong>${card.name}</strong> - Límite: ${card.limit} - Pago: ${card.payDay} (faltan ${daysLeft} días)`;
        app.appendChild(div);
    });
}
function getNextDueDate(day){
    const now = new Date();
    let due = new Date(now.getFullYear(), now.getMonth(), day);
    if (due < now) {
        due.setMonth(due.getMonth() + 1);
    }
    return due;
}
function exportBackup(){
    const data = loadData();
    const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `safespend-backup-${new Date().toISOString()}.json`;
    a.click();
}
function importBackup(e){
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        saveData(JSON.parse(reader.result));
        render();
    };
    reader.readAsText(file);
}
window.addEventListener('load', render);
