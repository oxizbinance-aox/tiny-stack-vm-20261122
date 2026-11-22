// tiny-stack-vm-01: a tiny stack VM (ISA v1), written from ISA.md. Node 22, stdlib only.
import{mkdirSync as M,readFileSync as R,readdirSync as D,writeFileSync as W}from"node:fs";
const F=[(a,b)=>(a+b)|0,(a,b)=>(a-b)|0,Math.imul,(a,b)=>Math.trunc(a/b)|0,(a,b)=>(a%b)|0,(a,b)=>Math.floor((a>>>0)/(b>>>0))|0,(a,b)=>((a>>>0)%(b>>>0))|0,0,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,0,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>(a>>>(b&31))|0,0,(a,b)=>a===b?1:0,(a,b)=>a<b?1:0,(a,b)=>(a>>>0)<(b>>>0)?1:0];
function V(p,g){const m=new Int32Array(256),s=new Int32Array(257),c=new Int32Array(64);let S=0,C=0,q=0,i=0,n=0;const o=[];let L=0;
for(;;){if(n>=1e6)return[o,10];if(q<0||q>=p.length)return[o,9];const a=p[q];let b,t,u;
if(a===0)return[o,0];
else if(a===1){if(q+2>p.length)return[o,9];if(S>=256)return[o,3];s[S++]=(p[q+1]<<24)>>24;q+=2;}
else if(a===2){if(q+5>p.length)return[o,9];if(S>=256)return[o,3];s[S++]=p.readInt32LE(q+1);q+=5;}
else if(a===3){if(S<1)return[o,2];S--;q++;}
else if(a===4){if(S<1)return[o,2];if(S>=256)return[o,3];s[S]=s[S-1];S++;q++;}
else if(a===5){if(S<2)return[o,2];t=s[S-1];s[S-1]=s[S-2];s[S-2]=t;q++;}
else if(a===6){if(S<2)return[o,2];if(S>=256)return[o,3];s[S]=s[S-2];S++;q++;}
else if(a===7){if(S<3)return[o,2];t=s[S-3];s[S-3]=s[S-2];s[S-2]=s[S-1];s[S-1]=t;q++;}
else if(a>=16&&a<=34&&a!==31){if(a===23){if(S<1)return[o,2];s[S-1]=(-s[S-1])|0;q++;}else if(a===27){if(S<1)return[o,2];s[S-1]=~s[S-1];q++;}else{if(S<2)return[o,2];b=s[--S];if(a>=19&&a<=22&&b===0)return[o,4];s[S-1]=F[a-16](s[S-1],b);q++;}}
else if(a>=48&&a<=52){if(a===52){if(C===0)return[o,8];q=c[--C];}else{if(q+3>p.length)return[o,9];if(a===51){if(C>=64)return[o,7];c[C++]=q+3;q=p[q+1]|(p[q+2]<<8);}else{t=((p[q+1]|(p[q+2]<<8))<<16)>>16;if(a===48)q=q+3+t;else{if(S<1)return[o,2];u=s[--S];q=(a===49?u===0:u!==0)?q+3+t:q+3;}}}}
else if(a===64){if(S<1)return[o,2];t=s[S-1];if(t<0||t>255)return[o,6];s[S-1]=m[t];q++;}
else if(a===65){if(S<2)return[o,2];t=s[S-1];u=s[S-2];if(t<0||t>255)return[o,6];m[t]=u;S-=2;q++;}
else if(a===80){if(S<1)return[o,2];t=s[--S];u=String(t);if(L+u.length>65536)return[o,11];for(let k=0;k<u.length;k++)o.push(u.charCodeAt(k));L+=u.length;q++;}
else if(a===81){if(S<1)return[o,2];t=s[--S];if(L+1>65536)return[o,11];o.push(t&255);L++;q++;}
else if(a===82){if(S>=256)return[o,3];s[S++]=i<g.length?g[i++]:-1;q++;}
else if(a===83){if(S<1)return[o,2];return[o,s[--S]&255];}
else return[o,5];
n++;}}
const IN=process.env.MAKEFUN_INPUT_DIR||"/input",OUT=process.env.MAKEFUN_OUTPUT_DIR||"/output";
for(const e of D(IN,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name).sort()){const p=R(IN+"/"+e+"/program.bin");let g;try{g=R(IN+"/"+e+"/input.bin")}catch{g=Buffer.alloc(0)}const[o,c]=V(p,g);M(OUT+"/"+e,{recursive:true});W(OUT+"/"+e+"/stdout.bin",Buffer.from(o));W(OUT+"/"+e+"/exit.txt",c+"\n");}
