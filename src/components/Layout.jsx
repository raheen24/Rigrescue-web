import React, { useState, useEffect } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { useModal } from './ModalContext'
import LogoutModal from './LogoutModal'

const DashboardLayout = () => {
      const [isSideBarOpen, setIsSideBarOpen] = useState(true)
       const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200)
       const { isModalOpen } = useModal()
       const [logoutModalOpen, setLogoutModalOpen] = useState(false)

      useEffect(() => {
          const handleResize = () => {
              const mobile = window.innerWidth < 1281
              setIsMobile(mobile)
              if (mobile) {
                  setIsSideBarOpen(false)
              } else {
                  setIsSideBarOpen(true)
              }
          }
          window.addEventListener('resize', handleResize)
          handleResize()
          return () => window.removeEventListener('resize', handleResize)
      }, [])

      const toggleSidebar = () => {
          setIsSideBarOpen(prev=>!prev)
      }

      const closeSidebar = () => {
          setIsSideBarOpen(false)
      }

      return (
          <>
              <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSideBarOpen} isMobile={isMobile}/>
              <Sidebar isSideBarOpen={(isModalOpen || logoutModalOpen) ? false : isSideBarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} isMobile={isMobile} logoutModalOpen={logoutModalOpen} setLogoutModalOpen={setLogoutModalOpen}/>
              <Outlet context={isSideBarOpen}/>
              <LogoutModal open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} onConfirm={() => setLogoutModalOpen(false)} />
          </>
      )
  }

export default DashboardLayout