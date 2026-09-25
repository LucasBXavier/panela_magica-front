"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./Combobox.module.css";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface Props {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  // Nome acessível (quando não há <label> apontando para o id).
  ariaLabel?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

// Combobox "select-only" (padrão ARIA): botão + lista. Teclado: setas, Home/End,
// Enter/Espaço, Esc e digitar a inicial da opção.
export default function Combobox({
  options,
  value,
  onChange,
  ariaLabel,
  id,
  placeholder = "Selecione",
  required,
  disabled,
}: Props) {
  const uid = useId();
  const listId = `${uid}-list`;
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Mantém a opção ativa visível na lista.
  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function openList() {
    setActive(Math.max(selectedIndex, 0));
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) return openList();
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActive((i) => Math.min(last, Math.max(0, i + step)));
        break;
      }
      case "Home":
      case "End":
        if (!open) return;
        event.preventDefault();
        setActive(event.key === "Home" ? 0 : last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(active);
        else openList();
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default: {
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey) return;
        const letter = event.key.toLowerCase();
        const from = open ? active + 1 : selectedIndex + 1;
        const ordered = [...options.slice(from), ...options.slice(0, from)];
        const hit = ordered.findIndex((o) => o.label.toLowerCase().startsWith(letter));
        if (hit < 0) return;
        const index = (from + hit) % options.length;
        if (open) setActive(index);
        else onChange(options[index].value);
      }
    }
  }

  return (
    <div className={styles.root} ref={root}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
        aria-label={ariaLabel}
        aria-required={required}
        disabled={disabled}
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className={selected ? undefined : styles.placeholder}>{selected?.label ?? placeholder}</span>
        <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Campo invisível só para a validação nativa de "obrigatório" e o envio em formulários. */}
      {required && (
        <input
          className={styles.proxy}
          tabIndex={-1}
          aria-hidden="true"
          value={value}
          onChange={() => {}}
          onFocus={() => root.current?.querySelector("button")?.focus()}
          required
        />
      )}

      {open && (
        <ul ref={list} id={listId} role="listbox" aria-label={ariaLabel} className={styles.menu}>
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${uid}-opt-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={`${styles.option} ${index === active ? styles.active : ""} ${
                option.value === value ? styles.selected : ""
              }`}
              onPointerEnter={() => setActive(index)}
              // pointerdown evita perder o foco do botão antes do clique.
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
