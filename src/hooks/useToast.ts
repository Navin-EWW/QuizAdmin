import { toast } from 'react-toastify'

const UseToast = (message: string, type: 'error' | 'warning' | 'success' = 'success') => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export default UseToast