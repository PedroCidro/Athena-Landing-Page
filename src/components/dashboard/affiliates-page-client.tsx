"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OutreachForm } from "./outreach-form";
import { updateOutreachStatus, deleteOutreach } from "@/lib/actions/outreach";
import { toast } from "sonner";
import { Trash2, Users, UserCheck, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface MemberStats {
  contactedBy: string;
  total: number;
  converted: number;
  responded: number;
  rejected: number;
}

interface OutreachEntry {
  id: string;
  influencerName: string;
  platform: string;
  handle: string | null;
  followersCount: number | null;
  contactedBy: string;
  status: string;
  notes: string | null;
  contactDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MEMBERS = ["Pedro", "Luiz", "Kyles"] as const;

const memberColors: Record<string, string> = {
  Pedro: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  Luiz: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  Kyles: "bg-purple-500/10 border-purple-500/20 text-purple-400",
};

const memberIconColors: Record<string, string> = {
  Pedro: "text-blue-400",
  Luiz: "text-emerald-400",
  Kyles: "text-purple-400",
};

const statusLabels: Record<string, string> = {
  contacted: "Contatado",
  responded: "Respondeu",
  negotiating: "Negociando",
  converted: "Convertido",
  rejected: "Rejeitado",
};

const statusColors: Record<string, string> = {
  contacted: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  responded: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  negotiating: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  converted: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
};

const platformLabels: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  twitter: "Twitter/X",
  other: "Outro",
};

function formatFollowers(n: number | null): string {
  if (!n) return "-";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function AffiliatesPageClient({
  stats,
  outreachList,
}: {
  stats: MemberStats[];
  outreachList: OutreachEntry[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");

  const statsMap = new Map(stats.map((s) => [s.contactedBy, s]));

  const filtered =
    filter === "all"
      ? outreachList
      : outreachList.filter((o) => o.contactedBy === filter);

  async function handleStatusChange(id: string, newStatus: string) {
    await updateOutreachStatus(id, newStatus);
    toast.success("Status atualizado!");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este contato?")) return;
    await deleteOutreach(id);
    toast.success("Contato excluido!");
    router.refresh();
  }

  const totalContacted = stats.reduce((sum, s) => sum + s.total, 0);
  const totalConverted = stats.reduce((sum, s) => sum + s.converted, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold">Afiliados</h1>
          <p className="text-muted-foreground">
            Acompanhe os contatos com influenciadores para o JustMathing
          </p>
        </div>
        <OutreachForm onSuccess={() => router.refresh()} />
      </div>

      {/* Overall stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-sans text-sm font-medium">
              Total Contatados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-sans text-sm font-medium">
              Total Convertidos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConverted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-sans text-sm font-medium">
              Taxa de Conversao
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalContacted > 0
                ? `${((totalConverted / totalContacted) * 100).toFixed(1)}%`
                : "0%"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member blocks */}
      <div className="grid gap-4 md:grid-cols-3">
        {MEMBERS.map((member) => {
          const s = statsMap.get(member);
          const total = s?.total ?? 0;
          const converted = s?.converted ?? 0;
          const responded = s?.responded ?? 0;
          const rate =
            total > 0 ? ((converted / total) * 100).toFixed(1) : "0";

          return (
            <Card
              key={member}
              className={`border ${memberColors[member]} cursor-pointer transition-all hover:scale-[1.02]`}
              onClick={() =>
                setFilter(filter === member ? "all" : member)
              }
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-sans text-lg font-semibold">
                    {member}
                  </CardTitle>
                  {filter === member && (
                    <Badge variant="outline" className="text-xs">
                      Filtrado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{total}</div>
                    <div className="text-xs text-muted-foreground">
                      Contatados
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{converted}</div>
                    <div className="text-xs text-muted-foreground">
                      Convertidos
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{rate}%</div>
                    <div className="text-xs text-muted-foreground">
                      Conversao
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current opacity-60 transition-all"
                    style={{
                      width: `${total > 0 ? (converted / total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-sans">Contatos</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Pedro">Pedro</SelectItem>
              <SelectItem value="Luiz">Luiz</SelectItem>
              <SelectItem value="Kyles">Kyles</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum contato registrado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Influenciador</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Seguidores</TableHead>
                  <TableHead>Responsavel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {item.influencerName}
                        </div>
                        {item.handle && (
                          <div className="text-xs text-muted-foreground">
                            {item.handle}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {platformLabels[item.platform] ?? item.platform}
                    </TableCell>
                    <TableCell>
                      {formatFollowers(item.followersCount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={memberColors[item.contactedBy]}
                      >
                        {item.contactedBy}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.status}
                        onValueChange={(val) =>
                          handleStatusChange(item.id, val)
                        }
                      >
                        <SelectTrigger className="h-7 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([val, label]) => (
                            <SelectItem key={val} value={val}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
