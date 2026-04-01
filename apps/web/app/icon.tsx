import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <div
          style={{
            width: 24,
            height: 28,
            borderRadius: 5,
            background: '#ffffff',
            border: '2px solid #5c6ea8',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 6,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -4,
              width: 12,
              height: 6,
              borderRadius: 999,
              border: '2px solid #c6d2f0',
              background: '#eef4ff',
            }}
          />

          <div
            style={{
              width: 15,
              height: 3,
              borderRadius: 999,
              background: '#4f8ff7',
              marginBottom: 2,
            }}
          />
          <div
            style={{
              width: 15,
              height: 3,
              borderRadius: 999,
              background: '#4fc47a',
              marginBottom: 2,
            }}
          />
          <div
            style={{
              width: 15,
              height: 3,
              borderRadius: 999,
              background: '#ffd34f',
              marginBottom: 3,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingLeft: 4 }}>
              <div style={{ width: 3, height: 3, borderRadius: 999, background: '#d6deef' }} />
              <div style={{ width: 10, height: 2, borderRadius: 999, background: '#d6deef' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingLeft: 4 }}>
              <div style={{ width: 3, height: 3, borderRadius: 999, background: '#d6deef' }} />
              <div style={{ width: 9, height: 2, borderRadius: 999, background: '#d6deef' }} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
