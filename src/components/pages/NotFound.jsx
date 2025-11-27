import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mx-auto h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="Search" className="h-12 w-12 text-slate-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Page Not Found</h2>
        
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Button onClick={() => navigate("/")} className="w-full">
            <ApperIcon name="Home" className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/contacts")}
            className="w-full"
          >
            <ApperIcon name="Users" className="h-4 w-4 mr-2" />
            View Contacts
          </Button>

          <Button 
            variant="outline" 
            onClick={() => navigate("/pipeline")}
            className="w-full"
          >
            <ApperIcon name="Workflow" className="h-4 w-4 mr-2" />
            View Pipeline
          </Button>
        </div>
        
        <p className="text-sm text-slate-500 mt-8">
          Need help? Contact support or check our documentation.
        </p>
      </div>
    </div>
  )
}

export default NotFound