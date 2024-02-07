/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

function Register() {
  const { token } = useAuthStore();
  const navigate = useNavigate()
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [])
  return (
    <div>Register</div>
  )
}

export default Register