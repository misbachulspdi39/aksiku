warning: in the working copy of 'server.ts', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/server.ts b/server.ts[m
[1mindex fc9ba5a..c4d2a82 100644[m
[1m--- a/server.ts[m
[1m+++ b/server.ts[m
[36m@@ -1,6 +1,6 @@[m
 import express from 'express';[m
 import path from 'path';[m
[31m-import path from 'path';[m
[32m+[m[32mimport cors from 'cors';[m
 import { GoogleGenAI } from '@google/genai';[m
 import dotenv from 'dotenv';[m
 import { createServer as createViteServer } from 'vite';[m
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/package.json b/package.json[m
[1mindex c3326b4..371e301 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -27,6 +27,7 @@[m
     "vite": "^6.2.3"[m
   },[m
   "devDependencies": {[m
[32m+[m[32m    "@types/cors": "^2.8.19",[m
     "@types/express": "^4.17.21",[m
     "@types/node": "^22.14.0",[m
     "autoprefixer": "^10.4.21",[m
