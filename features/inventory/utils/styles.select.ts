export const customStyles = {
    menu: (base) => ({
    ...base,
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
    backgroundColor: "var(--sel-bg)",
    color: "var(--sel-texto)",
    }),

    menuList: (base) => ({
    ...base,
    overflowY: "auto",

    scrollbarGutter: "stable",

    scrollbarWidth: "thin",
    scrollbarColor: "var(--sel-scroll) transparent",

    backgroundColor: "var(--sel-bg)",

    "&::-webkit-scrollbar": {
        width: "4px",
    },

    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "var(--sel-scroll)",
        borderRadius: "10px",
    },
    }),

    control: (base, state) => ({
        ...base,

        height: "42px",
        minHeight: "42px",
        maxHeight: "42px",

        borderRadius: "0.6rem",
        backgroundColor: "var(--sel-bg)",
        color: "var(--sel-texto)",
        borderColor: state.isFocused ? "var(--sel-foco)" : "var(--sel-borde)",
        boxShadow: state.isFocused
            ? "0 0 0 4px var(--sel-foco-ring)"
            : "none",

        padding: "0 2px",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",

        "&:hover": {
            borderColor: state.isFocused ? "var(--sel-foco)" : "var(--sel-borde-hover)",
        },
    }),

    singleValue: (base: any) => ({
        ...base,
        color: "var(--sel-valor)",
    }),

    input: (base: any) => ({
        ...base,
        color: "var(--sel-valor)",
    }),

    placeholder: (base: any) => ({
        ...base,
        color: "var(--sel-placeholder)",
    }),

    valueContainer: (base) => ({
        ...base,
        flexWrap: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        minWidth: 0,

        "&::-webkit-scrollbar": {
            height: "3px",
        },

        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--sel-scroll)",
            borderRadius: "10px",
        },
    }),

    multiValue: (base) => ({
        ...base,
        flexShrink: 0,
        backgroundColor: "var(--sel-chip)",
        borderRadius: "0.375rem",
    }),

    multiValueLabel: (base: any) => ({
        ...base,
        color: "var(--sel-valor)",
    }),

    multiValueRemove: (base) => ({
        ...base,
        color: "var(--sel-valor)",
        '&:hover': {
        backgroundColor: 'var(--sel-remove-bg)',
        color: 'var(--sel-remove-texto)',
        },
    }),

    option: (base, state) => ({
        ...base,
        cursor: "pointer",

        backgroundColor: state.isSelected
            ? "var(--sel-sel-bg)"
            : state.isFocused
              ? "var(--sel-hover)"
              : "var(--sel-bg)",

        color: state.isSelected ? "var(--sel-sel-texto)" : "var(--sel-texto)",
        fontWeight: state.isSelected ? 600 : 400,

        "&:active": {
            backgroundColor: state.isSelected ? "var(--sel-sel-bg)" : "var(--sel-hover)",
        },
    }),
};

// Variables de color consumidas por customStyles.
// Se declaran como clases de Tailwind en el propio <Select> para que la
// variante dark: del tema las reescriba sin tocar JavaScript.
export const selectThemeVars = [
    "[--sel-bg:#ffffff]", "dark:[--sel-bg:#0f172a]",
    "[--sel-texto:#404040]", "dark:[--sel-texto:#f8fafc]",
    "[--sel-placeholder:#808080]", "dark:[--sel-placeholder:#94a3b8]",
    "[--sel-valor:#333333]", "dark:[--sel-valor:#f8fafc]",
    "[--sel-borde:#e5e5e5]", "dark:[--sel-borde:#334155]",
    "[--sel-borde-hover:#d4d4d4]", "dark:[--sel-borde-hover:#475569]",
    "[--sel-foco:#22d3ee]", "dark:[--sel-foco:#22d3ee]",
    "[--sel-foco-ring:rgba(34,211,238,0.05)]", "dark:[--sel-foco-ring:rgba(34,211,238,0.20)]",
    "[--sel-hover:#fafafa]", "dark:[--sel-hover:#1e293b]",
    "[--sel-sel-bg:#ecfeff]", "dark:[--sel-sel-bg:rgba(6,182,212,0.15)]",
    "[--sel-sel-texto:#0e7490]", "dark:[--sel-sel-texto:#22d3ee]",
    "[--sel-chip:#f6f6f6]", "dark:[--sel-chip:#1e293b]",
    "[--sel-scroll:#d4d4d4]", "dark:[--sel-scroll:#334155]",
    "[--sel-remove-bg:#fee2e2]", "dark:[--sel-remove-bg:rgba(239,68,68,0.10)]",
    "[--sel-remove-texto:#ef4444]", "dark:[--sel-remove-texto:#f87171]",
].join(" ");
