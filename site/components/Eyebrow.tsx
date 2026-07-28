/** "01 ——————— Addis Ababa" section marker. `onInk` variant sits on the dark band. */
export default function Eyebrow({
  index,
  label,
  onInk = false,
}: {
  index: string;
  label: string;
  onInk?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-[14px] font-mono text-[11.5px] tracking-[0.14em] uppercase ${
        onInk ? "text-bg/55" : "text-muted"
      }`}
    >
      <span className="text-accent">{index}</span>
      <span className={`h-px flex-1 ${onInk ? "bg-bg/26" : "bg-rule"}`} />
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}
