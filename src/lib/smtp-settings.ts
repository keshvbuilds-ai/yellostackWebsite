import {notificationEmail} from './notification-email';
﻿import 'server-only';
import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import nodemailer from 'nodemailer';
import {dataDirectory,transaction} from './cms/local-store';
type Settings={host:string;port:number;user:string;password:string;from:string};
function supported(){if(process.env.VERCEL||process.env.CMS_BACKEND==='json'||process.env.CMS_BACKEND==='supabase')throw new Error('Private SMTP settings require the VPS local backend.');}
async function key(){const file=path.join(dataDirectory(),'smtp.key');try{return await readFile(file);}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;try{await writeFile(file,randomBytes(32),{mode:0o600,flag:'wx'});}catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e;}return readFile(file);}}
async function decode(value:string):Promise<Settings>{const bytes=Buffer.from(value,'base64');const cipher=createDecipheriv('aes-256-gcm',await key(),bytes.subarray(0,12));cipher.setAuthTag(bytes.subarray(12,28));return JSON.parse(Buffer.concat([cipher.update(bytes.subarray(28)),cipher.final()]).toString('utf8'));}
const environment=():Settings=>({host:process.env.SMTP_HOST||'',port:Number(process.env.SMTP_PORT||587),user:process.env.SMTP_USER||'',password:process.env.SMTP_PASSWORD||'',from:process.env.SMTP_FROM||''});
export async function smtpSettings(){supported();return transaction(async s=>s.smtpEncrypted?decode(s.smtpEncrypted):environment());}
export async function smtpSummary(){const {password,...settings}=await smtpSettings();return {...settings,passwordSet:!!password};}
export async function saveSmtp(value:Record<string,unknown>){supported();const host=String(value.host||'').trim(),user=String(value.user||'').trim(),from=String(value.from||'').trim(),port=Number(value.port);
 if(!/^(?=.{1,253}$)[a-z0-9]+(?:[a-z0-9.-]*[a-z0-9])?$/i.test(host)||!host.includes('.')||![465,587].includes(port))throw new Error('Enter your SMTP hostname and port 465 or 587.');
 if(!user||user.length>254||/[\r\n]/.test(user)||! /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(from)||from.length>254)throw new Error('Enter a valid username and sender email.');
 if(typeof value.password!=='string'||value.password.length>1024)throw new Error('Invalid SMTP password.');
 await transaction(async s=>{const old=s.smtpEncrypted?await decode(s.smtpEncrypted):environment();const password=value.password as string||old.password;if(!password)throw new Error('Enter the SMTP password.');const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',await key(),iv);const encrypted=Buffer.concat([cipher.update(JSON.stringify({host,port,user,from,password}),'utf8'),cipher.final()]);s.smtpEncrypted=Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64');});
}
export function mailTransport(settings:Settings){return nodemailer.createTransport({host:settings.host,port:settings.port,secure:settings.port===465,requireTLS:true,auth:{user:settings.user,pass:settings.password},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});}
export async function testSmtp(to:string){const settings=await smtpSettings();if(!settings.host||!settings.password)throw new Error('Save SMTP settings first.');await transaction(s=>{if(s.smtpTestAt&&Date.now()-s.smtpTestAt<60000)throw new Error('Wait one minute before sending another test.');s.smtpTestAt=Date.now();});try{const result=await mailTransport(settings).sendMail({from:{name:'YelloStack',address:settings.from},to,subject:'Test Connection Email',...await notificationEmail('Test Connection Email','Your YelloStack SMTP settings can send notifications. Receiving this message confirms delivery to this mailbox.',[['Sender',settings.from],['Sales recipient',to],['Sent (UTC)',new Date().toISOString()]])});if(!result.accepted.length)throw new Error('Rejected');}catch{throw new Error('Test email failed. Check SMTP credentials, permitted sender and server connectivity.');}}
