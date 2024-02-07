import { Navigate } from 'react-router-dom'

const PublicRouter = ({ authenticatedPath, outlet }: PublicRouteProps) => {
  const isAuthenticated = Boolean(localStorage.getItem('userToken'))
  if (!isAuthenticated) return outlet

  return (
    <Navigate
      to={{
        pathname: authenticatedPath,
      }}
      replace
    />
  )
}

export default PublicRouter

export type PublicRouteProps = {
  authenticatedPath: string
  outlet: JSX.Element
}
