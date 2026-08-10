import MarketMap from "./market-map";

export default function HeroSection() {
  return (
    <section className="py-5">
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 lg:px-0">
        <div className="relative text-center mt-25">
          <h1 className="mx-auto mt-16 max-w-2xl text-balance text-5xl font-[900] md:text-6xl">
            一站式跨境电商服务平台
          </h1>

          <p className="text-muted-foreground mx-auto mb-6 mt-6 text-balance text-sm md:text-xl">
            专业跨境电商服务商,助力商家合规运营、高效出海。
          </p>
        </div>

        <MarketMap />
      </div>
    </section>
  );
}
