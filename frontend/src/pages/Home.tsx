import { Button } from '../components/Button';
import { Card, CardContent, CardTitle } from '../components/Card';

export function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="bg-gradient-to-r from-espresso via-arabica to-espresso text-cream py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="text-9xl text-gold text-center">☕</div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 font-serif leading-tight">
            Do Paralelo 14 para sua xícara
          </h1>
          <p className="text-2xl mb-12 font-light text-parchment">
            Altitude, origem e cuidado em cada grão.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="gold" className="text-lg px-8">Explorar Catálogo</Button>
            <Button variant="secondary" className="text-lg px-8">Sobre Nós</Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-espresso mb-4 text-center font-serif">Por que Paralelo 14?</h2>
        <p className="text-center text-arabica mb-16 text-lg max-w-2xl mx-auto">
          Cultivamos cafés de altitude na Chapada dos Veadeiros, onde cada grão conta uma história.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:bg-white">
            <CardContent>
              <div className="text-6xl mb-6 text-center">🏔️</div>
              <CardTitle>Altitude Premium</CardTitle>
              <p className="text-arabica mt-4 leading-relaxed">
                Cultivados a 1.200m na Chapada dos Veadeiros, concentrando açúcares e complexidade sensorial única ao mundo.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:bg-white">
            <CardContent>
              <div className="text-6xl mb-6 text-center">🌿</div>
              <CardTitle>Origem Rastreável</CardTitle>
              <p className="text-arabica mt-4 leading-relaxed">
                Cada lote é documentado desde o plantio até sua xícara. Saiba exatamente de onde vem seu café.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:bg-white">
            <CardContent>
              <div className="text-6xl mb-6 text-center">👨‍🌾</div>
              <CardTitle>Produtor Direto</CardTitle>
              <p className="text-arabica mt-4 leading-relaxed">
                Relacionamento direto com famílias produtoras. Preço justo e sustentabilidade em primeira mão.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-parchment py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold text-espresso mb-6 text-center font-serif">O que Oferecemos</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-arabica mb-4">Cafés de Especialidade</h3>
              <ul className="space-y-3 text-arabica">
                <li className="flex items-center gap-3">
                  <span className="text-gold text-2xl">✓</span>
                  <span>Diferentes torras e processos</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold text-2xl">✓</span>
                  <span>Notas de sabor documentadas</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold text-2xl">✓</span>
                  <span>Moagem personalizada</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold text-2xl">✓</span>
                  <span>Entrega em 48 horas</span>
                </li>
              </ul>
            </div>
            <div className="bg-espresso rounded-xl p-8 text-cream text-center">
              <div className="text-7xl mb-4">☕</div>
              <p className="text-lg font-serif mb-6">
                "A excelência está em cada grão"
              </p>
              <p className="text-sm text-opacity-80">
                Paralelo 14 — desde 2020
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-espresso mb-8 font-serif">Novas Chegadas</h2>
        <p className="text-arabica mb-12 text-lg">Confira nossas seleções exclusivas de altitude</p>
        <Button variant="primary" className="text-lg px-8">Ver Catálogo Completo</Button>
      </section>

      <footer className="bg-espresso text-cream py-8 border-t-4 border-gold">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2 font-serif text-lg text-gold">Paralelo 14 Cafés Especiais</p>
          <p className="text-sm text-opacity-70">Do Paralelo 14 para sua xícara — altitude, origem e cuidado em cada grão</p>
        </div>
      </footer>
    </div>
  );
}
