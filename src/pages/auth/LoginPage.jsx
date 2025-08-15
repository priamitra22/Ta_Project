import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; // pastikan file logo ada di src/assets/logo.png
import bgImage from "../../assets/bg-school.png"; // gambar background

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    // Simulasi role berdasarkan username
    if (data.username.startsWith("1")) {
      navigate("/admin/dashboard");
    } else if (data.username.startsWith("2")) {
      navigate("/guru/dashboard");
    } else {
      navigate("/orangtua/dashboard");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="card w-96 bg-base-100 shadow-xl p-6 bg-opacity-90 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo Sekolah" className="w-20 h-20" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">
          Sistem Monitoring Nilai Siswa
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Silakan masuk menggunakan akun Anda
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* NIP / NISN */}
          <div>
            <label className="label">
              <span className="label-text">NIP / NISN</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan NIP / NISN"
              className="input input-bordered w-full"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Masukkan Password"
              className="input input-bordered w-full"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
