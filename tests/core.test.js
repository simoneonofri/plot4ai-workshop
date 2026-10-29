import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {flatten,filterCards,shuffle,validateSession,csv} from '../core.js';
const deck=JSON.parse(fs.readFileSync(new URL('../deck.json',import.meta.url))),cards=flatten(deck),ids=new Set(cards.map(c=>c.id));
test('entire pinned deck has unique IDs and all usable fields',()=>{
 assert.equal(deck.length,8);assert.equal(cards.length,138);assert.equal(ids.size,138);
 for(const c of cards){for(const k of ['label','question','explanation','recommendation','threatif'])assert.equal(typeof c[k],'string');for(const k of ['phases','roles','aitypes'])assert.ok(Array.isArray(c[k]));assert.match(c.colour,/^[a-f0-9]{6}$/i);}
});
test('category, lifecycle and text filters combine',()=>{
 const found=filterCards(cards,{category:'Cybersecurity',phases:'Input',query:'prompt injection'});assert.ok(found.length);assert.ok(found.every(c=>c.category==='Cybersecurity'&&c.phases.includes('Input')));assert.equal(filterCards(cards,{query:'xyznoresults123'}).length,0);
});
test('shuffle preserves every card exactly once without mutating input',()=>{const input=[...ids],out=shuffle(input,()=>0.3);assert.deepEqual(new Set(out),ids);assert.notDeepEqual(out,input);assert.deepEqual(input,[...ids]);});
const valid=()=>({version:1,revision:'pinned',name:'Review',order:['1-1','1-2'],position:1,notes:{'1-1':{status:'threat',severity:'High',location:'API',description:'Example',mitigation:'Review access'}}});
test('session round trip preserves findings and position',()=>{assert.deepEqual(validateSession(JSON.parse(JSON.stringify(valid())),ids,'pinned'),valid());});
test('reject bad revisions, unknown/duplicate IDs, invalid position and malformed notes',()=>{
 for(const change of [{revision:'old'},{order:['unknown']},{order:['1-1','1-1']},{position:-1},{position:5},{notes:[]},{notes:{'1-1':{status:'threat'}}},{notes:{'1-3':valid().notes['1-1']}}])assert.throws(()=>validateSession({...valid(),...change},ids,'pinned'));
});
test('CSV preserves multiline quotes and neutralizes formulas',()=>{assert.equal(csv([['a"b','line\nnext','=1+1',' @SUM(A1)']]),'\ufeff"a""b","line\nnext","\'=1+1","\' @SUM(A1)"');});
