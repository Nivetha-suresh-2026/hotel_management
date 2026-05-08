function Button({ text, disabled, loading }) {
  return (
    <button 
      type="submit" 
      disabled={disabled || loading}
      style={{ opacity: (disabled || loading) ? 0.7 : 1, cursor: (disabled || loading) ? "not-allowed" : "pointer" }}
    >
      {loading ? "Signing in..." : text}
    </button>
  );
}

export default Button;