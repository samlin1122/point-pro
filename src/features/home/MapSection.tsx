import { useState } from "react"
import {
  Map,
  MapProvider,
  Marker,
  Popup,
} from "react-map-gl"
import { Box, Typography } from "@mui/material"
import { PushPin } from "@mui/icons-material"

import "mapbox-gl/dist/mapbox-gl.css"




const MapSection = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

  const [viewport, setViewport] = useState({
    latitude: 25.0829869,
    longitude: 121.5937946,
    zoom: 17
  })

  const [popupInfo, setPopupInfo] = useState(true)
  const iconPin = <PushPin style={{ fontSize: 20, color: "common.black", zIndex: 999 }} />

  return (
    <>
      <style>
        {`
              .mapboxgl-popup-content {
                border-radius: 1rem;
              }
              `}
      </style>
      <MapProvider>
        <Map
          initialViewState={{
            latitude: viewport.latitude,
            longitude: viewport.longitude,
            zoom: viewport.zoom,
            bearing: 0,
            pitch: 0
          }}
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/huan5678/clh33ifj9008w01r8ea6nfvpd"
          scrollZoom={false}
          doubleClickZoom={false}
          dragRotate={false}
          dragPan={false}
          cursor="default"
          style={{ position: "relative", height: "100vh", width: "100%" }}
        >
          <Marker
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            anchor="top"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setPopupInfo(!popupInfo)
            }}
          >
            {iconPin}
          </Marker>
          {popupInfo && (
            <Popup
              latitude={viewport.latitude}
              longitude={viewport.longitude}
              anchor="bottom"
              onClose={() => setPopupInfo(!popupInfo)}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.5rem" }}>
                <img src="/src/assets/map_logo.svg" alt="logo" />
                <Typography variant="h4" component="h4" fontSize={16} fontWeight={700}>
                  特別的餐飲體驗
                  <br />
                  來自於我們與您的專屬互動
                </Typography>
                <Typography variant="body2" component="p" color="common.black_80">
                  114 台北市內湖區
                  <br />
                  成功路四段145號6樓
                </Typography>
              </Box>
            </Popup>
          )}
        </Map>
      </MapProvider>
    </>
  )
}

export default MapSection