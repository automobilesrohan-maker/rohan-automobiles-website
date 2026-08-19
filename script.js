document.getElementById('menu').onclick=()=>document.getElementById('nav').classList.toggle('open');
document.querySelectorAll('#nav a').forEach(a=>a.onclick=()=>document.getElementById('nav').classList.remove('open'));
document.getElementById('yearNow').textContent=new Date().getFullYear();

document.getElementById('partForm').addEventListener('submit',e=>{e.preventDefault();let g=id=>document.getElementById(id).value;let msg=`Hi Rohan Automobiles, I need a car electronic part.\n\nCar: ${g('brand')} ${g('model')}\nYear: ${g('year')||'Not specified'}\nPart: ${g('part')}\nOEM/Part No: ${g('oem')||'Not available'}\nPreference: ${g('type')}`;window.open('https://wa.me/918700599085?text='+encodeURIComponent(msg),'_blank')});

const $=id=>document.getElementById(id);
let catalog=[];
let visibleLimit=12;
const brandEl=$('catalogBrand'), modelEl=$('catalogModel'), categoryEl=$('catalogCategory'), searchEl=$('catalogSearch');

function uniq(arr){return [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b));}
function setOptions(el,values,label){const current=el.value;el.innerHTML=`<option value="">${label}</option>`+values.map(v=>`<option value="${v.replace(/"/g,'&quot;')}">${v}</option>`).join('');if(values.includes(current))el.value=current;}
function filtered(){const q=searchEl.value.trim().toLowerCase(),b=brandEl.value,m=modelEl.value,c=categoryEl.value;return catalog.filter(p=>{const hay=[p.name,p.brand,p.category,p.oem_part_no,...(p.models||[])].filter(Boolean).join(' ').toLowerCase();return(!q||hay.includes(q))&&(!b||p.brand===b)&&(!m||(p.models||[]).includes(m))&&(!c||p.category===c);});}
function refreshDependentFilters(){const b=brandEl.value;const relevant=b?catalog.filter(p=>p.brand===b):catalog;setOptions(modelEl,uniq(relevant.flatMap(p=>p.models||[])),'All models');setOptions(categoryEl,uniq(relevant.map(p=>p.category)),'All categories');}
function whatsappLink(p){const models=(p.models||[]).join(', ')||'Please confirm compatible model';const msg=`Hi Rohan Automobiles, I want to enquire about this electronic part.\n\nPart: ${p.name}\nBrand: ${p.brand}\nModel/Application: ${models}\nCategory: ${p.category}\nOEM/Part No: ${p.oem_part_no||'Not listed'}\n\nPlease confirm availability, exact compatibility and your price.`;return 'https://wa.me/918700599085?text='+encodeURIComponent(msg);}
function render(){const items=filtered();$('catalogCount').textContent=catalog.length;$('catalogStatus').textContent=`${items.length} matching part${items.length===1?'':'s'} — availability and fitment to be confirmed.`;const shown=items.slice(0,visibleLimit);$('catalogGrid').innerHTML=shown.length?shown.map(p=>`<article class="catalogCard"><div class="catTop"><span class="chip">${p.category}</span><span class="brandChip">${p.brand}</span></div><h3>${p.name}</h3><dl>${(p.models||[]).length?`<div><dt>Models</dt><dd>${p.models.join(', ')}</dd></div>`:''}${p.oem_part_no?`<div><dt>OEM / Part No.</dt><dd>${p.oem_part_no}</dd></div>`:''}</dl><p class="verify">Confirm exact fitment & availability before ordering.</p><a class="btn" target="_blank" rel="noopener" href="${whatsappLink(p)}">Enquire on WhatsApp</a></article>`).join(''):'<div class="noResults"><b>No matching part found.</b><span>Try a broader search or send your requirement on WhatsApp.</span><a class="btn" href="https://wa.me/918700599085">Ask Rohan Automobiles</a></div>';$('showMore').hidden=items.length<=visibleLimit;}

fetch('catalog-data.json').then(r=>{if(!r.ok)throw new Error('Catalogue unavailable');return r.json()}).then(data=>{catalog=data.products||[];setOptions(brandEl,uniq(catalog.map(p=>p.brand)),'All brands');refreshDependentFilters();render();}).catch(()=>{$('catalogStatus').textContent='Catalogue could not load. Please use WhatsApp enquiry.';});

brandEl.addEventListener('change',()=>{visibleLimit=12;refreshDependentFilters();render();});
[modelEl,categoryEl].forEach(el=>el.addEventListener('change',()=>{visibleLimit=12;render();}));
searchEl.addEventListener('input',()=>{visibleLimit=12;render();});
$('resetFilters').addEventListener('click',()=>{searchEl.value='';brandEl.value='';refreshDependentFilters();modelEl.value='';categoryEl.value='';visibleLimit=12;render();});
$('showMore').addEventListener('click',()=>{visibleLimit+=12;render();});