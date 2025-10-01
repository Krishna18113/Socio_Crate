import { useForm } from 'react-hook-form';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth()!;
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const res = await loginUser(data);
      login(res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" placeholder="Email" />
      <input {...register('password')} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}