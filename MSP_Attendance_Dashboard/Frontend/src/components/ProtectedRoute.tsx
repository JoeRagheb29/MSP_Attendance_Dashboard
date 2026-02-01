import React from 'react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {

  const isAuthenticated : boolean = true; // Replace with real authentication logic

  
  return (
    <>
      {isAuthenticated ? <div>{children}</div> : <div>Access Denied</div>}
    </>
  )
}

export default ProtectedRoute;