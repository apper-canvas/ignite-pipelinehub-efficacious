import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { name: "Dashboard", path: "", icon: "BarChart3" },
    { name: "Pipeline", path: "pipeline", icon: "Workflow" },
    { name: "Contacts", path: "contacts", icon: "Users" },
    { name: "Activities", path: "activities", icon: "Activity" },
  ]

  const isActive = (path) => {
    const currentPath = location.pathname === "/" ? "" : location.pathname.slice(1)
    return currentPath === path
  }

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-slate-200"
      >
        <ApperIcon name={isCollapsed ? "Menu" : "X"} className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        lg:translate-x-0 flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">PipelineHub</h2>
          </div>
          
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 rounded-lg hover:bg-slate-100"
          >
            <ApperIcon name="ChevronLeft" className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path === "" ? "/" : `/${item.path}`)
                // Close mobile menu after navigation
                if (window.innerWidth < 1024) {
                  setIsCollapsed(true)
                }
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive(item.path) 
                  ? "bg-primary-100 text-primary-700 border-l-4 border-primary-600" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }
              `}
            >
              <ApperIcon name={item.icon} className="h-5 w-5 flex-shrink-0" />
              <span className={isCollapsed ? 'lg:hidden' : ''}>{item.name}</span>
            </button>
          ))}
        </nav>

{/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <ApperIcon name="Settings" className="h-4 w-4" />
            <span className={isCollapsed ? 'lg:hidden' : ''}>Settings</span>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900 bg-opacity-50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}

export default Sidebar