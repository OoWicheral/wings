/*
  Ícones compartilhados das telas de chat (IA e profissional).
  Todos são só componentes, então o Fast Refresh continua funcionando.
*/

import type { SVGProps } from "react";

function baseProps(width = "24", height = "24", strokeWidth = "1.8"): SVGProps<SVGSVGElement> {
    return {
        width,
        height,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        focusable: "false",
    };
}

export function IconPanel() {
    return (
        <svg {...baseProps()}>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" />
        </svg>
    );
}

export function IconEdit() {
    return (
        <svg {...baseProps()}>
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.4 2.6a2 2 0 1 1 2.8 2.8L12 14.6l-4 1 1-4Z" />
        </svg>
    );
}

export function IconHome() {
    return (
        <svg {...baseProps()}>
            <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            <path d="M9 22V12h6v10" />
        </svg>
    );
}

export function IconCommunity() {
    return (
        <svg {...baseProps()}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

export function IconPlus() {
    return (
        <svg {...baseProps("24", "24", "2.2")}>
            <path d="M12 4v16" />
            <path d="M4 12h16" />
        </svg>
    );
}

export function IconSearch() {
    return (
        <svg {...baseProps()}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    );
}

export function IconUser() {
    return (
        <svg {...baseProps()}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
    );
}

export function IconMic() {
    return (
        <svg {...baseProps()}>
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <path d="M12 19v3" />
        </svg>
    );
}

export function IconArrowUp() {
    return (
        <svg {...baseProps("24", "24", "2.3")}>
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
        </svg>
    );
}

export function IconCopy() {
    return (
        <svg {...baseProps()}>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

export function IconPencil() {
    return (
        <svg {...baseProps()}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
    );
}

export function IconTrash() {
    return (
        <svg {...baseProps()}>
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
        </svg>
    );
}
