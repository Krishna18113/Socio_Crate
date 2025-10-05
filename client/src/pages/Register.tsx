import { useForm } from 'react-hook-form';
import { registerUser, loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);

      // Auto-login after register
      const loginRes = await loginUser({ email: data.email, password: data.password });
      login(loginRes.data.token);

      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              {...register('name')}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-200 shadow-md"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:underline cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}


// import { useForm } from 'react-hook-form';
// import { registerUser, loginUser } from '../api/auth';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//   const { register, handleSubmit } = useForm();
//   const { login } = useAuth()!;
//   const navigate = useNavigate();

//   const onSubmit = async (data: any) => {
//     try {
//       await registerUser(data);

//       // Auto-login after register
//       const loginRes = await loginUser({ email: data.email, password: data.password });
//       login(loginRes.data.token);

//       navigate('/dashboard');
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input {...register('name')} placeholder="Name" />
//       <input {...register('email')} type="email" placeholder="Email" />
//       <input {...register('password')} type="password" placeholder="Password" />
//       <button type="submit">Register</button>
//     </form>
//   );
// }