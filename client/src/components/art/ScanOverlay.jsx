export default function ScanOverlay() {
  return (
    <>
      <div className="scanlines pointer-events-none fixed inset-0 z-[3]" aria-hidden />
      <div className="vignette pointer-events-none fixed inset-0 z-[3]" aria-hidden />
    </>
  );
}
