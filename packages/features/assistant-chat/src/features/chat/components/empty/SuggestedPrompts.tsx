"use client";
import { usePromptActions } from "../../hooks/usePromptActions";
import { CreditCard, Building2, FileText, Landmark } from "lucide-react";

import { PromptCard } from "./PromptCard";

const prompts = [
  {
    icon: <CreditCard size={20} />,
    title: "انتقال وجه",
    description: "راهنمای انتقال وجه بین حساب‌ها",
  },
  {
    icon: <Building2 size={20} />,
    title: "افتتاح حساب",
    description: "شرایط افتتاح انواع حساب",
  },
  {
    icon: <FileText size={20} />,
    title: "استعلام چک",
    description: "استعلام وضعیت چک",
  },
  {
    icon: <Landmark size={20} />,
    title: "تسهیلات",
    description: "شرایط دریافت وام",
  },
];

export function SuggestedPrompts() {
  const { sendPrompt } = usePromptActions();
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 md:gap-4">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.title}
          {...prompt}
          onClick={() => sendPrompt(prompt.title)}
        />
      ))}
    </div>
  );
}
