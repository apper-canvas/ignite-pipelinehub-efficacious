import React, { useState } from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ placeholder = "Search...", onSearch, className }) => {
  const [query, setQuery] = useState("")

  const handleSearch = (value) => {
    setQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <ApperIcon
        name="Search"
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

export default SearchBar