"use client";

import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {ArrowRight} from "lucide-react";
import mapboxgl, {type Map as MapboxMap} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import {Button} from "@/components/ui/button";

const markets = [
  {
    id: "us",
    label: "美国",
    coordinates: [-98, 39] as [number, number],
  },
  {
    id: "mx",
    label: "墨西哥",
    coordinates: [-102, 23] as [number, number],
  },
  {
    id: "uk",
    label: "英国",
    coordinates: [-3, 55] as [number, number],
  },
  {
    id: "eu",
    label: "欧盟（12国）",
    coordinates: [11, 50] as [number, number],
  },
  {
    id: "sea",
    label: "东南亚（5国）",
    coordinates: [106, 8] as [number, number],
  },
  {
    id: "jp",
    label: "日本",
    coordinates: [138, 37] as [number, number],
  },
] as const;

type Market = (typeof markets)[number];

export default function MarketMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [activeMarket, setActiveMarket] = useState<Market | null>(null);
  const [cardPosition, setCardPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) return;

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      center: [20, 25],
      zoom: 0.8,
      minZoom: 0.6,
      maxZoom: 3.5,
      scrollZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      style: "mapbox://styles/mapbox/light-v11",
    });

    map.on("load", () => {
      // 隐藏底图文字，保留市场标记与网站自身的信息层。
      map.getStyle().layers?.forEach((layer) => {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      markets.forEach((market) => {
        const marker = document.createElement("button");
        marker.type = "button";
        marker.title = market.label;
        marker.setAttribute("aria-label", `查看${market.label}服务`);
        marker.className =
          "group relative flex size-7 items-center justify-center rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black";
        marker.innerHTML =
          '<span class="market-marker-pulse"></span><span class="relative size-2.5 rounded-full bg-black ring-4 ring-black/15 transition-transform group-hover:scale-125"></span>';
        marker.addEventListener("click", (event) => {
          event.stopPropagation();
          setActiveMarket(null);
          setCardPosition(null);

          map.flyTo({
            center: market.coordinates,
            zoom: Math.max(map.getZoom(), 0.9),
            duration: 900,
            essential: true,
          });

          map.once("moveend", () => {
            const point = map.project(market.coordinates);
            const mapWidth = containerRef.current?.clientWidth ?? 0;
            const mapHeight = containerRef.current?.clientHeight ?? 0;

            setActiveMarket(market);
            setCardPosition({
              left: Math.min(point.x + 16, Math.max(16, mapWidth - 240)),
              top: Math.min(point.y + 16, Math.max(16, mapHeight - 64)),
            });
          });
        });

        new mapboxgl.Marker({element: marker, anchor: "center"})
          .setLngLat(market.coordinates)
          .addTo(map);
      });

      setMapReady(true);
    });

    map.on("click", () => {
      setActiveMarket(null);
      setCardPosition(null);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative mt-20">
      <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-full bg-background/80 px-3 py-2 text-xs font-medium text-foreground/80 backdrop-blur-sm">
        服务覆盖 6 个市场 · 点击黑色站点查看
      </div>
      <div
        ref={containerRef}
        className="h-80 w-full cursor-grab active:cursor-grabbing sm:h-[29rem]"
      />
      {!mapReady && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          正在加载服务覆盖地图…
        </div>
      )}
      {activeMarket && cardPosition && (
        <div
          className="absolute z-10 flex w-56 items-center justify-between rounded-xl border bg-background/75 p-2 text-left shadow-lg backdrop-blur-md motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-300"
          style={{left: cardPosition.left, top: cardPosition.top}}
        >
          <p className="text-[14px] font-semibold">{activeMarket.label}</p>
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            render={<Link href="/services/onboarding" />}
          >
            查看服务
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
}
