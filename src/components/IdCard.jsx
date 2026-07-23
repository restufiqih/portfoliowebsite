import avatar from '../assets/idcard/avatar.png'
import verifiedBadge from '../assets/idcard/verified-badge.svg'
import topRated from '../assets/idcard/top-rated.svg'
import jobSuccess from '../assets/idcard/job-success.svg'

export default function IdCard() {
  return (
    <div
      className="relative flex flex-col gap-[30px] overflow-hidden p-[30px] rounded-[26.765px]"
      style={{
        width: '463px',
        height: '300px',
        backgroundImage: 'linear-gradient(137.906deg, #111111 33.963%, #777777 135.36%)',
      }}
    >
      {/* Background vector "UX" */}
      <svg
        className="absolute pointer-events-none"
        style={{ width: '488.692px', height: '303.377px', left: 'calc(50% + 108.25px)', top: '130px', transform: 'translateX(-50%)' }}
        viewBox="0 0 488.692 303.377"
        fill="none"
      >
        <path d="M377.182 0C314.608 0 279.577 40.78 269.549 82.7634C258.184 61.3706 249.761 32.7577 243.209 6.15043H156.702V113.783C156.702 152.825 138.919 181.705 104.156 181.705C69.3929 181.705 49.4708 152.825 49.4708 113.783L49.8719 6.15043H0V113.783C0 145.204 10.1616 173.683 28.7466 194.006C47.8664 214.998 73.9388 225.961 104.156 225.961C164.323 225.961 206.307 179.833 206.307 113.783V41.4485C212.591 65.248 227.566 110.975 256.179 151.087L229.438 303.377H280.112L297.761 195.477C303.51 200.29 309.661 204.569 316.212 208.446C333.193 219.142 352.58 225.159 372.636 225.828C372.636 225.828 375.711 225.961 377.315 225.961C439.355 225.961 488.692 177.961 488.692 113.114C488.692 48.2675 439.221 0 377.182 0ZM377.182 181.571C338.808 181.571 313.404 151.889 306.318 140.39C315.41 67.6547 342.017 44.6575 377.182 44.6575C411.945 44.6575 438.953 72.4681 438.953 113.114C438.953 153.761 411.945 181.571 377.182 181.571Z" fill="#121212" fillOpacity="0.5" />
      </svg>

      {/* Profile row */}
      <div className="relative flex gap-[20px] items-center w-full">
        {/* Avatar + verified badge */}
        <div className="relative shrink-0" style={{ width: '70px', height: '70px' }}>
          <div className="absolute left-0 top-0 w-[70px] h-[70px] rounded-full overflow-hidden bg-white">
            <img src={avatar} alt="Akhdiyat Restu Fiqih" className="w-full h-full object-cover" />
          </div>
          <div className="absolute" style={{ left: '42px', top: '42px', width: '36px', height: '36px' }}>
            <img src={verifiedBadge} alt="" className="w-full h-full" />
          </div>
        </div>

        {/* Name & role */}
        <div className="flex flex-col gap-[4px] flex-1 min-w-0">
          <p className="text-white text-[30px] font-light font-['Geist'] leading-[36px] tracking-[-0.6px]">
            Akhdiyat Restu Fiqih
          </p>
          <p className="text-white/80 text-[22px] font-light font-['Geist'] leading-[30px] tracking-[-0.44px]">
            UI/UX Designer
          </p>
        </div>
      </div>

      {/* Badges row */}
      <div className="relative flex flex-1 gap-[30px] items-start w-full min-h-0">
        <div className="flex-1 flex flex-col gap-[14px] items-center justify-center h-full min-w-0">
          <div className="w-[50px] h-[50px] overflow-hidden shrink-0">
            <img src={topRated} alt="" className="w-full h-full" />
          </div>
          <p className="text-white text-[20px] font-light font-['Geist'] leading-[28px] tracking-[-0.4px] text-center whitespace-nowrap">
            Top Rated Plus
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-[14px] items-center justify-center h-full min-w-0">
          <div className="w-[50px] h-[50px] shrink-0">
            <img src={jobSuccess} alt="" className="w-full h-full" />
          </div>
          <p className="text-white text-[20px] font-light font-['Geist'] leading-[28px] tracking-[-0.4px] text-center whitespace-nowrap">
            100% Job Success
          </p>
        </div>
      </div>
    </div>
  )
}
