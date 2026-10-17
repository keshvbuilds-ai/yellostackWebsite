import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import * as THREE from 'three';
const file=readdirSync('node_modules/@react-three/fiber/dist').find(f=>f.startsWith('events-')&&f.endsWith('.esm.js'));
const source=readFileSync('node_modules/@react-three/fiber/dist/'+file,'utf8');
const expression=source.match(/\/\* yellostack-timer-compat \*\/ (new \(class \{[\s\S]*?\}\)\(\))/)?.[1];assert.ok(expression);
const original=Object.getOwnPropertyDescriptor(globalThis,'performance');let now=1000;
Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
try{const clock=Function('THREE','return '+expression)(THREE);assert.equal(clock.getDelta(),0);now+=16;assert.ok(Math.abs(clock.getDelta()-.016)<1e-9);now+=24;assert.ok(Math.abs(clock.getElapsedTime()-.04)<1e-9);clock.stop();now+=1000;assert.equal(clock.getDelta(),0);clock.start();assert.equal(clock.elapsedTime,0);now+=20;assert.ok(Math.abs(clock.getDelta()-.02)<1e-9);clock.elapsedTime=2;assert.equal(clock.elapsedTime,2);console.log('Timer adapter: autostart, delta, elapsed time, stop, restart and manual elapsed passed.');}finally{Object.defineProperty(globalThis,'performance',original);}
