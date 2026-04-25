export default function Loading() {
  return (
    <div className="flex min-h-[220px] items-center justify-center">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-[#d9e8f3] border-t-[#01579b]"
        aria-label="Loading page..."
        role="status"
      />
    </div>
  );
}
