export const BRAINWAVE_MODES = {
  alpha: { id: 'alpha', label: 'Alpha', hz: 10, icon: '🧠', tag: '10Hz Flow', desc: 'Flow State & Creative Architecture', carrier: 200 },
  beta: { id: 'beta', label: 'Beta', hz: 15, icon: '⚡', tag: '15Hz Focus', desc: 'Active Problem Solving & Focused Clarity', carrier: 220 },
  gamma: { id: 'gamma', label: 'Gamma', hz: 40, icon: '💎', tag: '40Hz Peak', desc: 'Peak Cognitive Synthesis & Logic', carrier: 240 },
  theta: { id: 'theta', label: 'Theta', hz: 6, icon: '🌌', tag: '6Hz Insight', desc: 'Deep Intuition & Algorithmic Design', carrier: 180 },
  delta: { id: 'delta', label: 'Delta', hz: 2, icon: '🌙', tag: '2Hz Rest', desc: 'Deep Mental Recovery & Restoration', carrier: 150 },
};

export const AMBIENT_THEMES = [
  { id: 'obsidian', name: 'Obsidian Dark', icon: '🌑', desc: 'Apple dark glassmorphism with subtle warm amber accents' },
  { id: 'aurora', name: 'Nordic Aurora', icon: '🌌', desc: 'Ethereal emerald and cyan northern lights mesh' },
  { id: 'cyberpunk', name: 'Cyberpunk Tokyo', icon: '⚡', desc: 'Midnight Tokyo neon purple and amber horizon' },
  { id: 'nebula', name: 'Deep Nebula', icon: '🪐', desc: 'Cosmic deep space sapphire and violet stellar shimmer' },
  { id: 'sunset', name: 'Pacific Sunset', icon: '🌅', desc: 'Warm Cupertino dusk peach, coral and gold ambient glow' },
];

export const FOCUS_SCENES = [
  { id: 'forest', name: 'Pine Forest', image: 'https://nahian.bd/_astro/forest.DgifAKtC_Shsyf.webp', icon: '🌲' },
  { id: 'rain', name: 'Calm Rain', image: 'https://nahian.bd/_astro/rain.BwHDexYs_Z2bytjl.webp', icon: '🌧️' },
  { id: 'monsoon', name: 'Monsoon Showers', image: 'https://nahian.bd/_astro/monsoon.BzBqm32v_Z2mvXYK.webp', icon: '🏠' },
  { id: 'storm', name: 'Lightning Storm', image: 'https://nahian.bd/_astro/storm.CJLlRQn0_Z99nRn.webp', icon: '⛈️' },
  { id: 'mountains', name: 'Alpine Mountains', image: 'https://nahian.bd/_astro/mountains.DPM3RYfe_wY8Oo.webp', icon: '🏔️' },
  { id: 'garden', name: 'Botanical Garden', image: 'https://nahian.bd/_astro/garden.BEU1z0be_1YYtVM.webp', icon: '🌸' },
  { id: 'ocean', name: 'Coastal Ocean', image: 'https://nahian.bd/_astro/ocean.Cme6vjYe_Z28apxR.webp', icon: '🌊' },
  { id: 'night', name: 'Midnight Stars', image: 'https://nahian.bd/_astro/night.B9DC7PS5_Z2hPMJ2.webp', icon: '🌙' },
  { id: 'cabin', name: 'Woodland Cabin', image: 'https://nahian.bd/_astro/cabin.D0zKu_4I_ZcDeqC.webp', icon: '🪵' },
  { id: 'cafe', name: 'Quiet Café', image: 'https://nahian.bd/_astro/cafe.BVo4QF8p_Z29xCwl.webp', icon: '☕' },
  { id: 'library', name: 'Old Library', image: 'https://nahian.bd/_astro/library.I2cYykiq_Z1SAIAt.webp', icon: '📚' },
  { id: 'desk', name: 'Late-Night Desk', image: 'https://nahian.bd/_astro/desk.C-2saIFT_Z1ISWdi.webp', icon: '💻' },
  { id: 'train', name: 'Scenic Train', image: 'https://nahian.bd/_astro/train.CK5WCulE_Z1EzXWe.webp', icon: '🚆' },
  { id: 'city', name: 'City Skyline', image: 'https://nahian.bd/_astro/city.D7c2B3R5_Z599vp.webp', icon: '🏙️' },
  { id: 'space', name: 'Deep Space', image: 'https://nahian.bd/_astro/space.BUmMSb8w_1iieeK.webp', icon: '🚀' },
];

export const SOUND_TO_SCENE_MAP = {
  'heavy-rain': 'storm',
  'thunder': 'storm',
  'tin-roof': 'monsoon',
  'rain-on-window': 'desk',
  'rain-on-car-roof': 'night',
  'rain-on-umbrella': 'rain',
  'rain-on-tent': 'forest',
  'rain-on-leaves': 'forest',
  'light-rain': 'rain',
  'forest': 'forest',
  'river': 'forest',
  'waves': 'ocean',
  'waterfall': 'mountains',
  'droplets': 'rain',
  'campfire': 'cabin',
  'wind': 'mountains',
  'wind-in-trees': 'forest',
  'jungle': 'forest',
  'birds': 'garden',
  'crickets': 'night',
  'frog': 'garden',
  'owl': 'night',
  'seagulls': 'ocean',
  'whale': 'ocean',
  'cat-purring': 'cabin',
  'beehive': 'garden',
  'cafe': 'cafe',
  'library': 'library',
  'office': 'desk',
  'restaurant': 'cafe',
  'night-village': 'night',
  'underwater': 'ocean',
  'laboratory': 'desk',
  'airport': 'city',
  'subway-station': 'city',
  'train': 'train',
  'inside-a-train': 'train',
  'airplane': 'city',
  'sailboat': 'ocean',
  'rowing-boat': 'ocean',
  'submarine': 'ocean',
  'keyboard': 'desk',
  'typewriter': 'desk',
  'paper': 'library',
  'clock': 'library',
  'ceiling-fan': 'cabin',
  'wind-chimes': 'garden',
  'boiling-water': 'cabin',
  'vinyl-effect': 'cabin',
  'busy-street': 'city',
  'traffic': 'city',
  'highway': 'city',
  'road': 'city',
  'crowd': 'city',
  'brown': 'mountains',
  'pink': 'mountains',
  'white': 'mountains',
  'alpha': 'mountains',
  'beta': 'mountains',
  'gamma': 'mountains',
  'scifi': 'space',
};

export const FOCUS_QUOTES = [
  'One tab, one task. The rest can wait an hour.',
  'You don’t need more motivation. You need fewer tabs.',
  'Close the other tabs. They will still be there later.',
  'Start with simplicity. Let beauty follow with care.',
  'When you feel rushed, slow down. Quality needs space.',
  'Clarity comes from stillness and patient attention.',
  'If you are overwhelmed, write it down and breathe.',
  'Small, steady steps build lasting momentum.',
  'Focus on this moment. The rest will take care of itself.',
  'Done with calm intention is better than rushed perfection.',
  'Simplicity is the ultimate sophistication. Clear away the noise.',
  'Take your time. Craft your work with quiet dedication.',
  'Rest is not a reward; it is an essential part of the rhythm.',
  'Calm mind, open heart, steady momentum.',
  'Momentum beats motivation every day.',
  'Thirty quiet minutes beat three noisy hours.',
  'Today’s calm presence is tomorrow’s peace of mind.',
  'Deep work feels slow while you are in it and rewarding when you look back.',
  'Put the phone face down. You can check it at the break.',
  'Don’t check notifications. They can wait until your session is complete.',
  'Breathe. Then pick the smallest next step.',
  'Tea first. Then calm, steady focus.',
  'Dhaka is loud. Headphones on, world off.',
  'Monsoon outside, calm focus inside.',
  'Rain on a tin roof, a cup of cha, one clear intention.',
  'Bismillah. Start small, start now.',
  'Clean desk, calm breath, clear head.',
  'Stillness is where true clarity happens.',
  'Progress is quiet. Keep going gently.',
  'Rest is an essential part of the work.',
];

export const DEFAULT_YT_TRACK = {
  id: '25wH52RSam8',
  title: 'Calm Ambient Stream',
  sub: 'YouTube Video',
  thumb: 'https://i.ytimg.com/vi/25wH52RSam8/mqdefault.jpg',
};

export const YOUTUBE_PICKS = [DEFAULT_YT_TRACK];

export const parseYoutubeUrl = (input) => {
  if (!input || typeof input !== 'string') return null;
  const str = input.trim();
  const idRegex = /^[\w-]{11}$/;
  if (idRegex.test(str)) {
    return { id: str };
  }
  try {
    const url = new URL(/^https?:\/\//i.test(str) ? str : `https://${str}`);
    const host = url.hostname.replace(/^(www|m|music)\./, '');
    let videoId = '';
    const listId = url.searchParams.get('list') || undefined;

    if (host === 'youtu.be') {
      videoId = url.pathname.slice(1).split('/')[0] || '';
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const parts = url.pathname.split('/');
      const section = parts[1];
      if (section === 'watch') {
        videoId = url.searchParams.get('v') || '';
      } else if (section === 'shorts' || section === 'live' || section === 'embed' || section === 'v') {
        videoId = parts[2] === 'videoseries' ? '' : parts[2] || '';
      }
    }
    if (idRegex.test(videoId)) {
      return { id: videoId, list: listId };
    }
    if (listId) {
      return { id: '', list: listId };
    }
  } catch {
    // ignore
  }
  return null;
};

export const TIMER_MODES = {
  deep: { id: 'deep', label: 'Deep Work', focusMinutes: 50, breakMinutes: 10 },
  pomodoro: { id: 'pomodoro', label: 'Classic Pomodoro', focusMinutes: 25, breakMinutes: 5 },
  sprint: { id: 'sprint', label: 'Focus Sprint', focusMinutes: 15, breakMinutes: 3 },
  stopwatch: { id: 'stopwatch', label: 'Continuous Flow', focusMinutes: 0, breakMinutes: 0 },
};
