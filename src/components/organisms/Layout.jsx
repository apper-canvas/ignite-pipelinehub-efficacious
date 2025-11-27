import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Header from "@/components/organisms/Header"
import ContactModal from "@/components/organisms/ContactModal"
import DealModal from "@/components/organisms/DealModal"
import { useContacts } from "@/hooks/useContacts"
import { useDeals } from "@/hooks/useDeals"
import { usePipelineStages } from "@/hooks/usePipelineStages"

const Layout = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isDealModalOpen, setIsDealModalOpen] = useState(false)
  
  const { contacts, createContact } = useContacts()
  const { deals, createDeal } = useDeals()
  const { stages } = usePipelineStages()

  const handleAddContact = () => {
    setIsContactModalOpen(true)
  }

  const handleAddDeal = () => {
    setIsDealModalOpen(true)
  }

  const handleSaveContact = async (contactData) => {
    await createContact(contactData)
    setIsContactModalOpen(false)
  }

  const handleSaveDeal = async (dealData) => {
    await createDeal(dealData)
    setIsDealModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        onAddContact={handleAddContact}
        onAddDeal={handleAddDeal}
      />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={handleSaveContact}
      />

      <DealModal
        contacts={contacts}
        stages={stages}
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
        onSave={handleSaveDeal}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-50"
      />
    </div>
  )
}

export default Layout