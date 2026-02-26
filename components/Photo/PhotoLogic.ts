"use client";

import { useEffect, useRef } from "react";

/**
 * Хук для канваса с «навороченным» glitch‑эффектом поверх фото.
 * Полностью клиентский, работает поверх переданного imageSrc.
 */
export function usePhotoGlitchCanvas(imageSrc: string) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number | null = null;
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";

    // Тайминг глича:
    // - раз в ~0.9–1.3 секунды
    // - эффект длится от 0.5 до 2 секунд
    let nextGlitchAt = performance.now() + 900 + Math.random() * 400; // 0.9–1.3 c до первого глича
    let glitchEndAt: number | null = null;

    type Region = { x: number; y: number; w: number; h: number };
    let regions: Region[] = [];

    const render = () => {
      if (!canvas || !ctx || !img.complete) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.clientWidth || canvas.width || img.width;
      const height = canvas.clientHeight || canvas.height || img.height;

      if (!width || !height) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Базовое изображение без искажений (аналог background-size: cover)
      const imgRatio = img.width / img.height;
      const canvasRatio = width / height;
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        // холст шире — подгоняем по ширине, обрезаем по высоте
        drawWidth = width;
        drawHeight = width / imgRatio;
        offsetY = (height - drawHeight) / 2;
      } else {
        // холст уже — подгоняем по высоте, обрезаем по ширине
        drawHeight = height;
        drawWidth = height * imgRatio;
        offsetX = (width - drawWidth) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      const now = performance.now();

      // Если сейчас не идёт глич и пришло время нового — запускаем
      if (glitchEndAt === null && now >= nextGlitchAt) {
        const duration = 500 + Math.random() * 1500; // 0.5–2.0 секунды
        glitchEndAt = now + duration;
        // следующий глич начнётся через ~1 c после окончания текущего
        nextGlitchAt = glitchEndAt + 900 + Math.random() * 400;

        // Генерируем 2–4 локальные области для эффекта
        const regionCount = 2 + Math.floor(Math.random() * 3); // 2..4
        regions = [];
        for (let i = 0; i < regionCount; i++) {
          const rw = drawWidth * (0.05 + Math.random() * 0.15); // 5–20% ширины видимой части
          const rh = drawHeight * (0.1 + Math.random() * 0.15); // 10–25% высоты видимой части
          const maxX = offsetX + Math.max(0, drawWidth - rw);
          const maxY = offsetY + Math.max(0, drawHeight - rh);
          const rx =
            offsetX + (maxX > offsetX ? Math.random() * (maxX - offsetX) : 0);
          const ry =
            offsetY + (maxY > offsetY ? Math.random() * (maxY - offsetY) : 0);

          regions.push({
            x: Math.floor(rx),
            y: Math.floor(ry),
            w: Math.floor(rw),
            h: Math.floor(rh),
          });
        }
      }

      const isGlitchingNow = glitchEndAt !== null && now < glitchEndAt;

      // Если сейчас не время глича — просто показываем чистое изображение
      if (!isGlitchingNow) {
        if (glitchEndAt !== null && now >= glitchEndAt) {
          glitchEndAt = null;
          regions = [];
        }
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const original = new Uint8ClampedArray(data);

      // Если по каким‑то причинам область не сгенерировалась — выходим
      if (!regions.length) {
        ctx.putImageData(imageData, 0, 0);
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Для каждой области отдельно прокатываем набор эффектов
      regions.forEach((region) => {
        const rxStart = Math.max(0, region.x);
        const ryStart = Math.max(0, region.y);
        const rxEnd = Math.min(width, region.x + region.w);
        const ryEnd = Math.min(height, region.y + region.h);

        // 1. Горизонтальные разрывы (shift line) в пределах области
        const sliceCount = 1 + Math.floor(Math.random() * 2); // 1–2 полосы на область
        for (let i = 0; i < sliceCount; i++) {
          const sliceHeight = Math.floor(
            region.h * (0.15 + Math.random() * 0.25),
          );
          const maxLocalY = ryEnd - sliceHeight;
          const y =
            maxLocalY > ryStart
              ? Math.floor(ryStart + Math.random() * (maxLocalY - ryStart))
              : ryStart;
          const offset = Math.floor((Math.random() - 0.5) * region.w * 0.12); // смещение в рамках области

          for (let yy = y; yy < y + sliceHeight && yy < ryEnd; yy++) {
            for (let x = rxStart; x < rxEnd; x++) {
              const srcX = Math.max(rxStart, Math.min(rxEnd - 1, x + offset));
              const destIndex = (yy * width + x) * 4;
              const srcIndex = (yy * width + srcX) * 4;
              data[destIndex] = original[srcIndex];
              data[destIndex + 1] = original[srcIndex + 1];
              data[destIndex + 2] = original[srcIndex + 2];
              data[destIndex + 3] = original[srcIndex + 3];
            }
          }
        }

        // 2. Лёгкий RGB split только внутри области
        const channelOffset = Math.floor((Math.random() - 0.5) * 10); // -5..5px
        const bandStart = ryStart;
        const bandEnd = ryEnd;
        for (let y = bandStart; y < bandEnd; y++) {
          for (let x = rxStart; x < rxEnd; x++) {
            const idx = (y * width + x) * 4;
            const shiftedX = Math.max(
              rxStart,
              Math.min(rxEnd - 1, x + channelOffset),
            );
            const shiftedIdx = (y * width + shiftedX) * 4;
            data[idx] = original[shiftedIdx]; // только R‑канал
          }
        }

        // 3. Несколько scatter‑блоков внутри области
        const blockCount = 1 + Math.floor(Math.random() * 2); // 1–2 блока
        for (let i = 0; i < blockCount; i++) {
          const bw = Math.floor(region.w * (0.25 + Math.random() * 0.35));
          const bh = Math.floor(region.h * (0.15 + Math.random() * 0.25));
          const maxSX = rxEnd - bw;
          const maxSY = ryEnd - bh;
          const sx =
            maxSX > rxStart
              ? Math.floor(rxStart + Math.random() * (maxSX - rxStart))
              : rxStart;
          const sy =
            maxSY > ryStart
              ? Math.floor(ryStart + Math.random() * (maxSY - ryStart))
              : ryStart;

          const dx = Math.max(
            rxStart,
            Math.min(
              rxEnd - bw,
              sx + Math.floor((Math.random() - 0.5) * region.w * 0.25),
            ),
          );
          const dy = Math.max(
            ryStart,
            Math.min(
              ryEnd - bh,
              sy + Math.floor((Math.random() - 0.5) * region.h * 0.25),
            ),
          );

          for (let yy = 0; yy < bh; yy++) {
            for (let xx = 0; xx < bw; xx++) {
              const srcIndex = ((sy + yy) * width + (sx + xx)) * 4;
              const destIndex = ((dy + yy) * width + (dx + xx)) * 4;
              data[destIndex] = original[srcIndex];
              data[destIndex + 1] = original[srcIndex + 1];
              data[destIndex + 2] = original[srcIndex + 2];
              data[destIndex + 3] = original[srcIndex + 3];
            }
          }
        }
      });

      // 4. Светящаяся линия (flow line) — иногда, по всей ширине, но тонкая
      if (Math.random() < 0.4) {
        const lineY = Math.floor(offsetY + Math.random() * drawHeight);
        const thickness = Math.floor(1 + Math.random() * 2);
        const strength = 25 + Math.random() * 40;

        for (let yy = lineY; yy < Math.min(height, lineY + thickness); yy++) {
          for (let x = 0; x < width; x++) {
            const idx = (yy * width + x) * 4;
            data[idx] = Math.min(255, data[idx] + strength);
            data[idx + 1] = Math.min(255, data[idx + 1] + strength);
            data[idx + 2] = Math.min(255, data[idx + 2] + strength);
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      animationFrameId = requestAnimationFrame(render);
    };

    img.onload = () => {
      animationFrameId = requestAnimationFrame(render);
    };

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [imageSrc]);

  return canvasRef;
}
