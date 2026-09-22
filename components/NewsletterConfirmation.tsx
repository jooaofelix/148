import { StarMark } from "./icons/StarMark";

export function NewsletterConfirmation() {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center animate-fade-up">
      <StarMark className="h-8 w-8 text-paper animate-spark" />
      <div className="flex flex-col gap-2">
        <p className="font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">
          Você está na fila.
        </p>
        <p className="max-w-sm text-sm text-paper/60">
          Quando o primeiro drop abrir, você vai saber primeiro.
        </p>
      </div>
    </div>
  );
}
