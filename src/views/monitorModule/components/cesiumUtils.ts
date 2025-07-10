declare const Cesium: any;

const LayerTypes = ['img_w', 'vec_w', 'ter_w', 'ibo_w', 'cva_w', 'cia_w', 'cta_w'];

// 天地图token，建议自己注册申请一个
const token = '9fd6e9c2c2014dd79ee58c711d1d0a62';

export function addTiandituWmtsLayer(viewer: any, val: string) {
  if (LayerTypes.includes(val)) {
    const [layer, style] = val.split('_');
    const provider = new Cesium.WebMapTileServiceImageryProvider({
      url:
        `https://{s}.tianditu.gov.cn/${val}/wmts` +
        `?SERVICE=WMTS` +
        `&REQUEST=GetTile` +
        `&VERSION=1.0.0` +
        `&LAYER=${layer}` +
        `&STYLE=default` +
        `&TILEMATRIXSET=${style}` +
        `&FORMAT=tiles` +
        `&TILEMATRIX={TileMatrix}` +
        `&TILEROW={TileRow}` +
        `&TILECOL={TileCol}` +
        `&tk=${token}`,
      layer,
      style: 'default',
      format: 'tiles',
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
      tileMatrixSetID: style,
      // 天地图在大于18级时会画蛇添足地显示「该区域无影像」，太难看了，只好牺牲所有18级以上的数据，主要影响城市区域的清晰度
      maximumLevel: 18,
    });
    const layerObj = viewer.imageryLayers.addImageryProvider(provider);
    return {
      get visible() {
        return layerObj.show;
      },
      set visible(value: boolean) {
        layerObj.show = value;
      },
    };
  }
}

export function addTiandituElevation(viewer: any) {
  const tiandituTerrainProvider = new Cesium.GeoTerrainProvider({
    urls: [
      `https://t0.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=${token}`,
      `https://t1.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=${token}`,
      `https://t2.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=${token}`,
      `https://t3.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=${token}`,
      `https://t4.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=${token}`,
      `https://t5.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=${token}`,
      `https://t6.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=${token}`,
      `https://t7.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=${token}`,
    ],
  });
  viewer.terrainProvider = tiandituTerrainProvider;
  const ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider();
  return {
    get visible() {
      return viewer.terrainProvider !== ellipsoidTerrainProvider;
    },
    set visible(value: boolean) {
      viewer.terrainProvider = value ? tiandituTerrainProvider : ellipsoidTerrainProvider;
    },
  };
}
