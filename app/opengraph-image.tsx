import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'LCB Dashboard - Liverpool Cotton Brokers Market Intelligence';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #2C3E50 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Border decoration */}
        <div
          style={{
            position: 'absolute',
            inset: '20px',
            border: '3px solid #D4AF37',
            borderRadius: '24px',
            opacity: 0.6,
          }}
        />

        {/* Logo Text (since we can't easily load the PNG) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* LCB Circle Icon */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#0D1B2A',
                border: '4px solid #D4AF37',
              }}
            >
              LCB
            </div>

            {/* Text */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  color: 'white',
                  lineHeight: 1,
                }}
              >
                Liverpool Cotton Brokers
              </div>
              <div
                style={{
                  fontSize: '36px',
                  color: '#D4AF37',
                  fontWeight: '600',
                }}
              >
                Professional Market Intelligence
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            Track ICE, CZCE, MCX, AWP and global cotton price spreads with advanced analytics
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 32px',
              background: 'rgba(212, 175, 55, 0.2)',
              border: '2px solid #D4AF37',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#D4AF37',
                fontWeight: '600',
              }}
            >
              📊 Real-time Data
            </div>
            <div
              style={{
                width: '3px',
                height: '30px',
                background: '#D4AF37',
                opacity: 0.5,
              }}
            />
            <div
              style={{
                fontSize: '24px',
                color: '#D4AF37',
                fontWeight: '600',
              }}
            >
              📈 20 Years of History
            </div>
            <div
              style={{
                width: '3px',
                height: '30px',
                background: '#D4AF37',
                opacity: 0.5,
              }}
            />
            <div
              style={{
                fontSize: '24px',
                color: '#D4AF37',
                fontWeight: '600',
              }}
            >
              🌍 Global Markets
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
