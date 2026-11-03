import {notificationEmail} from './notification-email';
import 'server-only';
import {smtpSettings,mailTransport} from './smtp-settings';
import {transaction} from './cms/local-store';

// Reserve delivery under the store lock so concurrent retries cannot send twice.
export async function deliverClaim(id:string){
 const claim=await transaction(s=>{
  const row=s.enquiries.find(r=>r.id===id&&(r.kind==='offer'||r.kind==='contact'));
  if(!row||row.email_status==='sent'||(row.email_status==='sending'&&Date.parse(String(row.email_attempt_at))>Date.now()-120000))return null;
  row.email_status='sending';row.email_attempt_at=new Date().toISOString();return {...row};
 });
 if(!claim)return;
 let status='failed';
 try{
  const settings=await smtpSettings();
  const {host,user,password:pass,from,port}=settings;
  if(!host||!user||!pass||!from){status='not_configured';return;}
  if(![465,587].includes(port))throw new Error('Unsupported SMTP port');
  const transport=mailTransport(settings);
  const subject=claim.kind==='offer'?'Easter Egg Found!!!':'Contact Form Submission';
  const fields:[string,unknown][]=[['Name',claim.name],['Email',claim.email],['Phone',claim.phone],['Message',claim.message],...(claim.kind==='offer'?[['Discount',`${claim.offer_percent}%`],['Coupon',claim.offer_code],['Offer terms',claim.offer_terms]] as [string,unknown][]:[]),['Received (UTC)',claim.created_at],['Enquiry ID',id],['Consent to contact','Yes']];
  const body=await notificationEmail(subject,claim.kind==='offer'?'A visitor discovered the Easter egg and requested their offer. Reply to this email to contact them.':'A visitor submitted the contact form. Reply to this email to contact them.',fields);
  const result=await transport.sendMail({from:{name:'YelloStack',address:from},to:String(claim.sales_email),replyTo:{address:String(claim.email),name:String(claim.name)},messageId:`<claim-${id}@yellostack.com>`,subject,...body});
  if(!result.accepted.length)throw new Error('Recipient rejected');status='sent';
 }catch{status='failed';}
 finally{await transaction(s=>{const row=s.enquiries.find(r=>r.id===id);if(row){row.email_status=status;if(status==='sent')row.email_sent_at=new Date().toISOString();}});}
}
