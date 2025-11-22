"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { getLocalStorageItem } from "@/hooks/useLocalStorage";

interface Note {
  avaliação: string;
  nota: number;
}

interface NoteWithSubject extends Note {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
}

export default function StudentPage() {
  const subjects = [
    {
      id: "S05L1",
      code: "S05-L1",
      name: "Laboratório de Interface Homem Máquina",
    },
    {
      id: "S05B",
      code: "S05-B",
      name: "Interface Homem Máquina",
    },
  ];

  const [allNotes, setAllNotes] = useState<NoteWithSubject[]>([]);
  const previousNotesRef = useRef<NoteWithSubject[]>([]);
  const isInitialMount = useRef(true);

  // Função para criar uma chave única para cada nota
  const getNoteKey = (note: NoteWithSubject): string => {
    return `${note.subjectId}-${note.avaliação}-${note.nota}`;
  };

  // Função para carregar todas as notas de todas as matérias
  const loadAllNotes = () => {
    const notesWithSubject: NoteWithSubject[] = [];

    subjects.forEach((subject) => {
      const storedNotes = getLocalStorageItem(subject.id);
      if (storedNotes) {
        try {
          const notes: Note[] = JSON.parse(storedNotes);
          notes.forEach((note) => {
            notesWithSubject.push({
              ...note,
              subjectId: subject.id,
              subjectCode: subject.code,
              subjectName: subject.name,
            });
          });
        } catch (error) {
          console.error(`Error parsing notes for ${subject.id}:`, error);
        }
      }
    });

    // Ordenar por matéria e depois por avaliação
    setAllNotes(notesWithSubject);
  };

  // Carregar notas na inicialização
  useEffect(() => {
    loadAllNotes();
    // Marcar que a montagem inicial foi concluída após um pequeno delay
    setTimeout(() => {
      isInitialMount.current = false;
    }, 100);
  }, []);

  // Detectar novas notas e mostrar alert
  useEffect(() => {
    // Ignorar na montagem inicial
    if (isInitialMount.current) {
      previousNotesRef.current = allNotes;
      return;
    }

    // Criar sets com chaves únicas para comparação
    const previousKeys = new Set(previousNotesRef.current.map(getNoteKey));
    const currentKeys = new Set(allNotes.map(getNoteKey));
    
    // Verificar se há novas notas (chaves que não estavam nas anteriores)
    const hasNewNotes = Array.from(currentKeys).some(key => !previousKeys.has(key));
    
    if (hasNewNotes && allNotes.length > previousNotesRef.current.length) {
      // Mostrar alert de nova notificação
      alert("Nova nota adicionada");
    }
    
    // Atualizar referência anterior
    previousNotesRef.current = allNotes;
  }, [allNotes]);

  // Atualizar dinamicamente quando o localStorage mudar
  useEffect(() => {
    // Função para verificar mudanças no localStorage
    const checkForChanges = () => {
      loadAllNotes();
    };

    // Escutar evento customizado de mudança no localStorage (mesma aba)
    window.addEventListener("localStorageChange", checkForChanges);
    
    // Escutar evento storage (para quando a mudança vier de outra aba)
    window.addEventListener("storage", checkForChanges);

    // Também verificar periodicamente (fallback)
    const interval = setInterval(checkForChanges, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("localStorageChange", checkForChanges);
      window.removeEventListener("storage", checkForChanges);
    };
  }, []);

  const handleRequestReview = () => {
    alert("Revisão solicitada");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Seja bem vindo
        </h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Notificações
        </h2>
        
        <hr className="border-gray-300 mb-6" />

        <div className="space-y-4">
          {allNotes.length === 0 ? (
            <Card>
              <p className="text-gray-600 text-center py-8">
                Nenhuma notificação disponível no momento.
              </p>
            </Card>
          ) : (
            allNotes.map((note, index) => (
              <Card key={`${note.subjectId}-${index}`} className="flex flex-col">
                <div className="flex-grow">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-md mb-2">
                      {note.subjectCode}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {note.subjectName}
                    </h2>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">
                            {note.avaliação}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-gray-900">
                            {note.nota.toFixed(1)}
                          </span>
                          <Button
                            variant="outline"
                            onClick={handleRequestReview}
                            className="flex items-center justify-center"
                          >
                            Pedir Revisão
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

