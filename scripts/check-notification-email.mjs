import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const compile=source=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const template=await import(compile((await fs.readFile('src/lib/notification-email.ts','utf8')).replace("import 'server-only';",'')));
const body=await template.notificationEmail('Test Connection Email','Test',[['Message','<script>alert("x")</script>\nSecond line']]);
assert.ok(!body.html.includes('<script>'));assert.ok(body.html.includes('&lt;script&gt;'));assert.match(body.html,/cid:yellostack-logo/);assert.ok(body.attachments[0].content.length>0);assert.match(body.text,/Second line/);
const rows=[],sent=[];
globalThis.__notificationTest={notificationEmail:template.notificationEmail,transaction:async fn=>fn({enquiries:rows}),smtpSettings:async()=>({host:'smtp.example.com',port:587,user:'sender@example.com',password:'test',from:'sender@example.com'}),mailTransport:()=>({sendMail:async mail=>{sent.push(mail);return {accepted:[mail.to]};}})};
let source=await fs.readFile('src/lib/claim-mail.ts','utf8');source=source.replace(/^import .*;\r?\n/gm,'');source='const {notificationEmail,transaction,smtpSettings,mailTransport}=globalThis.__notificationTest;\n'+source;
const {deliverClaim}=await import(compile(source));
for(const kind of ['contact','offer']){rows.push({id:kind,kind,name:'Visitor',email:'visitor@example.com',phone:'+966530000000',message:'Project details',sales_email:'sales@example.com',offer_percent:10,offer_code:'YELLO10',offer_terms:'Subject to approval',created_at:'2026-11-03T00:00:00Z'});await deliverClaim(kind);await deliverClaim(kind);}
assert.equal(sent.length,2);assert.equal(sent[0].subject,'Contact Form Submission');assert.equal(sent[1].subject,'Easter Egg Found!!!');assert.equal(sent[0].to,'sales@example.com');assert.equal(sent[0].replyTo.address,'visitor@example.com');assert.match(sent[0].text,/Project details/);assert.doesNotMatch(sent[0].text,/Discount|Coupon/);assert.match(sent[1].text,/10%/);assert.match(sent[1].text,/YELLO10/);assert.equal(rows[0].email_status,'sent');
console.log('PASS: email subjects, recipients, visitor details, offer-only fields, HTML escaping, inline logo and duplicate suppression. No real emails sent.');
