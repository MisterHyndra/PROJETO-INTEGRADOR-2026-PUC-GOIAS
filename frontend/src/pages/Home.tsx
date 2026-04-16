import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import banner1 from '../img/1.webp';
import banner2 from '../img/2.webp';
import banner3 from '../img/3.webp';

const banners = [
  {
    id: '01',
    image: banner1,
    eyebrow: 'Microlotes Goianos',
    title: 'Altitude, acidez delicada e docura limpa.',
    description:
      'Graos de altitude com visual mais refinado para apresentar o Paralelo 14 com mais identidade e atmosfera.',
  },
  {
    id: '02',
    image: banner2,
    eyebrow: 'Origem Rastreavel',
    title: 'Lotes selecionados para uma experiencia mais autoral.',
    description:
      'Cada banner reforca o cuidado com processo, torra e leitura sensorial, sem deixar a home pesada.',
  },
  {
    id: '03',
    image: banner3,
    eyebrow: 'Colecao da Casa',
    title: 'Um hero mais vivo, conectado ao wireframe.',
    description:
      'Os indicadores 01 02 03 agora comandam o destaque principal e deixam a home mais proxima do prototipo.',
  },
];

export function Home() {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  const currentBanner = banners[activeBanner];

  return (
    <div className="min-h-screen bg-[#f5f1e9] text-espresso">
      <section className="border-b border-[#d9d1c4] bg-[#f7f3eb]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-6 text-xs uppercase tracking-[0.35em] text-arabica/80">
                Paralelo 14 Cafes Especiais
              </p>
              <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] text-espresso md:text-7xl">
                Do cerrado de altitude para uma rotina mais lenta, limpa e memoravel.
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-arabica">
                Uma curadoria de cafes especiais inspirada na Chapada dos Veadeiros, com lotes de
                origem, torra elegante e uma experiencia visual mais editorial.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/catalogo">
                <Button className="px-7 py-3">Comprar cafes</Button>
              </Link>
              <a href="#colecoes">
                <Button
                  variant="outline"
                  className="border-[#b8ad9d] bg-transparent px-7 py-3 text-espresso hover:border-espresso hover:bg-[#eee6da]"
                >
                  Ver colecoes
                </Button>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="overflow-hidden border border-[#d8d0c4] bg-white shadow-[0_24px_80px_rgba(58,38,24,0.12)]">
              <div className="relative min-h-[360px] overflow-hidden bg-[linear-gradient(135deg,#efe6d7_0%,#e3d5c0_45%,#b98e58_100%)]">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,239,231,0.18)_0%,rgba(92,61,30,0.08)_100%)]" />

                <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-8 text-espresso">
                  <p className="text-right text-xs uppercase tracking-[0.3em] text-espresso/85">
                    {currentBanner.eyebrow}
                  </p>

                  <div className="max-w-sm bg-[#f6efe4]/78 p-5 backdrop-blur-[2px]">
                    <h2 className="font-serif text-3xl leading-tight md:text-4xl">
                      {currentBanner.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-espresso/80">
                      {currentBanner.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 border-t border-[#e4dbcf] bg-[#fbf8f2] py-4 text-sm font-semibold text-espresso">
                {banners.map((banner, index) => (
                  <button
                    key={banner.id}
                    onClick={() => setActiveBanner(index)}
                    className={`transition-colors ${activeBanner === index ? 'text-espresso' : 'text-arabica/50'}`}
                    aria-label={`Exibir banner ${banner.id}`}
                  >
                    {banner.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between gap-4 border border-[#d8d0c4] bg-white p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-arabica/70">
                  Selecao da semana
                </p>
                <h2 className="mt-3 font-serif text-3xl">Chapada Honey</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-arabica">
                  Corpo sedoso, notas de mel e frutas amarelas, pensado para quem quer um cafe mais
                  solar.
                </p>
              </div>
              <Link
                to="/catalogo"
                className="text-sm font-semibold text-espresso underline underline-offset-4"
              >
                Explorar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="colecoes" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-arabica/70">Shop by Collection</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Colecoes que contam a origem.
            </h2>
          </div>
          <Link to="/catalogo" className="text-sm font-semibold uppercase tracking-[0.18em] text-espresso">
            Ver catalogo completo
          </Link>
        </div>

        <div className="grid gap-px overflow-hidden border border-[#dad2c6] bg-[#dad2c6] md:grid-cols-3">
          <article className="bg-[#f8f4ed] p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-arabica/70">Altitude</p>
            <h3 className="mt-6 font-serif text-3xl">Acima de 1.200m</h3>
            <p className="mt-4 text-sm leading-7 text-arabica">
              Lotes mais doces, mais lentos na maturacao e com aroma mais complexo para coados
              delicados.
            </p>
          </article>
          <article className="bg-white p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-arabica/70">Processos</p>
            <h3 className="mt-6 font-serif text-3xl">Natural, Honey e Lavado</h3>
            <p className="mt-4 text-sm leading-7 text-arabica">
              Perfis sensoriais diferentes para quem quer ir do chocolate e melao ate flores e
              citricos.
            </p>
          </article>
          <article className="bg-[#f1e9dd] p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-arabica/70">Assinatura</p>
            <h3 className="mt-6 font-serif text-3xl">Curadoria Paralelo 14</h3>
            <p className="mt-4 text-sm leading-7 text-arabica">
              Cafes com visual premium, rastreabilidade e uma narrativa inspirada no ritmo do Blue
              Bottle.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-[#ebe3d5]">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 py-0 lg:grid-cols-2 lg:px-8">
          <div className="flex min-h-[420px] flex-col justify-center border-x border-[#d5cbbd] bg-[#f7f3ec] p-10 md:p-14">
            <p className="text-xs uppercase tracking-[0.32em] text-arabica/70">Nossa proposta</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Menos excesso, mais respiro, textura e cafe de origem.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-arabica">
              A home agora segue uma logica mais editorial inspirada no Blue Bottle: titulos
              amplos, blocos limpos, muito espaco negativo e secoes que deixam o produto e a
              historia respirarem.
            </p>
          </div>
          <div className="flex min-h-[420px] flex-col justify-center bg-[radial-gradient(circle_at_top,#f7f2ea_0%,#e3d6c2_55%,#b98b59_100%)] p-10 text-espresso md:p-14">
            <div className="text-8xl opacity-70">✦</div>
            <p className="mt-8 max-w-md text-sm uppercase tracking-[0.25em] text-espresso/70">
              Para quem compra cafe como ritual
            </p>
            <p className="mt-6 max-w-lg font-serif text-3xl leading-snug">
              “Do Paralelo 14 para sua xicara” agora soa mais premium, leve e internacional.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="text-xs uppercase tracking-[0.32em] text-arabica/70">Highlights</p>
            <h2 className="mt-4 font-serif text-4xl">Por que comprar aqui</h2>
          </div>
          <div className="grid gap-px border border-[#ddd4c7] bg-[#ddd4c7] md:col-span-2 md:grid-cols-3">
            <div className="bg-white p-6">
              <h3 className="font-serif text-2xl">Origem rastreavel</h3>
              <p className="mt-3 text-sm leading-7 text-arabica">
                Cada lote conecta altitude, produtor e processo.
              </p>
            </div>
            <div className="bg-[#f8f3ea] p-6">
              <h3 className="font-serif text-2xl">Entrega elegante</h3>
              <p className="mt-3 text-sm leading-7 text-arabica">
                Checkout simples, status em tempo real e embalagem premium.
              </p>
            </div>
            <div className="bg-white p-6">
              <h3 className="font-serif text-2xl">Curadoria autoral</h3>
              <p className="mt-3 text-sm leading-7 text-arabica">
                Selecao pensada para quem gosta de cafe e design ao mesmo tempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#ddd3c6] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-arabica/70">Ready to brew</p>
            <h2 className="mt-3 font-serif text-4xl">Entre no catalogo e escolha seu lote.</h2>
          </div>
          <Link to="/catalogo">
            <Button className="px-7 py-3">Comprar agora</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#d8d0c4] bg-[#f7f3eb] py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-arabica md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="font-serif text-xl text-espresso">Paralelo 14 Cafes Especiais</p>
          <p>Do Paralelo 14 para sua xicara, com altitude, origem e cuidado em cada grao.</p>
        </div>
      </footer>
    </div>
  );
}
