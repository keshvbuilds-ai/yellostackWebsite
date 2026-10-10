const clamp=(n:number)=>Math.max(0,Math.min(1,n));
/** Coordinates are relative to the learning section, independent of pin spacers. */
export function journeyProgress(distance:number,viewport:number,fractureTop:number,knowledgeTop:number){
 const arrivalStart=-viewport*.85;
 const arrivalEnd=-viewport*.12;
 const approachStart=Math.max(arrivalEnd+1,fractureTop-viewport*.35);
 // Complete the burst before any Knowledge Base content enters the viewport.
 const burstEnd=Math.max(approachStart+1,knowledgeTop-viewport);
 if(distance<arrivalEnd)return .22*clamp((distance-arrivalStart)/(arrivalEnd-arrivalStart));
 if(distance<approachStart)return .22+.24*clamp((distance-arrivalEnd)/(approachStart-arrivalEnd));
 return .46+.54*clamp((distance-approachStart)/(burstEnd-approachStart));
}
