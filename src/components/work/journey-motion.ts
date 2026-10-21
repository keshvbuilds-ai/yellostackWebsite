/** A direction-independent score for the Work journey. Times are scroll units. */
export const clamp01=(value:number)=>Math.max(0,Math.min(1,value));
export const phase=(time:number,start:number,end:number)=>clamp01((time-start)/(end-start));
export const smooth=(value:number)=>value*value*(3-2*value);
export function journeyPlan(counts:number[]){
 let cursor=3.65;
 const groups=counts.map((count,index)=>{
  const enter=cursor;const ready=enter+(index?1.4:1.15);cursor=ready+3.6;
  const slides:{start:number;end:number}[]=[];
  for(let i=1;i<count;i++){slides.push({start:cursor,end:cursor+1.35});cursor+=2.65;}
  return {enter,ready,end:cursor,slides};
 });
 return {groups,exit:cursor,total:cursor+4.7};
}
