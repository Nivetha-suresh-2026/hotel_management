function Button({ text, disabled, loading, loadingText = "Processing..." }) {
  return (
    <button 
      type="submit" 
      disabled={disabled || loading}
      style={{ 
        width: "100%",
        padding: "0.875rem",
        borderRadius: "12px",
        background: (disabled || loading) ? "#94a3b8" : "var(--primary)",
        color: "white",
        fontWeight: "700",
        border: "none",
        cursor: (disabled || loading) ? "not-allowed" : "pointer",
        transition: "var(--transition)",
        boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)"
      }}
    >
      {loading ? loadingText : text}
    </button>
  );
}

export default Button;