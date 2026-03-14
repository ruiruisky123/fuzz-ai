interface CrisisBannerProps {
  visible: boolean
}

export function CrisisBanner({ visible }: CrisisBannerProps) {
  if (!visible) return null

  return (
    <div style={{
      background: '#FFF0EE',
      borderLeft: '4px solid #FF4D4F',
      borderRadius: '12px',
      padding: '12px 16px',
      margin: '8px 0',
    }}>
      <p style={{ fontSize: '12px', color: '#7A6A52', lineHeight: '1.7' }}>
        如果你现在很痛苦，你不是一个人。<br />
        北京心理危机研究与干预中心：<strong>010-82951332</strong>（24小时）<br />
        全国心理援助热线：<strong>400-161-9995</strong>
      </p>
    </div>
  )
}
