export function validateEnquiry(value:unknown){
 if(!value||typeof value!=='object')throw new Error('Invalid request.');
 const v=value as Record<string,unknown>;
 if(typeof v.id!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v.id))throw new Error('Please refresh and try again.');
 if(v.kind!=='offer'&&v.kind!=='contact')throw new Error('Invalid enquiry type.');
 if(v.consent!==true)throw new Error('Please agree to be contacted about your enquiry.');
 if(typeof v.email!=='string'||v.email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))throw new Error('Please enter a valid email address.');
 if(typeof v.name!=='string'||v.name.length>100||typeof v.message!=='string'||v.message.length>4000)throw new Error('Please check your name and message.');
 if(v.kind==='contact'&&(!v.name.trim()||v.message.trim().length<10))throw new Error('Please include your name and at least 10 characters about your project.');
 if(v.website)throw new Error('Unable to accept this submission.');
 return {id:v.id,kind:v.kind,email:v.email.trim().toLowerCase(),name:v.name.trim(),message:v.message.trim(),mode:v.mode===true};
}
