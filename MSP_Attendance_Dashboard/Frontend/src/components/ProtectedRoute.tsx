import React from 'react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {

  const isAuthenticated : boolean = localStorage.getItem('token') !== null;

  // const isAuthenticated : boolean = true;
  return (
    <>
      {isAuthenticated ? <div>{children}</div> : <div>Access Denied</div>}
    </>
  )
}

export default ProtectedRoute;