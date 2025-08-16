import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaExclamationCircle, FaSpinner } from "react-icons/fa";
import logo from "../../assets/logo.png";
import bgImage from "../../assets/bg-school.png";

// Schema validasi
const loginSchema = z.object({
  username: z
    .string()
    .regex(/^[0-9]+$/, "NIP / NISN hanya boleh berisi angka")
    .min(5, "NIP / NISN minimal 5 digit"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    // Simulasi delay loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulasi role berdasarkan username
    if (data.username.startsWith("1")) {
      navigate("/admin/dashboard");
    } else if (data.username.startsWith("2")) {
      navigate("/guru/dashboard");
    } else {
      navigate("/orangtua/dashboard");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
                 <div className="absolute inset-0"></div>
      </div>
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
                     {/* Login card */}
           <div className="bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30 relative">
             {/* Additional white overlay for extra focus */}
             <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-3xl pointer-events-none"></div>
                         {/* Logo and Title inside form */}
             <div className="text-center mb-6 relative z-10">
              <div className="inline-block mb-3">
                <img 
                  src={logo} 
                  alt="Logo Sekolah" 
                  className="w-28 h-28" 
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Sistem Monitoring Nilai Siswa
              </h1>
              <p className="text-sm text-gray-500">
                Masuk menggunakan NIP/NISN
              </p>
            </div>

                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              {/* Username */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">NIP / NISN</label>

  <div className="relative">
    <input
      type="text"
      placeholder="Masukkan NIP / NISN"
      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 transition-all duration-200 bg-white/80 backdrop-blur-sm"
      {...register("username")}
    />
    {/* Ikon ditaruh SETELAH input + z-index tinggi */}
    <FaUser
      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400
                 pointer-events-none z-20"
      aria-hidden="true"
    />
  </div>

  {errors.username && (
    <p className="text-red-500 text-sm flex items-center mt-1">
      <FaExclamationCircle className="w-4 h-4 mr-1" />
      {errors.username.message}
    </p>
  )}
</div>

{/* Password */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">Password</label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Masukkan Password"
      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 transition-all duration-200 bg-white/80 backdrop-blur-sm"
      {...register("password")}
    />
    {/* Ikon kunci */}
    <FaLock
      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400
                 pointer-events-none z-20"
      aria-hidden="true"
    />
    {/* Toggle show/hide */}
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
    >
      {showPassword ? (
        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      ) : (
        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      )}
    </button>
  </div>

  {errors.password && (
    <p className="text-red-500 text-sm flex items-center mt-1">
      <FaExclamationCircle className="w-4 h-4 mr-1" />
      {errors.password.message}
    </p>
  )}
</div>

              {/* Submit button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Memproses...
                  </div>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

                         {/* Footer info */}
             <div className="mt-6 text-center relative z-10">
              <p className="text-xs text-gray-500">
                Sistem Monitoring Nilai Siswa © 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
