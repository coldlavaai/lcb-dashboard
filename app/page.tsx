import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A2332] via-[#2C3E50] to-[#34495E] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-center border border-[#D4AF37]/20">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#D4AF37] mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
            Liverpool Cotton Brokers
          </h1>
          <p className="text-white/80 text-xl">Cotton Analysis Dashboard</p>
        </div>

        <p className="text-white/90 text-lg mb-8 leading-relaxed">
          Professional cotton market analysis and trading intelligence
        </p>

        <Link
          href="/dashboard"
          className="inline-block px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-[#1A2332] font-bold rounded-lg hover:from-[#F4C430] hover:to-[#D4AF37] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
        >
          Enter Dashboard →
        </Link>

        <p className="text-white/60 text-sm mt-8">
          Built by Cold Lava • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
