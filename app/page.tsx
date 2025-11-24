"use client";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";

class Observavel {
  private inscricoes: ((msg: string) => void)[] = []

  inscrever(fn: (msg: string) => void) {
    this.inscricoes.push(fn)
    return () => {
      this.inscricoes = this.inscricoes.filter((sub) => sub !== fn)
    }
  }

  notificar(message: string) {
    this.inscricoes.forEach((fn) => fn(message))
  }
}

const observavel = new Observavel();

export default function Home() {
  const [mensagem, setMensagem] = useState<string[]>([])
  const [inscrito, setInscrito] = useState(false)

  useEffect(() => {
    if (!inscrito) return

    const desinscrever = observavel.inscrever((msg) => {
      setMensagem((prev) => [...prev, msg])
    })

    return desinscrever
  }, [inscrito])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-8 border border-zinc-300 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold mb-2 text-balance text-black">
          useEffect como <span className="text-blue-900">Observer</span>
        </h1>
        <p className="text-zinc-600 mb-8 text-pretty">
          Demonstração simples do padrão Observer usando useEffect para inscrição e desinscrição
        </p>

        <div className="space-y-6">
          <div className="flex gap-3">
            <Button onClick={() => setInscrito(!inscrito)} color={inscrito ? "red" : "blue"}>
              {inscrito ? "Desinscrever" : "Inscrever"}
            </Button>
            <Button
              onClick={() => observavel.notificar(`Notificação ${mensagem.length + 1}`)}
              variant="outline"
              disabled={!inscrito}
            >
              Enviar Notificação
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">
              Status:{" "}
              <span className={inscrito ? "text-green-600" : "text-muted-foreground"}>
                {inscrito ? "Inscrito ✓" : "Não inscrito"}
              </span>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Mensagens Recebidas:</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mensagem.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Nenhuma mensagem ainda...</p>
              ) : (
                mensagem.map((msg, i) => (
                  <div key={i} className="p-3 rounded bg-primary/10 text-sm">
                    {msg}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-sm font-semibold mb-2">Código:</h3>
            <CodeBlock
              language="tsx"
              filename=""
              highlightLines={[9, 13, 14, 18]}
              code={`
class Observavel {
  private inscricoes: ((msg: string) => void)[] = []

  inscrever(fn: (msg: string) => void) {
    this.inscricoes.push(fn)
    return () => {
      this.inscricoes = this.inscricoes.filter((sub) => sub !== fn)
    }
  }

  notificar(message: string) {
    this.inscricoes.forEach((fn) => fn(message))
  }
}

const observavel = new Observavel();

const [mensagem, setMensagem] = useState<string[]>([])
const [inscrito, setInscrito] = useState(false)

useEffect(() => {
    if (!inscrito) return

    const desinscrever = observavel.inscrever((msg) => {
      setMensagem((prev) => [...prev, msg])
    })

    return desinscrever
  }, [inscrito]);
              `}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
