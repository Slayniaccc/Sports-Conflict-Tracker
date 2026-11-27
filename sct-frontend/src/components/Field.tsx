import type {InputHTMLAttributes} from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Field({label, ...input}: FieldProps){
    return(
           <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink-2">{label}</span>
      <input
        {...input}
        className="h-11 rounded-xl border border-line bg-bg px-3.5 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
      />
    </label>
    )
}