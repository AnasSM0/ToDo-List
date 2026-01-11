import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from './ui/dialog';
import { Loader2, Trash2, Plus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    setIsCreating(true);
    try {
      await createTask({ title: newTaskTitle, description: newTaskDesc });
      await fetchTasks(); // Refresh list
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      alert('Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    // Optimistic update (optional, but keeps UI snappy)
    const originalTasks = [...tasks];
    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));

    try {
      await updateTask(task.id, { completed: !task.completed });
      // In a real app we might verify the response matches, but simplified: assume success or revert
    } catch (err) {
      setTasks(originalTasks); // Revert on error
      alert('Failed to update task');
    }
  };
  
  const openTaskDetails = (task: Task) => {
    setViewTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!viewTask || !editTitle.trim()) return;
    
    try {
       await updateTask(viewTask.id, { title: editTitle, description: editDesc });
       setTasks(tasks.map(t => t.id === viewTask.id ? { ...t, title: editTitle, description: editDesc } : t));
       setViewTask(null);
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTask(deleteId);
      setTasks(tasks.filter(t => t.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'PENDING') return !task.completed;
    if (filter === 'COMPLETED') return task.completed;
    return true;
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-foreground"><Loader2 className="animate-spin h-8 w-8" /></div>;
  if (error) return <div className="text-destructive text-center mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex flex-col space-y-2 text-center md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">My Tasks</h1>
        <p className="text-muted-foreground">Simple. Fast. Productive.</p>
      </div>

      {/* Create Task Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isCreating || !newTaskTitle.trim()}>
                {isCreating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Task
              </Button>
            </div>
            <Textarea
              placeholder="Description (optional)"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="resize-none"
            />
          </form>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex justify-center md:justify-start gap-2">
        {(['ALL', 'PENDING', 'COMPLETED'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            className="w-24"
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No {filter.toLowerCase()} tasks found.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className={cn("transition-all cursor-pointer hover:border-primary/50", task.completed && "opacity-60 bg-muted/50")}
              onClick={() => openTaskDetails(task)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task)}
                      className="mt-1"
                    />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className={cn("font-semibold leading-none", task.completed && "line-through text-muted-foreground")}>
                    {task.title}
                  </h3>
                  {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}
                  <p className="text-xs text-muted-foreground flex items-center pt-2">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Delete Dialog */}
                <div onClick={(e) => e.stopPropagation()}>
                    <Dialog open={deleteId === task.id} onOpenChange={(open) => setDeleteId(open ? task.id : null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Task?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{task.title}"? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View/Edit Task Dialog */}
      <Dialog open={!!viewTask} onOpenChange={(open) => !open && setViewTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Task' : 'Task Details'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {isEditing ? (
                <>
                    <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Task Title"
                    />
                    <Textarea 
                         value={editDesc}
                         onChange={(e) => setEditDesc(e.target.value)}
                         placeholder="Description"
                         className="h-32"
                    />
                </>
            ) : (
                <>
                    <h3 className="font-semibold text-lg">{viewTask?.title}</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{viewTask?.description || "No description provided."}</p>
                    <div className="text-xs text-muted-foreground mt-4">
                        Created: {viewTask && new Date(viewTask.createdAt).toLocaleString()}
                    </div>
                </>
            )}
          </div>
          <DialogFooter>
            {isEditing ? (
                 <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleUpdate}>Save Changes</Button>
                 </>
            ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Task</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
