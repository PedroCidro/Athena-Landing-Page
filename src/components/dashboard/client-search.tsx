"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ClientSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("search", value.trim());
    router.push(`/dashboard/clients?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar por nome, email ou empresa..."
          className="pl-9"
        />
      </div>
    </form>
  );
}
