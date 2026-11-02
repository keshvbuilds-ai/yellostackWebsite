export function whatsappLink(value:string|undefined){
 const raw=value??'+966 53 041 5576';
 const digits=raw.replace(/\D/g,'');
 return /^\+?[\d ()-]+$/.test(raw)&&/^[1-9]\d{6,14}$/.test(digits)?`https://wa.me/${digits}`:'';
}
