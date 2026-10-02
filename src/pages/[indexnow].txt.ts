import type { APIRoute, GetStaticPaths } from 'astro';
import { INDEXNOW_KEY } from '../config/content';

// IndexNow 키 파일 (/<키>.txt). 검색엔진이 이 파일로 키의 주인을 확인합니다.
export const getStaticPaths = (() => [{ params: { indexnow: INDEXNOW_KEY } }]) satisfies GetStaticPaths;

export const GET: APIRoute = () =>
  new Response(INDEXNOW_KEY, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
