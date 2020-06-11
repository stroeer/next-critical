import fs from 'fs';
import path from 'path';
import React from 'react';

export default async function headTags() {
  const __html = await getCriticalJS();
  return <script dangerouslySetInnerHTML={{ __html }} />;
}

async function getCriticalJS() {
  const buildId = await getBuildId();
  const criticalJsFile = path.resolve(process.cwd(), '.next/server/static', buildId, 'pages/_critical.js');
  return await fs.promises.readFile(criticalJsFile, 'utf-8');
}

async function getBuildId() {
  if (process.env.NODE_ENV === 'production') {
    return await readBuildId();
  }
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }
  throw new Error(`Cannot handle env ${env}`);
}

async function readBuildId() {
  const buildIdPath = path.resolve(process.cwd(), '.next/BUILD_ID');
  return await fs.promises.readFile(buildIdPath, 'utf-8');
}
