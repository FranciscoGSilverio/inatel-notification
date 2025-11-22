"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { Save, Trash2 } from "lucide-react";
import { addToLocalStorageArray, getLocalStorageItem } from "@/hooks/useLocalStorage";

interface Note {
  avaliação: string;
  nota: number;
}

export default function TeacherPage() {
  const subjects = [
    {
      id: "S05L1",
      code: "S05-L1",
      name: "Laboratório de Interface Homem Máquina",
      description: "Disciplina prática focada no desenvolvimento de interfaces de usuário modernas e intuitivas.",
    },
    {
      id: "S05B",
      code: "S05-B",
      name: "Interface Homem Máquina",
      description: "Disciplina teórica sobre os princípios de design de interfaces e experiência do usuário.",
    },
  ];

  const [notes, setNotes] = useState<Record<string, Note[]>>({});
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState("");
  const [grade, setGrade] = useState("");

  // Carregar notas do localStorage na inicialização
  useEffect(() => {
    const loadedNotes: Record<string, Note[]> = {};
    subjects.forEach((subject) => {
      const storedNotes = getLocalStorageItem(subject.id);
      if (storedNotes) {
        try {
          loadedNotes[subject.id] = JSON.parse(storedNotes);
        } catch (error) {
          console.error(`Error parsing notes for ${subject.id}:`, error);
          loadedNotes[subject.id] = [];
        }
      } else {
        loadedNotes[subject.id] = [];
      }
    });
    setNotes(loadedNotes);
  }, []);

  // Função para recarregar notas de uma matéria específica
  const reloadNotes = (subjectId: string) => {
    const storedNotes = getLocalStorageItem(subjectId);
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes((prev) => ({
          ...prev,
          [subjectId]: parsedNotes,
        }));
      } catch (error) {
        console.error(`Error parsing notes for ${subjectId}:`, error);
      }
    } else {
      setNotes((prev) => ({
        ...prev,
        [subjectId]: [],
      }));
    }
  };

  const handleAddNote = (subjectCode: string) => {
    setEditingSubject(subjectCode);
    setEvaluation("");
    setGrade("");
  };

  const handleCancel = () => {
    setEditingSubject(null);
    setEvaluation("");
    setGrade("");
  };

  const handleSave = (subjectId: string) => {
    if (!evaluation.trim() || !grade.trim()) {
      return;
    }

    const noteData: Note = {
      avaliação: evaluation.trim(),
      nota: parseFloat(grade),
    };

    addToLocalStorageArray(subjectId, noteData);
    
    // Recarregar notas da matéria
    reloadNotes(subjectId);
    
    // Limpar campos e fechar edição
    setEditingSubject(null);
    setEvaluation("");
    setGrade("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Minhas Matérias
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => {
            const subjectNotes = notes[subject.id] || [];
            
            return (
              <Card key={subject.code} id={subject.id} className="flex flex-col self-start">

                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-md mb-2">
                      {subject.code}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {subject.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {subject.description}
                    </p>
                    
                    {/* Lista de notas */}
                    {subjectNotes.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                          Notas Lançadas:
                        </h3>
                        <div className="space-y-2">
                          {subjectNotes.map((note, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                            >
                              <span className="text-sm text-gray-700">
                                {note.avaliação}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {note.nota.toFixed(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
              
                {editingSubject === subject.code ? (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  <TextField
                    label="Avaliação"
                    type="text"
                    placeholder="Nome da avaliação"
                    value={evaluation}
                    onChange={(e) => setEvaluation(e.target.value)}
                    name="evaluation"
                    required
                  />
                  
                  <TextField
                    label="Nota"
                    type="number"
                    placeholder="0.0"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    name="grade"
                    required
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleSave(subject.id)}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleAddNote(subject.code)}
                  >
                    Adicionar Nota
                  </Button>
                </div>
              )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

