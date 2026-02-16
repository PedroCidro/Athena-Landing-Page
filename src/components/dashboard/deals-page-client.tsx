"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { updateDealStatus } from "@/lib/actions/deal";
import { DealForm } from "@/components/dashboard/deal-form";

interface Deal {
  id: string;
  title: string;
  value: string | null;
  status: string;
  client: { id: string; name: string; company: string | null };
  creator: { id: string; name: string };
}

const columns = [
  { id: "negotiating", label: "Negociando", color: "border-t-blue-400" },
  { id: "proposed", label: "Proposta", color: "border-t-yellow-400" },
  { id: "won", label: "Ganho", color: "border-t-green-400" },
  { id: "lost", label: "Perdido", color: "border-t-red-400" },
] as const;

function formatCurrency(value: string | null) {
  if (!value) return null;
  return `R$ ${Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
}

function getColumnTotal(deals: Deal[], status: string) {
  return deals
    .filter((d) => d.status === status)
    .reduce((sum, d) => sum + (d.value ? Number(d.value) : 0), 0);
}

export function DealsPageClient({
  deals: initialDeals,
  clients,
}: {
  deals: Deal[];
  clients: { id: string; name: string }[];
}) {
  const [deals, setDeals] = useState(initialDeals);
  const [showForm, setShowForm] = useState(false);

  async function handleDragEnd(result: DropResult) {
    const { destination, draggableId } = result;
    if (!destination) return;

    const deal = deals.find((d) => d.id === draggableId);
    if (!deal || deal.status === destination.droppableId) return;

    const newStatus = destination.droppableId as Deal["status"];
    setDeals((prev) =>
      prev.map((d) => (d.id === draggableId ? { ...d, status: newStatus } : d))
    );

    await updateDealStatus(
      draggableId,
      newStatus as "negotiating" | "proposed" | "won" | "lost"
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold">Pipeline de Negócios</h1>
          <p className="text-muted-foreground">
            Acompanhe seus negócios pelo funil de vendas
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Negócio
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => {
            const colDeals = deals.filter((d) => d.status === col.id);
            const total = getColumnTotal(deals, col.id);

            return (
              <div key={col.id} className="flex flex-col">
                <div
                  className={`mb-3 rounded-t-lg border-t-4 bg-muted/50 px-3 py-2 ${col.color}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{col.label}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {colDeals.length}
                    </Badge>
                  </div>
                  {total > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(String(total))}
                    </p>
                  )}
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-2 rounded-b-lg p-2 transition-colors min-h-[100px] ${
                        snapshot.isDraggingOver
                          ? "bg-accent/50"
                          : "bg-muted/20"
                      }`}
                    >
                      {colDeals.map((deal, index) => (
                        <Draggable
                          key={deal.id}
                          draggableId={deal.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Link href={`/dashboard/deals/${deal.id}`}>
                                <Card
                                  className={`cursor-pointer transition-shadow hover:shadow-md ${
                                    snapshot.isDragging
                                      ? "shadow-lg rotate-2"
                                      : ""
                                  }`}
                                >
                                  <CardContent className="p-3 space-y-1">
                                    <p className="text-sm font-medium">
                                      {deal.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {deal.client.name}
                                    </p>
                                    {deal.value && (
                                      <p className="text-sm font-semibold text-green-700">
                                        {formatCurrency(deal.value)}
                                      </p>
                                    )}
                                  </CardContent>
                                </Card>
                              </Link>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <DealForm
        clients={clients}
        open={showForm}
        onOpenChange={setShowForm}
      />
    </div>
  );
}
