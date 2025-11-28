import React from 'react';
import Badge from '@/components/atoms/Badge';

const TaskStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Open':
        return { variant: 'secondary', text: 'Open' };
      case 'InProgress':
        return { variant: 'primary', text: 'In Progress' };
      case 'Completed':
        return { variant: 'success', text: 'Completed' };
      case 'Blocked':
        return { variant: 'error', text: 'Blocked' };
      default:
        return { variant: 'secondary', text: 'Unknown' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default TaskStatusBadge;