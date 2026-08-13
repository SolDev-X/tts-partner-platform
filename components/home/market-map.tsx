"use client";

import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {ArrowRight} from "lucide-react";
import mapboxgl, {type Map as MapboxMap} from "mapbox-gl";
import type {FeatureCollection, Point} from "geojson";

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

const marketGeoJson: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: markets.map((market) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: market.coordinates,
    },
    properties: {
      id: market.id,
    },
  })),
};

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

    const container = containerRef.current;

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!accessToken) return;

    let animationFrame: number | undefined;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    let lastFrameTime: number | undefined;

    let isPointerOver = false;
    let isInteracting = false;
    let isCardOpen = false;
    let isVisible = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const canRotate = () =>
      !reducedMotion.matches &&
      !document.hidden &&
      isVisible &&
      !isPointerOver &&
      !isInteracting &&
      !isCardOpen;

    const rotate = (time: number) => {
      if (canRotate()) {
        const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 50) : 0;

        const center = map.getCenter();

        map.setCenter([center.lng - (elapsed * 360) / 60000, center.lat]);
      }

      lastFrameTime = time;
      animationFrame = requestAnimationFrame(rotate);
    };

    const pauseRotation = () => {
      if (resumeTimer) {
        clearTimeout(resumeTimer);
      }

      lastFrameTime = undefined;
    };

    const resumeRotationAfterDelay = () => {
      pauseRotation();

      resumeTimer = setTimeout(() => {
        isInteracting = false;
        lastFrameTime = undefined;
      }, 2000);
    };

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container,
      center: [20, 25],
      zoom: 0.8,
      minZoom: 0.6,
      maxZoom: 3.5,
      scrollZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      style: "mapbox://styles/mapbox/light-v11",
    });

    mapRef.current = map;

    map.once("load", () => {
      /*
       * 地球外围背景颜色
       */
      map.setFog({
        color: "#f5f5f5",
        "high-color": "#f5f5f5",
        "space-color": "#f5f5f5",
        "horizon-blend": 0,
        "star-intensity": 0,
      });

      /*
       * Mapbox 地图本身的背景颜色
       */
      const backgroundLayer = map
        .getStyle()
        .layers?.find((layer) => layer.type === "background");

      if (backgroundLayer) {
        map.setPaintProperty(backgroundLayer.id, "background-color", "#f5f5f5");
      }

      /*
       * 隐藏国家名称、城市名称等底图文字
       */
      map.getStyle().layers?.forEach((layer) => {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      /*
       * 添加市场 GeoJSON 数据
       */
      if (!map.getSource("markets")) {
        map.addSource("markets", {
          type: "geojson",
          data: marketGeoJson,
        });
      }

      /*
       * 添加市场黑色站点
       */
      if (!map.getLayer("market-points")) {
        map.addLayer({
          id: "market-points",
          type: "circle",
          source: "markets",

          paint: {
            "circle-radius": 6,
            "circle-color": "#000000",
            "circle-stroke-width": 5,
            "circle-stroke-color": "rgba(0, 0, 0, 0.15)",
          },
        });
      }

      /*
       * 鼠标进入站点
       */
      map.on("mouseenter", "market-points", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      /*
       * 鼠标离开站点
       */
      map.on("mouseleave", "market-points", () => {
        map.getCanvas().style.cursor = "";
      });

      /*
       * 点击市场站点
       */
      map.on("click", "market-points", (event) => {
        const id = event.features?.[0]?.properties?.id;

        const market = markets.find((item) => item.id === id);

        if (!market) return;

        event.originalEvent.stopPropagation();

        isCardOpen = true;
        isInteracting = false;

        pauseRotation();

        setActiveMarket(null);
        setCardPosition(null);

        /*
         * 点击后飞到对应市场
         */
        map.flyTo({
          center: market.coordinates,
          zoom: Math.max(map.getZoom(), 0.9),
          duration: 900,
          essential: true,
        });

        /*
         * 地图移动结束后显示服务卡片
         */
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

      /*
       * 地图初始化完成
       */
      setMapReady(true);

      /*
       * 开始自动旋转
       */
      animationFrame = requestAnimationFrame(rotate);
    });

    /*
     * 点击地图空白区域关闭市场卡片
     */
    map.on("click", (event) => {
      if (
        map.getLayer("market-points") &&
        map.queryRenderedFeatures(event.point, {
          layers: ["market-points"],
        }).length > 0
      ) {
        return;
      }

      isCardOpen = false;

      setActiveMarket(null);
      setCardPosition(null);

      resumeRotationAfterDelay();
    });

    /*
     * 拖拽时停止旋转
     */
    map.on("dragstart", () => {
      isInteracting = true;
      pauseRotation();
    });

    map.on("dragend", resumeRotationAfterDelay);

    /*
     * 缩放时停止旋转
     */
    map.on("zoomstart", () => {
      isInteracting = true;
      pauseRotation();
    });

    map.on("zoomend", resumeRotationAfterDelay);

    /*
     * 鼠标进入地图时停止旋转
     */
    const handlePointerEnter = () => {
      isPointerOver = true;
      pauseRotation();
    };

    /*
     * 鼠标离开地图后恢复
     */
    const handlePointerLeave = () => {
      isPointerOver = false;
      lastFrameTime = undefined;
    };

    /*
     * 浏览器 Tab 可见性变化
     */
    const handleVisibilityChange = () => {
      lastFrameTime = undefined;
    };

    /*
     * 系统动画偏好变化
     */
    const handleMotionPreferenceChange = () => {
      lastFrameTime = undefined;
    };

    container.addEventListener("pointerenter", handlePointerEnter);

    container.addEventListener("pointerleave", handlePointerLeave);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    reducedMotion.addEventListener("change", handleMotionPreferenceChange);

    /*
     * 地图离开屏幕时暂停旋转
     */
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        lastFrameTime = undefined;
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(container);

    /*
     * 组件卸载时清理
     */
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      if (resumeTimer) {
        clearTimeout(resumeTimer);
      }

      observer.disconnect();

      container.removeEventListener("pointerenter", handlePointerEnter);

      container.removeEventListener("pointerleave", handlePointerLeave);

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);

      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative mt-20">
      {/* 地图左上角提示 */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-full bg-background/80 px-3 py-2 text-xs font-medium text-foreground/80 backdrop-blur-sm">
        服务覆盖 6 个市场 · 点击黑色站点查看
      </div>

      {/* Mapbox 地图容器 */}
      <div
        ref={containerRef}
        className="h-80 w-full cursor-grab active:cursor-grabbing sm:h-[29rem]"
      />

      {/* 加载状态 */}
      {!mapReady && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          正在加载服务覆盖地图…
        </div>
      )}

      {/* 点击市场后的服务卡片 */}
      {activeMarket && cardPosition && (
        <div
          className="absolute z-10 flex w-56 items-center justify-between rounded-xl border bg-background/75 p-2 text-left shadow-lg backdrop-blur-md motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-300"
          style={{
            left: cardPosition.left,
            top: cardPosition.top,
          }}
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
