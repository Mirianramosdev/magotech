export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-black via-gray-900 to-black py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Content */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl lg:text-6xl leading-tight">
              Tecnologia que
              <span className="text-green-500 block">Transforma</span>
              Sua Vida
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Descubra os mais avançados dispositivos tecnológicos com qualidade premium 
              e preços que cabem no seu bolso.
            </p>
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
    </section>
  );
}