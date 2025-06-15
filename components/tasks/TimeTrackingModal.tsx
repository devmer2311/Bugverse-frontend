'use client';

import { useState } from 'react';
import { Task, addTimeEntry } from '@/lib/tasks';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock } from 'lucide-react';

interface TimeTrackingModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTimeAdded: () => void;
}

export default function TimeTrackingModal({ 
  task, 
  isOpen, 
  onClose, 
  onTimeAdded 
}: TimeTrackingModalProps) {
  const user = getCurrentUser();
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task || !user) return;

    try {
      addTimeEntry({
        taskId: task.id,
        userId: user.id,
        description,
        hours: parseFloat(hours),
        date,
      });
      
      // Reset form
      setHours('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      
      onTimeAdded();
      onClose();
    } catch (error) {
      console.error('Error adding time entry:', error);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Log Time</span>
          </DialogTitle>
          <DialogDescription>
            Add time spent on: <strong>{task.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours Spent</Label>
              <Input
                id="hours"
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g., 2.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you work on?"
              rows={3}
              required
            />
          </div>

          {task.timeEntries.length > 0 && (
            <div className="space-y-2">
              <Label>Previous Time Entries</Label>
              <div className="max-h-32 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded">
                {task.timeEntries.slice(-3).map((entry) => (
                  <div key={entry.id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{entry.hours}h</span>
                      <span className="text-gray-500">{entry.date}</span>
                    </div>
                    <p className="text-gray-600 text-xs">{entry.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Total time spent: <strong>{task.totalTimeSpent.toFixed(1)} hours</strong>
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Log Time
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}