export function flatten(deck) {
  return deck.flatMap(group => group.cards.map((card, i) => ({...card, id: `${group.id}-${i+1}`, category: group.category, colour: group.colour})));
}
export function filterCards(cards, filters) {
  return cards.filter(c => (!filters.query || JSON.stringify(c).toLowerCase().includes(filters.query.toLowerCase())) && ['category','phases','roles','aitypes'].every(k => !filters[k] || (k === 'category' ? c[k] === filters[k] : c[k]?.includes(filters[k]))));
}
export function shuffle(ids, random = Math.random) {
  const result = [...ids];
  for (let i=result.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
export function validateSession(s, ids, revision) {
  if (!s || s.version !== 1 || s.revision !== revision || !Array.isArray(s.order) || !s.order.length || s.order.length > ids.size || new Set(s.order).size !== s.order.length || s.order.some(id => !ids.has(id)) || !Number.isInteger(s.position) || s.position < 0 || s.position >= s.order.length || typeof s.name !== 'string' || s.name.length > 500 || !s.notes || typeof s.notes !== 'object' || Array.isArray(s.notes)) throw Error('Invalid session or different deck version.');
  for (const [id,n] of Object.entries(s.notes)) {
    if (!s.order.includes(id) || !n || typeof n !== 'object' || ['location','description','mitigation','severity','status'].some(k=>typeof n[k] !== 'string' || n[k].length > 30000) || !['unreviewed','threat','clear','skip'].includes(n.status) || !['','Low','Medium','High','Critical'].includes(n.severity)) throw Error('Invalid card notes.');
  }
  return {version:1,revision,name:s.name,order:[...s.order],position:s.position,notes:JSON.parse(JSON.stringify(s.notes))};
}
export function csv(rows) {
  return '\ufeff'+rows.map(row=>row.map(value=> { let s=String(value??''); if (/^[\s]*[=+@-]/.test(s)) s="'"+s; return '"'+s.replaceAll('"','""')+'"'; }).join(',')).join('\r\n');
}
