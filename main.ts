// Tiny stack VM: a fresh implementation of make.fun's tiny stack ISA
// (generator/subject/ISA.md), written from the reference VM's rules:
// 32-bit wrapping arithmetic, 256-value stack, 64-deep call stack,
// 256 words of memory, ten traps with their own exit codes, a 1M step
// limit and a 64 KiB output limit. Plain JavaScript in a .ts file.
import{readdirSync,readFileSync,writeFileSync,mkdirSync}from"node:fs";
import{join}from"node:path";
// opcode -> [immediate bytes, pops, pushes]
const T={0:[0,0,0],1:[1,0,1],2:[4,0,1],3:[0,1,0],4:[0,1,2],5:[0,2,2],6:[0,2,3],7:[0,3,3],16:[0,2,1],17:[0,2,1],18:[0,2,1],19:[0,2,1],20:[0,2,1],21:[0,2,1],22:[0,2,1],23:[0,1,1],24:[0,2,1],25:[0,2,1],26:[0,2,1],27:[0,1,1],28:[0,2,1],29:[0,2,1],30:[0,2,1],32:[0,2,1],33:[0,2,1],34:[0,2,1],48:[2,0,0],49:[2,1,0],50:[2,1,0],51:[2,0,0],52:[0,0,0],64:[0,1,1],65:[0,2,0],80:[0,1,0],81:[0,1,0],82:[0,0,1],83:[0,1,0]};
// binary ops 0x10..0x22 by (opcode-0x10); holes at 0x17, 0x1b, 0x1f (unary/invalid)
const B=[(a,b)=>(a+b)|0,(a,b)=>(a-b)|0,Math.imul,(a,b)=>a===-2147483648&&b===-1?a:(a/b)|0,(a,b)=>b===-1?0:a%b|0,(a,b)=>Math.floor((a>>>0)/(b>>>0))|0,(a,b)=>(a>>>0)%(b>>>0)|0,0,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,0,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>(a>>>(b&31))|0,0,(a,b)=>a===b?1:0,(a,b)=>a<b?1:0,(a,b)=>(a>>>0)<(b>>>0)?1:0];
const E=new TextEncoder();
function run(p,q){
  let n=p.length,D=new Int32Array(256),s=0,C=new Int32Array(64),c=0,M=new Int32Array(256),o=new Uint8Array(65536),l=0,i=0,x=0,t=0;
  const d=e=>({o:o.slice(0,l),e});
  for(;;){
    if(t===1e6)return d(10);
    if(x<0||x>=n)return d(9);
    let k=T[p[x]];
    if(!k)return d(5);
    let[m,u,v]=k;
    if(x+m>=n)return d(9);
    t++;
    let y=x+1+m;
    if(s<u)return d(2);
    if(s-u+v>256)return d(3);
    let b=p[x];
    x=y;
    if(b===0)return d(0);
    if(b===1){D[s++]=(p[y-1]<<24)>>24;continue;}
    if(b===2){D[s++]=p[y-4]|p[y-3]<<8|p[y-2]<<16|p[y-1]<<24;continue;}
    if(b===3){s--;continue;}
    if(b===4){D[s]=D[s-1];s++;continue;}
    if(b===5){let a=D[s-1];D[s-1]=D[s-2];D[s-2]=a;continue;}
    if(b===6){D[s]=D[s-2];s++;continue;}
    if(b===7){let a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;continue;}
    if(b===23){D[s-1]=-D[s-1]|0;continue;}
    if(b===27){D[s-1]=~D[s-1];continue;}
    if(b>15&&b<35&&b!==23&&b!==27&&b!==31){let f=D[s-1],g=D[s-2];if(f===0&&b>18&&b<23)return d(4);s-=2;D[s++]=B[b-16](g,f);continue;}
    if(b>=48&&b<=50){let r=(p[y-2]|p[y-1]<<8)<<16>>16;if(b===48||(b===49)===(D[--s]===0))x=y+r;continue;}
    if(b===51){if(c===64)return d(7);C[c++]=y;x=p[y-2]|p[y-1]<<8;continue;}
    if(b===52){if(c===0)return d(8);x=C[--c];continue;}
    if(b===64){let a=D[s-1];if(a<0||a>255)return d(6);D[s-1]=M[a];continue;}
    if(b===65){let a=D[s-1],v=D[s-2];if(a<0||a>255)return d(6);s-=2;M[a]=v;continue;}
    if(b===80){let g=E.encode(""+D[s-1]);if(l+g.length>65536)return d(11);s--;o.set(g,l);l+=g.length;continue;}
    if(b===81){if(l+1>65536)return d(11);o[l++]=D[--s]&255;continue;}
    if(b===82){D[s++]=i<q.length?q[i++]:-1;continue;}
    if(b===83)return d(D[--s]&255);
    return d(5);
  }
}
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
for(const d of readdirSync(I).sort()){
  let r=run(new Uint8Array(readFileSync(join(I,d,"program.bin"))),new Uint8Array(readFileSync(join(I,d,"input.bin"))));
  mkdirSync(join(O,d),{recursive:true});
  writeFileSync(join(O,d,"stdout.bin"),r.o);
  writeFileSync(join(O,d,"exit.txt"),r.e+"\n");
}
