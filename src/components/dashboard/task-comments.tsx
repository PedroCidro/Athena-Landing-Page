"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { addTaskComment } from "@/lib/actions/task";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; name: string };
}

export function TaskComments({
  taskId,
  comments,
}: {
  taskId: string;
  comments: Comment[];
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("taskId", taskId);
    formData.set("content", content);

    const result = await addTaskComment(formData);
    if (result.error) {
      toast.error("Erro ao adicionar comentário");
    } else {
      setContent("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva um comentário..."
          rows={3}
        />
        <Button type="submit" size="sm" disabled={loading || !content.trim()}>
          {loading ? "Enviando..." : "Comentar"}
        </Button>
      </form>

      {comments.length > 0 && (
        <div className="space-y-4 pt-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {comment.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
