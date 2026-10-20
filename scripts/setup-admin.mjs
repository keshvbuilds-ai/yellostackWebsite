import {randomBytes,scryptSync} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {createInterface} from 'node:readline/promises';
const prompt=createInterface({input:process.stdin,output:process.stdout});
const username=process.env.CMS_SETUP_USERNAME||await prompt.question('Admin username: ');
const password=process.env.CMS_SETUP_PASSWORD||await prompt.question('Admin password (input is visible): ');
prompt.close();
if(!username||password.length<14)throw new Error('Use a username and a password of at least 14 characters.');
const salt=randomBytes(24).toString('hex');const hash=scryptSync(password,salt,64).toString('hex');
let existing='';try{existing=readFileSync('.env.local','utf8');}catch(e){if(e.code!=='ENOENT')throw e;}
existing=existing.split(/\r?\n/).filter(line=>!/^CMS_(BACKEND|ADMIN_USERNAME|ADMIN_PASSWORD_HASH)=/.test(line)).join('\n');
writeFileSync('.env.local',existing+'\nCMS_BACKEND=local\nCMS_ADMIN_USERNAME='+JSON.stringify(username)+'\nCMS_ADMIN_PASSWORD_HASH='+JSON.stringify(salt+':'+hash)+'\n',{mode:0o600});
console.log('Admin configured in ignored .env.local. Restart the server.');
