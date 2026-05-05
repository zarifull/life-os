'use client';
import { useEffect, useState } from 'react';
import { TimelineItem } from './_components/TimeLineItem'

export default function Timeline({ activeFilter }: { activeFilter: string }) {
  const [loading, setLoading] = useState(true);
  const [memories, setMemories] = useState<any[]>([]);
  

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch('/api/memories');
        const data = await res.json();
        setMemories(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  const filteredMemories = Array.isArray(memories) 
  ? memories.filter(memory => activeFilter === 'All' || memory.type === activeFilter)
  : []; 

  if (loading) return <div className="p-10 text-indigo-500 animate-pulse">Loading adventures...</div>;
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to erase this memory?")) return;
  
    try {
      const res = await fetch(`/api/memories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMemories(prev => prev.filter((m: any) => m.id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
 
  const handleUpdate = async (id: string, newContent: string) => {
    try {
      const res = await fetch('/api/memories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id, content: newContent }),
      });
  
      if (res.ok) {
        setMemories(prev => prev.map(m => m.id === id ? { ...m, content: newContent } : m));
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };
  return (
    <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-10">
      {filteredMemories.map((m: any) => (
        <TimelineItem 
          key={m.id}
          id={m.id}
          date={m.created_at ? new Date(m.created_at).toLocaleDateString() : 'No Date'} 
          content={m.content} 
          type={m.type} 
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
  </div>
  );
}