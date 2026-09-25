/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Izinkan akses dev server dari perangkat lain di jaringan lokal yang sama
  // (mis. buka dari HP lewat http://192.168.x.x:3000 untuk tes tampilan mobile).
  // Sesuaikan/tambahkan IP di sini kalau alamat lokal kamu beda.
  allowedDevOrigins: ["192.168.1.51", "localhost", "127.0.0.1"],
};

export default nextConfig;
