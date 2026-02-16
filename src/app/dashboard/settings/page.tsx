import { requireAuth } from "@/lib/auth/helpers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const user = await requireAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-sans text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Meu Perfil</CardTitle>
          <CardDescription>
            Suas informações de conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nome</p>
            <p>{user.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cargo</p>
            <p>{user.role === "admin" ? "Administrador" : "Membro"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Alterar Senha</CardTitle>
          <CardDescription>
            Atualize sua senha de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
