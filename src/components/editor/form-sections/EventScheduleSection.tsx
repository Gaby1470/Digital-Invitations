// src/components/editor/form-sections/EventScheduleSection.tsx
"use client";

import ListEditor from '../shared/ListEditor';
import TextInput from '../shared/TextInput';
import TimePicker from '../shared/TimePicker';
import { TimelineItem } from '@/lib/types';

type EventScheduleSectionProps = {
  data: { timelineItems?: TimelineItem[] };
  onFieldChange: (field: string, value: TimelineItem[]) => void;
};

export default function EventScheduleSection({ data, onFieldChange }: EventScheduleSectionProps) {
  return (
    <div className="p-6">
      <ListEditor
        title="Event Schedule"
        addItemText="+ Add Event"
        items={data.timelineItems || []}
        defaultItem={{ time: "", title: "", location: "" }}
        onChange={(items) => onFieldChange('timelineItems', items)}
        renderItem={(item, index, handleItemChange) => (
          <div className="space-y-4">
            <TimePicker label="Time" value={item.time} onChange={(val) => handleItemChange(index, 'time', val)} />
            <TextInput label="Title" value={item.title} onChange={(val) => handleItemChange(index, 'title', val)} />
            <TextInput label="Location" value={item.location} onChange={(val) => handleItemChange(index, 'location', val)} />
          </div>
        )}
      />
    </div>
  );
}
