export const customStyles = {
    menu: (base) => ({
    ...base,
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
    }),

    menuList: (base) => ({
    ...base,
    overflowY: "auto",

    scrollbarGutter: "stable",

    scrollbarWidth: "thin",
    scrollbarColor: "#d4d4d4 transparent",

    "&::-webkit-scrollbar": {
        width: "4px",
    },

    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#d4d4d4",
        borderRadius: "10px",
    },
    }),

    control: (base, state) => ({
        ...base,

        height: "42px",
        minHeight: "42px",
        maxHeight: "42px",

        borderRadius: "0.6rem",
        borderColor: state.isFocused ? "#22d3ee" : "#e5e5e5",
        boxShadow: state.isFocused
            ? "0 0 0 4px rgba(34, 211, 238, 0.05)"
            : "none",

        padding: "0 2px",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",

        "&:hover": {
            borderColor: state.isFocused ? "#22d3ee" : "#d4d4d4",
        },
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
            backgroundColor: "#d4d4d4",
            borderRadius: "10px",
        },
    }),

    multiValue: (base) => ({
        ...base,
        flexShrink: 0,
        backgroundColor: "#f6f6f6",
        borderRadius: "0.375rem",
    }),

    multiValueRemove: (base) => ({
        ...base,
        '&:hover': {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        },
    }),

    option: (base, state) => ({
        ...base,
        cursor: "pointer",

        backgroundColor: state.isSelected
            ? "#ecfeff"
            : state.isFocused
              ? "#fafafa"
              : "#ffffff",

        color: state.isSelected ? "#0e7490" : "#404040",
        fontWeight: state.isSelected ? 600 : 400,

        "&:active": {
            backgroundColor: state.isSelected ? "#ecfeff" : "#fafafa",
        },
    }),
};
