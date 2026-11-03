import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const logo=await sharp('public/StackLogo.jpeg').trim({background:'#ffffff',threshold:20}).toBuffer();
const sizes=[16,32,48,64,256];
const frames=await Promise.all(sizes.map(size=>sharp(logo).resize(size,size,{fit:'contain',background:'#ffffff'}).ensureAlpha().png({palette:false}).toBuffer()));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
for(const [i,frame] of frames.entries()){
 // ICO PNG frames must use truecolour RGBA (PNG colour type 6), not RGB.
 assert.equal(frame[25],6);const metadata=await sharp(frame).metadata();assert.equal(metadata.channels,4);
 const entry=6+i*16;header[entry]=header[entry+1]=sizes[i]===256?0:sizes[i];header.writeUInt16LE(1,entry+4);header.writeUInt16LE(32,entry+6);header.writeUInt32LE(frame.length,entry+8);header.writeUInt32LE(offset,entry+12);offset+=frame.length;
}
await writeFile('src/app/favicon.ico',Buffer.concat([header,...frames]));
console.log('Generated favicon: 5 validated RGBA frames from StackLogo.jpeg.');
