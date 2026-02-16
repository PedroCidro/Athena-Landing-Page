"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/actions/user";
import { toast } from "sonner";

export function SettingsForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Senha alterada com sucesso!");
      e.currentTarget.reset();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Senha Atual</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nova Senha</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Alterando..." : "Alterar Senha"}
      </Button>
    </form>
  );
}
