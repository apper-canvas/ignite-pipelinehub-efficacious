import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ onAddContact, onAddDeal }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Workflow" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">PipelineHub</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path === "" ? "/" : `/${item.path}`)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary-100 text-primary-700 border-b-2 border-primary-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <ApperIcon name={item.icon} className="h-4 w-4" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            <SearchBar
              placeholder="Search contacts and deals..."
              className="hidden md:block w-64"
            />
            
            <div className="hidden sm:flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={onAddContact}>
                <ApperIcon name="UserPlus" className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
              <Button size="sm" onClick={onAddDeal}>
                <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                Add Deal
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path === "" ? "/" : `/${item.path}`)
                    setIsMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary-100 text-primary-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <ApperIcon name={item.icon} className="h-4 w-4" />
                  {item.name}
                </button>
              ))}
            </nav>
            
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={onAddContact} className="flex-1">
                <ApperIcon name="UserPlus" className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
              <Button size="sm" onClick={onAddDeal} className="flex-1">
                <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                Add Deal
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header