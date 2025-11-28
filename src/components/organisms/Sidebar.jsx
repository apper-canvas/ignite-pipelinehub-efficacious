import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

const navigationItems = [
    {
      path: '/',
      icon: 'BarChart3',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/companies',
      icon: 'Building2',
      label: 'Companies'
    },
    {
      path: '/contacts',
      icon: 'Users',
      label: 'Contacts'
    },
    {
      path: '/pipeline',
      icon: 'GitBranch',
      label: 'Pipeline'
    },
    {
      path: '/activities',
      icon: 'Activity',
      label: 'Activities'
    },
    {
      path: '/quotes',
      icon: 'FileText',
      label: 'Quotes'
    },
    {
      path: '/sales-orders',
      icon: 'ShoppingCart',
      label: 'Sales Orders'
    },
    {
      path: '/tasks',
      icon: 'CheckSquare',
      label: 'Tasks'
    }
  ];

  return (
    <div className={cn(
      "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col h-full",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-slate-900">PipelineHub</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ApperIcon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-primary-100 text-primary-700 border border-primary-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <ApperIcon
                  name={item.icon}
                  size={20}
                  className={cn(
                    "flex-shrink-0",
                    isCollapsed ? "mr-0" : "mr-3"
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-xs text-slate-500">© 2024 PipelineHub</p>
              <p className="text-xs text-slate-400">CRM System</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;