"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent,
  type Ref,
} from "react";
import { IMAGE_MAX_BYTES, IMAGE_TYPES } from "@/lib/recipes";
import styles from "./ImageField.module.css";

export interface ImageFieldHandle {
  // Devolve a imagem recortada no enquadramento escolhido, ou null se nada novo foi selecionado.
  getFile: () => Promise<File | null>;
  // true quando a imagem já salva foi removida e nenhuma nova foi escolhida no lugar.
  isRemoved: () => boolean;
}

interface Props {
  currentImage?: string | null;
  ref?: Ref<ImageFieldHandle>;
}

const FRAME_RATIO = 16 / 9;
const OUTPUT = { width: 1280, height: 720 };
const MAX_ZOOM = 3;

interface Picked {
  file: File;
  url: string;
  width: number;
  height: number;
}

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

// Tamanho da imagem em fração do quadro: equivale a object-fit: cover multiplicado pelo zoom.
function displaySize(picked: Picked, zoom: number) {
  const ratio = picked.width / picked.height;
  const base = ratio > FRAME_RATIO ? { w: ratio / FRAME_RATIO, h: 1 } : { w: 1, h: FRAME_RATIO / ratio };
  return { w: base.w * zoom, h: base.h * zoom };
}

export default function ImageField({ currentImage, ref }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [zoom, setZoom] = useState(1);
  // Deslocamento do centro da imagem, em fração do quadro.
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const [removedCurrent, setRemovedCurrent] = useState(false);

  useEffect(() => () => { if (picked) URL.revokeObjectURL(picked.url); }, [picked]);

  const size = picked ? displaySize(picked, zoom) : null;

  function movePan(x: number, y: number, nextZoom = zoom) {
    if (!picked) return;
    const s = displaySize(picked, nextZoom);
    setPan({ x: clamp(x, Math.max(0, (s.w - 1) / 2)), y: clamp(y, Math.max(0, (s.h - 1) / 2)) });
  }

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) return setError("Formato inválido. Use JPEG, PNG ou WEBP.");
    if (file.size > IMAGE_MAX_BYTES) return setError("Imagem muito grande. Tamanho máximo: 5MB.");

    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      setError(null);
      setRemovedCurrent(false);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setPicked({ file, url, width: probe.naturalWidth, height: probe.naturalHeight });
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Não foi possível ler essa imagem.");
    };
    probe.src = url;
  }

  function onZoom(next: number) {
    setZoom(next);
    movePan(pan.x, pan.y, next);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!picked) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !frame.current) return;
    const rect = frame.current.getBoundingClientRect();
    movePan(pan.x + (event.clientX - drag.current.x) / rect.width, pan.y + (event.clientY - drag.current.y) / rect.height);
    drag.current = { x: event.clientX, y: event.clientY };
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = 0.03;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    if (!delta) return;
    event.preventDefault();
    movePan(pan.x + delta[0], pan.y + delta[1]);
  }

  // Com uma imagem nova escolhida, descarta a escolha (volta à salva); senão marca a salva para remoção.
  function remove() {
    setError(null);
    if (picked) setPicked(null);
    else setRemovedCurrent(true);
  }

  useImperativeHandle(ref, () => ({
    isRemoved: () => removedCurrent && !picked,
    async getFile() {
      if (!picked || !size || !img.current) return null;
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT.width;
      canvas.height = OUTPUT.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return picked.file;
      ctx.fillStyle = "#fff"; // PNG com transparência
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const w = size.w * OUTPUT.width;
      const h = size.h * OUTPUT.height;
      ctx.drawImage(
        img.current,
        (OUTPUT.width - w) / 2 + pan.x * OUTPUT.width,
        (OUTPUT.height - h) / 2 + pan.y * OUTPUT.height,
        w,
        h,
      );
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      return blob ? new File([blob], "receita.jpg", { type: "image/jpeg" }) : picked.file;
    },
  }));

  const shown = picked?.url ?? (removedCurrent ? null : currentImage) ?? null;

  return (
    <div className={styles.field}>
      <span className={styles.label}>Imagem</span>

      <div
        ref={frame}
        className={`${styles.frame} ${picked ? styles.editable : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={onKeyDown}
        tabIndex={picked ? 0 : undefined}
        role={picked ? "group" : undefined}
        aria-label={picked ? "Enquadramento da imagem. Arraste ou use as setas para posicionar." : undefined}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={img}
            src={shown}
            alt="Pré-visualização da imagem da receita"
            draggable={false}
            style={
              picked && size
                ? {
                  width: `${size.w * 100}%`,
                  height: `${size.h * 100}%`,
                  left: `${50 + pan.x * 100}%`,
                  top: `${50 + pan.y * 100}%`,
                }
                : undefined
            }
            className={picked ? styles.cropped : styles.current}
          />
        ) : (
          <span className={styles.empty}>A imagem da receita aparecerá aqui</span>
        )}
      </div>

      {picked && (
        <label className={styles.zoom}>
          <span>Zoom</span>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => onZoom(Number(e.target.value))}
          />
        </label>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.pick} onClick={() => fileInput.current?.click()}>
          {shown ? "Trocar imagem" : "Escolher imagem"}
        </button>
        {shown && (
          <button type="button" className={styles.remove} onClick={remove}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Remover imagem
          </button>
        )}
        <small>JPEG, PNG ou WEBP · até 5MB</small>
      </div>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <input ref={fileInput} type="file" accept={IMAGE_TYPES.join(",")} onChange={onPick} hidden />
    </div>
  );
}
