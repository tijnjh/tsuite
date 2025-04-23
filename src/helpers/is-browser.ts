export default function (): boolean {
  return (
    typeof window !== "undefined" && typeof window.document !== "undefined"
  );
}
