import React from 'react';
import Badge from '@/components/atoms/Badge';

const TaskPriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'High':
        return { variant: 'error', text: 'High' };
      case 'Medium':
        return { variant: 'warning', text: 'Medium' };
      case 'Low':
        return { variant: 'success', text: 'Low' };
      default:
        return { variant: 'secondary', text: 'Unknown' };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default TaskPriorityBadge;