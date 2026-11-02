import 'server-only';
import nodemailer from 'nodemailer';
import {transaction} from './cms/local-store';

// Reserve delivery under the store lock so concurrent retries cannot send twice.
export async function deliverClaim(id:string){
 const claim=await transaction(s=>{
  const row=s.enquiries.find(r=>r.id===id&&r.kind==='offer');
  if(!row||row.email_status==='sent'||(row.email_status==='sending'&&Date.parse(String(row.email_attempt_at))>Date.now()-120000))return null;
  row.email_status='sending';row.email_attempt_at=new Date().toISOString();return {...row};
 });
 if(!claim)return;
 let status='failed';
 try{
  const {SMTP_HOST:host,SMTP_USER:user,SMTP_PASSWORD:pass,SMTP_FROM:from}=process.env;
  const port=Number(process.env.SMTP_PORT||587);
  if(!host||!user||!pass||!from){status='not_configured';return;}
  if(![465,587].includes(port))throw new Error('Unsupported SMTP port');
  const transport=nodemailer.createTransport({host,port,secure:port===465,requireTLS:true,auth:{user,pass},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});
  const result=await transport.sendMail({from,to:String(claim.sales_email),replyTo:{address:String(claim.email),name:String(claim.name)},messageId:`<claim-${id}@yellostack.com>`,subject:`Easter egg claim — ${claim.offer_percent}% offer (${claim.offer_code})`,text:[`Easter egg offer discovered and claimed`,`Claim ID: ${id}`,`Name: ${claim.name}`,`Email: ${claim.email}`,`Phone: ${claim.phone||'Not provided'}`,`Details: ${claim.message||'Not provided'}`,`Discount: ${claim.offer_percent}%`,`Coupon: ${claim.offer_code}`,`Terms: ${claim.offer_terms}`,`Received: ${claim.created_at}`,`Consent to contact: yes`].join('\n')});
  if(!result.accepted.length)throw new Error('Recipient rejected');status='sent';
 }catch{status='failed';}
 finally{await transaction(s=>{const row=s.enquiries.find(r=>r.id===id);if(row){row.email_status=status;if(status==='sent')row.email_sent_at=new Date().toISOString();}});}
}
