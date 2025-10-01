import { useForm } from 'react-hook-form';
import { registerUser, loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth()!;
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);

      // Auto-login after register
      const loginRes = await loginUser({ email: data.email, password: data.password });
      login(loginRes.data.token);

      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      <input {...register('email')} type="email" placeholder="Email" />
      <input {...register('password')} type="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}