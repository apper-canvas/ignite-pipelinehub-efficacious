import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

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
    <header
    className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
    <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div
                        className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Workflow" className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">PipelineHub</h1>
                </div>
                {/* Desktop Navigation */}
{/* Navigation moved to Sidebar */}
            </div>
            {/* Search and Actions */}
            <div className="flex items-center gap-4">
                <SearchBar
                    placeholder="Search contacts and deals..."
                    className="hidden md:block w-64" />
                <div className="hidden sm:flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={onAddContact}>
                        <ApperIcon name="UserPlus" className="h-4 w-4 mr-1" />Add Contact
                                      </Button>
                    <Button size="sm" onClick={onAddDeal}>
                        <ApperIcon name="Plus" className="h-4 w-4 mr-1" />Add Deal
                                      </Button>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        import("@/layouts/Root").then((
                            {
                                useAuth
                            }
                        ) => {
                            window.location.href = "/login";
                        });
                    }}
                    className="text-slate-600">
                    <ApperIcon name="LogOut" className="h-4 w-4 mr-1" />Logout
                                </Button>
            </div>
{/* Mobile Menu Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100">
                <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && <div className="md:hidden mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={onAddContact} className="flex-1">
                    <ApperIcon name="UserPlus" className="h-4 w-4 mr-1" />Add Contact
                                  </Button>
                <Button size="sm" onClick={onAddDeal} className="flex-1">
                    <ApperIcon name="Plus" className="h-4 w-4 mr-1" />Add Deal
                                  </Button>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = "/login"}
                    className="w-full text-slate-600">
                    <ApperIcon name="LogOut" className="h-4 w-4 mr-1" />Logout
                                  </Button>
            </div>
        </div>}
    </div>)
          
        </header>
  )
}

export default Header