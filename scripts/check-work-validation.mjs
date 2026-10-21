import ts from 'typescript';import fs from 'node:fs';import assert from 'node:assert/strict';
const compile=async(source)=>import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const content=await (await fetch('http://localhost:3000/api/cms/public')).json();globalThis.__sample=content;
const {validateContent}=await compile(fs.readFileSync('src/lib/cms/validate.ts','utf8').replace("import { defaultContent } from './defaults';",'const defaultContent=globalThis.__sample;'));
const {normalizeContentLinks}=await compile(fs.readFileSync('src/lib/cms/normalize.ts','utf8'));
const candidate=structuredClone(content);candidate.workProjects.push({id:'qa-mobile',title:'Mobile app',description:'QA only',image:'/banners/mobile.svg',service:'mobile-application-development-company-saudi-arabia',url:'qnc.sa'});
const cleaned=normalizeContentLinks(candidate);assert.equal(cleaned.workProjects.at(-1).url,'https://qnc.sa');validateContent(cleaned);
cleaned.workProjects.at(-1).url='javascript:alert(1)';assert.throws(()=>validateContent(cleaned),/Mobile app.*HTTPS/);
console.log('PASS: extra service project, bare domain normalization, actionable error and unsafe URL rejection. No content saved.');
