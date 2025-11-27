import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ error = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mx-auto h-24 w-24 bg-error-100 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="AlertTriangle" className="h-12 w-12 text-error-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h1>
        
        <p className="text-slate-600 mb-6">
          {error}
        </p>
        
        <div className="space-y-3">
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
        
        <p className="text-sm text-slate-500 mt-6">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}

export default ErrorView