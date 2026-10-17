// Fiber 9.7 constructs the removed-in-future Three.Clock internally. Keep its
// public clock contract, but source elapsed time from Three.Timer. Version-gated
// and idempotent so installs fail visibly if an upstream layout changes.
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
const require=createRequire(import.meta.url);
const dir=dirname(require.resolve('@react-three/fiber/package.json'));
const pkg=JSON.parse(readFileSync(join(dir,'package.json'),'utf8'));
if(pkg.version!=='9.7.0')throw new Error('Review the Fiber Timer compatibility patch for version '+pkg.version);
const adapter=`/* yellostack-timer-compat */ new (class {
 constructor(){this.timer=new THREE_NAMESPACE.Timer();this.autoStart=true;this.running=false;this.elapsedTime=0;this.oldTime=0;this.startTime=0;}
 start(){this.timer.reset();this.startTime=this.oldTime=performance.now();this.elapsedTime=0;this.running=true;}
 stop(){this.getElapsedTime();this.running=false;this.autoStart=false;}
 getDelta(){if(this.autoStart&&!this.running){this.start();return 0;}if(!this.running)return 0;this.timer.update();const delta=this.timer.getDelta();this.oldTime=performance.now();this.elapsedTime+=delta;return delta;}
 getElapsedTime(){this.getDelta();return this.elapsedTime;}
})()`;
let count=0;
for(const file of readdirSync(join(dir,'dist')).filter(f=>f.startsWith('events-')&&f.endsWith('.js'))){const path=join(dir,'dist',file);let code=readFileSync(path,'utf8');if(code.includes('yellostack-timer-compat')){count++;continue;}const match=code.match(/new (THREE(?:__namespace)?)\.Clock\(\)/);if(!match)continue;code=code.replace(match[0],adapter.replaceAll('THREE_NAMESPACE',match[1]));writeFileSync(path,code);count++;}
if(count!==3)throw new Error('Expected three Fiber runtime bundles; found '+count);
console.log('Fiber Timer compatibility verified in all 3 runtime bundles.');
