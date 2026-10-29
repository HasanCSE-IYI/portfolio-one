import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const FocusContext = createContext(null);

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

export const SOUND_DEFINITIONS = [
  // 1. Rain Category (9 sounds)
  {
    id: 'tin-roof',
    name: 'Tin Roof Rain',
    category: 'Rain',
    icon: '🏠',
    desc: 'Monsoon rain on tin roof, like home',
    file: '/sounds/tin-roof.mp3',
    fallbackUrl: 'https://nahian.bd/_astro/tin-roof.COAPwzA3.mp3',
  },
  {
    id: 'light-rain',
    name: 'Light Rain',
    category: 'Rain',
    icon: '🌧️',
    desc: 'Calm and steady gentle drizzle',
    file: '/sounds/light-rain.mp3',
    fallbackUrl: 'https://nahian.bd/_astro/light-rain.BZGGXtwS.mp3',
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Rain',
    category: 'Rain',
    icon: '⛈️',
    desc: 'Torrents of pelting downpour',
    file: '/sounds/heavy-rain.mp3',
    fallbackUrl: 'https://nahian.bd/_astro/heavy-rain.nJpR88jx.mp3',
  },
  {
    id: 'thunder',
    name: 'Thunder',
    category: 'Rain',
    icon: '⚡',
    desc: 'Deep rolling atmospheric thunder',
    file: 'https://nahian.bd/_astro/thunder.B-flvVym.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/thunder.mp3',
  },
  {
    id: 'rain-on-window',
    name: 'Rain on Window',
    category: 'Rain',
    icon: '🪟',
    desc: 'Soothing rain drumming on glass',
    file: '/sounds/rain-on-window.mp3',
    fallbackUrl: 'https://nahian.bd/_astro/rain-on-window.TETkzja0.mp3',
  },
  {
    id: 'rain-on-car-roof',
    name: 'Rain on Car Roof',
    category: 'Rain',
    icon: '🚗',
    desc: 'Cosy pitter-patter inside a parked car',
    file: 'https://nahian.bd/_astro/rain-on-car-roof.UDtwIGOt.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/rain-on-car-roof.mp3',
  },
  {
    id: 'rain-on-umbrella',
    name: 'Rain on Umbrella',
    category: 'Rain',
    icon: '☂️',
    desc: 'Tapping drops on taut nylon umbrella',
    file: 'https://nahian.bd/_astro/rain-on-umbrella.DOyz5l6j.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/rain-on-umbrella.mp3',
  },
  {
    id: 'rain-on-tent',
    name: 'Rain on Tent',
    category: 'Rain',
    icon: '⛺',
    desc: 'Wilderness camping in a rainstorm',
    file: 'https://nahian.bd/_astro/rain-on-tent.7H6QB2QV.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/rain-on-tent.mp3',
  },
  {
    id: 'rain-on-leaves',
    name: 'Rain on Leaves',
    category: 'Rain',
    icon: '🍃',
    desc: 'Splashes falling through lush foliage',
    file: 'https://nahian.bd/_astro/rain-on-leaves.GueFB6eQ.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/rain/rain-on-leaves.mp3',
  },

  // 2. Nature & Water Category (9 sounds)
  {
    id: 'forest',
    name: 'Forest Woods',
    category: 'Nature',
    icon: '🌲',
    desc: 'Woods ambience with breeze & birds',
    file: '/sounds/forest.mp3',
    fallbackUrl: 'https://nahian.bd/_astro/forest.BZGXKtTT.mp3',
  },
  {
    id: 'river',
    name: 'Flowing River',
    category: 'Nature',
    icon: '🏞️',
    desc: 'Crisp mountain river rushing over rocks',
    file: 'https://nahian.bd/_astro/river.MtyG0AwH.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/river.mp3',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    category: 'Nature',
    icon: '🌊',
    desc: 'Rhythmic ocean swells washing shore',
    file: 'https://nahian.bd/_astro/waves.BeyErWdW.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/waves.mp3',
  },
  {
    id: 'waterfall',
    name: 'Waterfall',
    category: 'Nature',
    icon: '💧',
    desc: 'Deep roaring cascade into mountain pool',
    file: 'https://nahian.bd/_astro/waterfall.UBoM_51q.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/waterfall.mp3',
  },
  {
    id: 'droplets',
    name: 'Water Droplets',
    category: 'Nature',
    icon: '🫧',
    desc: 'Serene cave drops in quiet water',
    file: 'https://nahian.bd/_astro/droplets._riMndmy.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/droplets.mp3',
  },
  {
    id: 'campfire',
    name: 'Campfire',
    category: 'Nature',
    icon: '🔥',
    desc: 'Crackling warm wood, gentle sparks',
    file: 'https://nahian.bd/_astro/campfire.bSKxRiZG.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/campfire.mp3',
  },
  {
    id: 'wind',
    name: 'Mountain Wind',
    category: 'Nature',
    icon: '🍃',
    desc: 'Alpine gust sweeping across ridges',
    file: 'https://nahian.bd/_astro/wind.CJM9qTVi.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/wind.mp3',
  },
  {
    id: 'wind-in-trees',
    name: 'Wind in Trees',
    category: 'Nature',
    icon: '🌳',
    desc: 'Whistling wind in tall tree branches',
    file: 'https://nahian.bd/_astro/wind-in-trees.C2gNS7xo.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/wind-in-trees.mp3',
  },
  {
    id: 'jungle',
    name: 'Tropical Jungle',
    category: 'Nature',
    icon: '🌴',
    desc: 'Exotic rainforest canopy soundscape',
    file: 'https://nahian.bd/_astro/jungle.2acUpzI3.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/nature/jungle.mp3',
  },

  // 3. Animals & Wildlife Category (8 sounds)
  {
    id: 'birds',
    name: 'Songbirds',
    category: 'Animals',
    icon: '🐦',
    desc: 'Melodious woodland birds in morning light',
    file: 'https://nahian.bd/_astro/birds.CtHflfXU.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/birds.mp3',
  },
  {
    id: 'crickets',
    name: 'Summer Crickets',
    category: 'Animals',
    icon: '🦗',
    desc: 'Nocturnal meadow chirps under stars',
    file: 'https://nahian.bd/_astro/crickets.B33C_N2E.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/crickets.mp3',
  },
  {
    id: 'frog',
    name: 'Pond Frogs',
    category: 'Animals',
    icon: '🐸',
    desc: 'Tranquil wetland frogs croaking peacefully',
    file: 'https://nahian.bd/_astro/frog.B-DfAk8F.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/frog.mp3',
  },
  {
    id: 'owl',
    name: 'Night Owl',
    category: 'Animals',
    icon: '🦉',
    desc: 'Gentle distant nocturnal forest call',
    file: 'https://nahian.bd/_astro/owl.DdKYT0Zn.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/owl.mp3',
  },
  {
    id: 'seagulls',
    name: 'Coastal Seagulls',
    category: 'Animals',
    icon: '🕊️',
    desc: 'Sea birds calling over ocean breezes',
    file: 'https://nahian.bd/_astro/seagulls.CDE_yPMt.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/seagulls.mp3',
  },
  {
    id: 'whale',
    name: 'Whale Songs',
    category: 'Animals',
    icon: '🐋',
    desc: 'Deep marine whale calls and echoes',
    file: 'https://nahian.bd/_astro/whale.QH5uifGP.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/whale.mp3',
  },
  {
    id: 'cat-purring',
    name: 'Cat Purring',
    category: 'Animals',
    icon: '🐱',
    desc: 'Cosy, steady rhythmic feline purr',
    file: 'https://nahian.bd/_astro/cat-purring.JONenhBK.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/cat-purring.mp3',
  },
  {
    id: 'beehive',
    name: 'Beehive Meadow',
    category: 'Animals',
    icon: '🐝',
    desc: 'Gentle honeybee garden hum',
    file: 'https://nahian.bd/_astro/beehive.Blso1aRJ.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/animals/beehive.mp3',
  },

  // 4. Places Category (9 sounds)
  {
    id: 'cafe',
    name: 'Quiet Café',
    category: 'Places',
    icon: '☕',
    desc: 'Gentle coffeehouse murmur & porcelain',
    file: 'https://nahian.bd/_astro/cafe.tGIKTWv7.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/cafe.mp3',
  },
  {
    id: 'library',
    name: 'University Library',
    category: 'Places',
    icon: '📚',
    desc: 'Quiet reading room rustle & footsteps',
    file: 'https://nahian.bd/_astro/library.BgVxe8nv.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/library.mp3',
  },
  {
    id: 'office',
    name: 'Creative Studio',
    category: 'Places',
    icon: '💼',
    desc: 'Low-key studio murmurs & focus aura',
    file: 'https://nahian.bd/_astro/office.DOe0dbtU.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/office.mp3',
  },
  {
    id: 'restaurant',
    name: 'Bistro Dining',
    category: 'Places',
    icon: '🍽️',
    desc: 'Warm evening bistro dining atmosphere',
    file: 'https://nahian.bd/_astro/restaurant.Cv7oeWle.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/restaurant.mp3',
  },
  {
    id: 'night-village',
    name: 'Night Village',
    category: 'Places',
    icon: '🏡',
    desc: 'Peaceful countryside hamlet after midnight',
    file: 'https://nahian.bd/_astro/night-village.M4ePrJTB.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/camp.mp3',
  },
  {
    id: 'underwater',
    name: 'Underwater',
    category: 'Places',
    icon: '🤿',
    desc: 'Deep aquatic ocean calm & sonar bubbles',
    file: 'https://nahian.bd/_astro/underwater.D3vlb4sh.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/underwater.mp3',
  },
  {
    id: 'laboratory',
    name: 'Research Lab',
    category: 'Places',
    icon: '🧪',
    desc: 'Cleanroom computer hum & scientific instruments',
    file: 'https://nahian.bd/_astro/laboratory.Dt5PM0Cj.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/office.mp3',
  },
  {
    id: 'airport',
    name: 'Airport Terminal',
    category: 'Places',
    icon: '🛫',
    desc: 'Spacious international departures lounge',
    file: 'https://nahian.bd/_astro/airport.CO47AMmq.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/airport.mp3',
  },
  {
    id: 'subway-station',
    name: 'Subway Station',
    category: 'Places',
    icon: '🚇',
    desc: 'Underground transit platform rumble',
    file: 'https://nahian.bd/_astro/subway-station.BJlb4yap.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/transport/train.mp3',
  },

  // 5. Transport Category (6 sounds)
  {
    id: 'train',
    name: 'Passenger Train',
    category: 'Transport',
    icon: '🚆',
    desc: 'Rhythmic train ride over rail joints',
    file: 'https://nahian.bd/_astro/train.DviEu3zq.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/transport/train.mp3',
  },
  {
    id: 'inside-a-train',
    name: 'Inside Train Cabin',
    category: 'Transport',
    icon: '🪑',
    desc: 'Gentle sway and low rumble of train cabin',
    file: 'https://nahian.bd/_astro/inside-a-train.Dooiov-G.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/transport/train.mp3',
  },
  {
    id: 'airplane',
    name: 'Airplane Cabin',
    category: 'Transport',
    icon: '✈️',
    desc: 'Deep cruising jet engine white noise',
    file: 'https://nahian.bd/_astro/airplane.SKKSw1n5.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/transport/airplane.mp3',
  },
  {
    id: 'sailboat',
    name: 'Sailboat at Sea',
    category: 'Transport',
    icon: '⛵',
    desc: 'Water lapping against wooden hull in ocean breeze',
    file: 'https://nahian.bd/_astro/sailboat.DFSKR9Fk.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/transport/boat.mp3',
  },
  {
    id: 'rowing-boat',
    name: 'Rowing Boat',
    category: 'Transport',
    icon: '🚣',
    desc: 'Gentle oars dipping through calm lake water',
    file: 'https://nahian.bd/_astro/rowing-boat.BpBWvw7x.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/transport/boat.mp3',
  },
  {
    id: 'submarine',
    name: 'Submarine Deep',
    category: 'Transport',
    icon: '🚢',
    desc: 'Sub-surface acoustic hull hum & sonar pulse',
    file: 'https://nahian.bd/_astro/submarine.DQQ7GZv7.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/places/underwater.mp3',
  },

  // 6. Things Category (8 sounds)
  {
    id: 'keyboard',
    name: 'Mechanical Keyboard',
    category: 'Things',
    icon: '⌨️',
    desc: 'Tactile rhythmic typing on mechanical switches',
    file: 'https://nahian.bd/_astro/keyboard.CGAR0l4Q.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/things/keyboard.mp3',
  },
  {
    id: 'typewriter',
    name: 'Vintage Typewriter',
    category: 'Things',
    icon: '📝',
    desc: 'Classic metal keystrokes with carriage return ding',
    file: 'https://nahian.bd/_astro/typewriter.DfFQNG84.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/things/typewriter.mp3',
  },
  {
    id: 'paper',
    name: 'Paper Turning',
    category: 'Things',
    icon: '📄',
    desc: 'Crisp notebook paper flips & sketching',
    file: 'https://nahian.bd/_astro/paper.0Prqz2Le.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/things/paper.mp3',
  },
  {
    id: 'clock',
    name: 'Antique Clock',
    category: 'Things',
    icon: '⏱️',
    desc: 'Rhythmic mechanical second ticks',
    file: 'https://nahian.bd/_astro/clock.Cp6_T4Ej.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/things/clock.mp3',
  },
  {
    id: 'ceiling-fan',
    name: 'Ceiling Fan',
    category: 'Things',
    icon: '🌀',
    desc: 'Low soothing whirr of rotating ceiling fan',
    file: 'https://nahian.bd/_astro/ceiling-fan.YzCgTXQO.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/things/fan.mp3',
  },
  {
    id: 'wind-chimes',
    name: 'Wind Chimes',
    category: 'Things',
    icon: '🎐',
    desc: 'Melodic bamboo & metal breeze chimes',
    file: 'https://nahian.bd/_astro/wind-chimes.DVl7gw6j.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/things/wind-chimes.mp3',
  },
  {
    id: 'boiling-water',
    name: 'Boiling Kettle',
    category: 'Things',
    icon: '🫖',
    desc: 'Simmering tea kettle on stove',
    file: 'https://nahian.bd/_astro/boiling-water.B_XPZ-lQ.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/things/kettle.mp3',
  },
  {
    id: 'vinyl-effect',
    name: 'Vinyl Crackle',
    category: 'Things',
    icon: '💿',
    desc: 'Warm analog turntable surface noise & dust',
    file: 'https://nahian.bd/_astro/vinyl-effect.zpEb16O5.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/things/vinyl.mp3',
  },

  // 7. City Category (5 sounds)
  {
    id: 'busy-street',
    name: 'Busy Street',
    category: 'City',
    icon: '🏙️',
    desc: 'Metropolitan sidewalk ambiance & movement',
    file: 'https://nahian.bd/_astro/busy-street.CRRgRiRk.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/city/street.mp3',
  },
  {
    id: 'traffic',
    name: 'City Traffic',
    category: 'City',
    icon: '🚦',
    desc: 'Distant flow of urban vehicles',
    file: 'https://nahian.bd/_astro/traffic.Dnz0bnTe.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/city/traffic.mp3',
  },
  {
    id: 'highway',
    name: 'Open Highway',
    category: 'City',
    icon: '🛣️',
    desc: 'Rhythmic whoosh of distant express traffic',
    file: 'https://nahian.bd/_astro/highway.UDhkN4uj.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/city/traffic.mp3',
  },
  {
    id: 'road',
    name: 'Suburban Road',
    category: 'City',
    icon: '🚗',
    desc: 'Gentle occasional cars along neighbourhood road',
    file: 'https://nahian.bd/_astro/road.j6Ti9-Nm.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/city/street.mp3',
  },
  {
    id: 'crowd',
    name: 'Plaza Crowd',
    category: 'City',
    icon: '👥',
    desc: 'Ambient chatter of people in a town square',
    file: 'https://nahian.bd/_astro/crowd.C8pP-exH.mp3',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/remvze/moodist@main/public/sounds/city/crowd.mp3',
  },

  // 8. Noise & Neural Waves Category (7 sounds)
  {
    id: 'brown',
    name: 'Brown Noise',
    category: 'Noise & Waves',
    icon: '🌊',
    desc: 'Deep warm low-frequency acoustic warmth',
    type: 'procedural_noise',
    noiseType: 'brown',
  },
  {
    id: 'pink',
    name: 'Pink Noise',
    category: 'Noise & Waves',
    icon: '💨',
    desc: 'Gentle balanced 1/f rainfall noise',
    type: 'procedural_noise',
    noiseType: 'pink',
  },
  {
    id: 'white',
    name: 'White Noise',
    category: 'Noise & Waves',
    icon: '📻',
    desc: 'Crisp wideband static masking voices',
    type: 'procedural_noise',
    noiseType: 'white',
  },
  {
    id: 'alpha',
    name: 'Binaural Alpha (10Hz)',
    category: 'Noise & Waves',
    icon: '🧠',
    desc: '10 Hz frequency for calm creative flow',
    type: 'binaural',
    hz: 10,
    carrier: 200,
  },
  {
    id: 'beta',
    name: 'Binaural Beta (15Hz)',
    category: 'Noise & Waves',
    icon: '⚡',
    desc: '15 Hz active focus and problem-solving',
    type: 'binaural',
    hz: 15,
    carrier: 220,
  },
  {
    id: 'gamma',
    name: 'Binaural Gamma (40Hz)',
    category: 'Noise & Waves',
    icon: '💎',
    desc: '40 Hz peak cognitive synthesis',
    type: 'binaural',
    hz: 40,
    carrier: 240,
  },
  {
    id: 'scifi',
    name: 'Sci-fi Starship Hum',
    category: 'Noise & Waves',
    icon: '🚀',
    desc: 'Deep interstellar ship engine drone with subtle phaser sweep',
    type: 'scifi',
  },
];

export const FOCUS_PRESETS = [
  // Nahian Ready-Made Curated Mixes
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    icon: '🏔️',
    desc: 'Brown noise + Binaural Alpha (10Hz)',
    scene: 'mountains',
    mix: { brown: 55, alpha: 50 },
  },
  {
    id: 'rainy-cafe',
    name: 'Rainy Café',
    icon: '☕',
    desc: 'Light rain + Quiet coffeehouse',
    scene: 'cafe',
    mix: { 'light-rain': 50, cafe: 55 },
  },
  {
    id: 'late-night-coding',
    name: 'Midnight Flow',
    icon: '🌙',
    desc: 'Rain on window + Calm typing + Soothing brown noise',
    scene: 'desk',
    mix: { 'rain-on-window': 50, keyboard: 30, brown: 30 },
  },
  {
    id: 'monsoon-tin-roof',
    name: 'Monsoon Tin Roof',
    icon: '🏠',
    desc: 'Tin roof rain + Summer crickets + Distant thunder',
    scene: 'monsoon',
    mix: { 'tin-roof': 65, crickets: 30, thunder: 30 },
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    icon: '⛈️',
    desc: 'Heavy rain + Deep thunder + Mountain wind',
    scene: 'storm',
    mix: { 'heavy-rain': 65, thunder: 55, wind: 20 },
  },
  {
    id: 'forest-walk',
    name: 'Forest Walk',
    icon: '🌲',
    desc: 'Forest woods + Flowing river + Songbirds',
    scene: 'forest',
    mix: { forest: 60, river: 35, birds: 30 },
  },
  {
    id: 'pacific-surf',
    name: 'Pacific Surf & Birds',
    icon: '🌊',
    desc: 'Ocean waves + Coastal seagulls + Wind',
    scene: 'ocean',
    mix: { waves: 65, seagulls: 20, wind: 20 },
  },
  {
    id: 'cozy-cabin',
    name: 'Cozy Cabin',
    icon: '🪵',
    desc: 'Warm campfire + Rain on window + Wind',
    scene: 'cabin',
    mix: { campfire: 55, 'rain-on-window': 45, wind: 20 },
  },
  {
    id: 'study-hall',
    name: 'Study Hall',
    icon: '📚',
    desc: 'Quiet library + Paper turning + Antique clock',
    scene: 'library',
    mix: { library: 60, paper: 25, clock: 15 },
  },
  {
    id: 'night-train',
    name: 'Night Train',
    icon: '🚆',
    desc: 'Inside train cabin + Light rain drizzle',
    scene: 'train',
    mix: { 'inside-a-train': 60, 'light-rain': 30 },
  },
  {
    id: 'garden',
    name: 'Bloom Garden',
    icon: '🌸',
    desc: 'Songbirds + Beehive hum + Wind in trees',
    scene: 'garden',
    mix: { birds: 45, beehive: 15, 'wind-in-trees': 30 },
  },
  {
    id: 'starship',
    name: 'Starship Odyssey',
    icon: '🚀',
    desc: 'Sci-fi starship drone + Low brown rumble',
    scene: 'space',
    mix: { scifi: 60, brown: 25 },
  },
  {
    id: 'nordic-rain',
    name: 'Nordic Pine Rain',
    icon: '🌲',
    desc: 'Rain on leaves + Forest woods + Campfire',
    scene: 'forest',
    mix: { forest: 60, 'rain-on-leaves': 50, campfire: 35 },
  },
];

export const TIMER_MODES = {
  deep: { id: 'deep', label: 'Deep Work', focusMinutes: 50, breakMinutes: 10 },
  pomodoro: { id: 'pomodoro', label: 'Classic Pomodoro', focusMinutes: 25, breakMinutes: 5 },
  sprint: { id: 'sprint', label: 'Focus Sprint', focusMinutes: 15, breakMinutes: 3 },
  stopwatch: { id: 'stopwatch', label: 'Continuous Flow', focusMinutes: 0, breakMinutes: 0 },
};

export const FocusProvider = ({ children }) => {
  // Web Audio Context & Node Refs
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);
  const soundNodesRef = useRef({});

  // Sound Engine State
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  // Per-sound volume map (0 - 100)
  const [volumes, setVolumes] = useState(() => {
    const init = {};
    SOUND_DEFINITIONS.forEach((s) => {
      init[s.id] = 0;
    });
    return init;
  });

  // Atmospheric Scene State
  const [activeScene, setActiveScene] = useState('forest');
  const changeScene = useCallback((sceneId) => {
    setActiveScene(sceneId);
  }, []);

  // Quotes State
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() =>
    Math.floor(Math.random() * FOCUS_QUOTES.length)
  );

  const nextQuote = useCallback(() => {
    setCurrentQuoteIndex((prev) => (prev + 1) % FOCUS_QUOTES.length);
  }, []);

  const prevQuote = useCallback(() => {
    setCurrentQuoteIndex((prev) => (prev - 1 + FOCUS_QUOTES.length) % FOCUS_QUOTES.length);
  }, []);

  // YouTube Focus Player State
  const [customYtLinks, setCustomYtLinks] = useState(() => {
    try {
      const saved = localStorage.getItem('focus-links');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentYtTrack, setCurrentYtTrack] = useState(() => {
    try {
      const saved = localStorage.getItem('focus-links');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {}
    return DEFAULT_YT_TRACK;
  });
  const [isYtPlaying, setIsYtPlaying] = useState(false);
  const [ytVolume, setYtVolume] = useState(80);
  const [isYtFolded, setIsYtFolded] = useState(() => {
    try {
      return localStorage.getItem('yt-video-hidden') === '1';
    } catch {
      return false;
    }
  });

  const toggleYtFold = useCallback(() => {
    setIsYtFolded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('yt-video-hidden', next ? '1' : '0');
      } catch {}
      return next;
    });
  }, []);

  const playYtTrack = useCallback((track) => {
    if (!track) return;
    setCurrentYtTrack(track);
    setIsYtPlaying(true);
  }, []);

  const toggleYtPlay = useCallback(() => {
    setIsYtPlaying((prev) => !prev);
  }, []);

  const nextYtTrack = useCallback(() => {
    if (customYtLinks.length > 0) {
      const idx = customYtLinks.findIndex((p) => p.id === currentYtTrack?.id);
      const nextIdx = (idx + 1) % customYtLinks.length;
      setCurrentYtTrack(customYtLinks[nextIdx]);
      setIsYtPlaying(true);
    }
  }, [customYtLinks, currentYtTrack]);

  const prevYtTrack = useCallback(() => {
    if (customYtLinks.length > 0) {
      const idx = customYtLinks.findIndex((p) => p.id === currentYtTrack?.id);
      const prevIdx = (idx - 1 + customYtLinks.length) % customYtLinks.length;
      setCurrentYtTrack(customYtLinks[prevIdx]);
      setIsYtPlaying(true);
    }
  }, [customYtLinks, currentYtTrack]);

  const addCustomYtLink = useCallback((inputUrl) => {
    const parsed = parseYoutubeUrl(inputUrl);
    if (!parsed || !parsed.id) return false;
    const newTrack = {
      id: parsed.id,
      title: `YouTube Video (${parsed.id})`,
      sub: 'Custom Stream',
      list: parsed.list,
      thumb: `https://i.ytimg.com/vi/${parsed.id}/mqdefault.jpg`,
    };
    setCustomYtLinks((prev) => {
      const filtered = prev.filter((p) => p.id !== parsed.id);
      const updated = [newTrack, ...filtered].slice(0, 20);
      try {
        localStorage.setItem('focus-links', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setCurrentYtTrack(newTrack);
    setIsYtPlaying(true);
    return true;
  }, []);

  const removeCustomYtLink = useCallback((id) => {
    setCustomYtLinks((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('focus-links', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [timerStatus, setTimerStatus] = useState('idle'); // 'idle' | 'running' | 'paused'
  const [timerPhase, setTimerPhase] = useState('focus'); // 'focus' | 'break'
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentTask, setCurrentTask] = useState(() => {
    try {
      return localStorage.getItem('focus_current_task') || 'Focused Deep Work & Calm Reflection';
    } catch {
      return 'Focused Deep Work & Calm Reflection';
    }
  });

  // Zen / Immersive Fullscreen State
  const [isZenMode, setIsZenMode] = useState(false);

  // Persist Current Task to storage
  const currentTaskRef = useRef(currentTask);
  useEffect(() => {
    currentTaskRef.current = currentTask;
    try {
      localStorage.setItem('focus_current_task', currentTask);
    } catch {}
  }, [currentTask]);

  // Pomodoro Session History State
  const [sessionHistory, setSessionHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('focus_session_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const logCompletedSession = useCallback((taskName, minutes, modeLabel) => {
    const newEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      task: taskName || 'Deep Nature Focus Sprint',
      minutes,
      mode: modeLabel,
    };
    setSessionHistory((prev) => {
      const updated = [newEntry, ...prev.slice(0, 9)];
      try {
        localStorage.setItem('focus_session_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearSessionHistory = useCallback(() => {
    setSessionHistory([]);
    try {
      localStorage.removeItem('focus_session_history');
    } catch {}
  }, []);

  // Multi-State Brainwave Tuner (Alpha, Beta, Gamma, Theta, Delta)
  const [brainwaveMode, setBrainwaveMode] = useState('alpha');
  const brainwaveModeRef = useRef('alpha');
  const binauralNodesRef = useRef(null);

  const changeBrainwaveMode = useCallback((newMode) => {
    setBrainwaveMode(newMode);
    brainwaveModeRef.current = newMode;
    const info = BRAINWAVE_MODES[newMode] || BRAINWAVE_MODES.alpha;
    if (binauralNodesRef.current && audioCtxRef.current) {
      const { oscL, oscR } = binauralNodesRef.current;
      const now = audioCtxRef.current.currentTime;
      try {
        oscL.frequency.cancelScheduledValues(now);
        oscR.frequency.cancelScheduledValues(now);
        oscL.frequency.linearRampToValueAtTime(info.carrier, now + 1.0);
        oscR.frequency.linearRampToValueAtTime(info.carrier + info.hz, now + 1.0);
      } catch {}
    }
  }, []);

  // Vinyl Tape Warmth Effect State
  const [isVinylWarmth, setIsVinylWarmth] = useState(false);
  const vinylNodeRef = useRef(null);

  // Custom User Mix Presets (persisted in localStorage)
  const [userPresets, setUserPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('focus_user_presets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveUserPreset = useCallback((name) => {
    if (!name || !name.trim()) return;
    const currentMix = {};
    SOUND_DEFINITIONS.forEach((s) => {
      if (volumes[s.id] > 0) currentMix[s.id] = volumes[s.id];
    });
    const newPreset = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      icon: '✨',
      desc: 'Custom nature soundscape',
      scene: activeScene,
      mix: currentMix,
      isCustom: true,
    };
    setUserPresets((prev) => {
      const updated = [newPreset, ...prev];
      try {
        localStorage.setItem('focus_user_presets', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setActivePreset(newPreset.id);
  }, [volumes, activeScene]);

  const deleteUserPreset = useCallback((id) => {
    setUserPresets((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('focus_user_presets', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setActivePreset((prev) => (prev === id ? null : prev));
  }, []);

  // Favorite Sounds (persisted in localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('focus_favorites');
      return saved ? JSON.parse(saved) : ['rain', 'river', 'scifi', 'fire', 'birds'];
    } catch {
      return ['rain', 'river', 'scifi', 'fire', 'birds'];
    }
  });

  const toggleFavorite = useCallback((soundId) => {
    setFavorites((prev) => {
      const next = prev.includes(soundId)
        ? prev.filter((id) => id !== soundId)
        : [...prev, soundId];
      try {
        localStorage.setItem('focus_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Sleep Timer (auto fade & pause)
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(0);

  const setSleepTimer = useCallback((minutes) => {
    if (!minutes || minutes <= 0) {
      setSleepTimerMinutes(null);
      setSleepTimerRemaining(0);
    } else {
      setSleepTimerMinutes(minutes);
      setSleepTimerRemaining(minutes * 60);
    }
  }, []);

  useEffect(() => {
    if (!sleepTimerMinutes || sleepTimerRemaining <= 0) return;
    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setSleepTimerMinutes(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepTimerMinutes, sleepTimerRemaining]);

  // Share Mix URL generator
  const getShareableMixUrl = useCallback(() => {
    const activeEntries = Object.entries(volumes).filter(([, v]) => v > 0);
    if (activeEntries.length === 0) return null;
    const mixStr = activeEntries.map(([id, v]) => `${id}:${v}`).join(',');
    return `${window.location.origin}${window.location.pathname}#focus?mix=${encodeURIComponent(mixStr)}`;
  }, [volumes]);

  const loadMixString = useCallback((mixStr) => {
    if (!mixStr) return;
    const newVolumes = {};
    SOUND_DEFINITIONS.forEach((s) => {
      newVolumes[s.id] = 0;
    });
    mixStr.split(',').forEach((part) => {
      const [id, volStr] = part.split(':');
      const vol = parseInt(volStr, 10);
      if (id && !isNaN(vol) && vol > 0 && newVolumes[id] !== undefined) {
        newVolumes[id] = Math.min(100, Math.max(0, vol));
      }
    });
    setVolumes(newVolumes);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.includes('mix=')) {
        const match = hash.match(/mix=([^&]+)/);
        if (match && match[1]) {
          loadMixString(decodeURIComponent(match[1]));
        }
      }
    } catch {}
  }, [loadMixString]);

  // Apple-style Mindful Box Breathing (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(4);

  // Ambient Dynamic Backdrops
  const [ambientTheme, setAmbientTheme] = useState(() => {
    try {
      return localStorage.getItem('focus_ambient_theme') || 'obsidian';
    } catch {
      return 'obsidian';
    }
  });

  const changeAmbientTheme = useCallback((themeId) => {
    setAmbientTheme(themeId);
    try {
      localStorage.setItem('focus_ambient_theme', themeId);
    } catch {}
  }, []);

  // Audio Context Initialization (Lazy on first interaction)
  const initAudioEngine = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;
    if (typeof window === 'undefined') return null;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    try {
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      master.gain.setValueAtTime(masterVolume / 100, ctx.currentTime);
      master.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
      analyserRef.current = analyser;

      return ctx;
    } catch {
      return null;
    }
  }, [masterVolume]);

  // Hybrid Sound Synthesizers (Studio CC0 Audio + Web Audio Procedural Fallback)
  const createSoundSource = (ctx, masterGain, soundId) => {
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(masterGain);

    const soundDef = SOUND_DEFINITIONS.find((s) => s.id === soundId);
    if (!soundDef) return { gainNode, stopFn: () => {} };

    let stopFn = () => {};

    if (soundDef.type === 'binaural') {
      // Dynamic Binaural Beat Synthesis
      const mode = BRAINWAVE_MODES[soundDef.id] || BRAINWAVE_MODES.alpha;
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.setValueAtTime(mode.carrier, ctx.currentTime);
      oscR.frequency.setValueAtTime(mode.carrier + mode.hz, ctx.currentTime);

      binauralNodesRef.current = { oscL, oscR };

      if (panL && panR) {
        panL.pan.setValueAtTime(-1, ctx.currentTime);
        panR.pan.setValueAtTime(1, ctx.currentTime);
        oscL.connect(panL);
        oscR.connect(panR);
        panL.connect(gainNode);
        panR.connect(gainNode);
      } else {
        oscL.connect(gainNode);
        oscR.connect(gainNode);
      }

      oscL.start();
      oscR.start();

      stopFn = () => {
        try { oscL.stop(); oscR.stop(); } catch {}
        binauralNodesRef.current = null;
      };
    } else if (soundDef.id === 'scifi') {
      // Procedural Sci-Fi Starship Drone Synthesizer
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);
      filter.connect(gainNode);

      const oscs = [];
      const configs = [
        [55, 'sawtooth', 0.12],
        [55.4, 'sawtooth', 0.12],
        [82.4, 'triangle', 0.1],
        [110.2, 'sine', 0.08],
      ];

      configs.forEach(([freq, type, vol]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(vol, ctx.currentTime);
        osc.connect(g);
        g.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      // LFO filter sweep
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.035, ctx.currentTime);
      lfoGain.gain.setValueAtTime(150, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      oscs.push(lfo);

      stopFn = () => {
        oscs.forEach((o) => {
          try { o.stop(); } catch {}
        });
      };
    } else if (soundDef.type === 'procedural_noise') {
      // Procedural Colored Noise (Brown, Pink, White)
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const dataL = buffer.getChannelData(0);
      const dataR = buffer.getChannelData(1);

      let lastOutL = 0.0, lastOutR = 0.0;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;

        if (soundDef.noiseType === 'brown') {
          lastOutL = (lastOutL + 0.02 * whiteL) / 1.02;
          lastOutR = (lastOutR + 0.02 * whiteR) / 1.02;
          dataL[i] = lastOutL * 3.5;
          dataR[i] = lastOutR * 3.5;
        } else if (soundDef.noiseType === 'pink') {
          b0 = 0.99886 * b0 + whiteL * 0.0555179;
          b1 = 0.99332 * b1 + whiteL * 0.0750759;
          b2 = 0.96900 * b2 + whiteL * 0.1538520;
          b3 = 0.86650 * b3 + whiteL * 0.3104856;
          b4 = 0.55000 * b4 + whiteL * 0.5329522;
          b5 = -0.7616 * b5 - whiteL * 0.0168980;
          dataL[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + whiteL * 0.5362) * 0.11;
          dataR[i] = dataL[i];
          b6 = whiteL * 0.115926;
        } else {
          // White noise
          dataL[i] = whiteL * 0.16;
          dataR[i] = whiteR * 0.16;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      if (soundDef.noiseType === 'brown') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, ctx.currentTime);
      } else if (soundDef.noiseType === 'pink') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4500, ctx.currentTime);
      }

      noiseSource.connect(filter);
      filter.connect(gainNode);
      noiseSource.start(0);

      stopFn = () => {
        try { noiseSource.stop(); } catch {}
      };
    } else if (soundDef.file && typeof window !== 'undefined' && window.Audio) {
      // Studio Recording (Moodist / Nahian CC0)
      try {
        const audio = new window.Audio();
        audio.loop = true;
        audio.crossOrigin = 'anonymous';

        const basePrefix = process.env.PUBLIC_URL || '';
        const sourceUrl = soundDef.file.startsWith('/')
          ? `${basePrefix}${soundDef.file}`
          : soundDef.file;

        audio.src = sourceUrl;

        let sourceNode = null;
        if (ctx && ctx.createMediaElementSource) {
          try {
            sourceNode = ctx.createMediaElementSource(audio);
            sourceNode.connect(gainNode);
          } catch (e) {
            // In case of any cross-origin issue, audio still plays via DOM
          }
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (soundDef.fallbackUrl && audio.src !== soundDef.fallbackUrl) {
              audio.src = soundDef.fallbackUrl;
              audio.play().catch(() => {});
            }
          });
        }

        stopFn = () => {
          try {
            audio.pause();
            audio.currentTime = 0;
            audio.removeAttribute('src');
            audio.load();
          } catch {}
        };
      } catch (err) {
        // Fallback for test/JSDOM
      }
    }

    return { gainNode, stopFn };
  };

  // Play session complete chime
  const playChime = useCallback(() => {
    const ctx = initAudioEngine();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5

      chimeGain.gain.setValueAtTime(0.3, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {}
  }, [initAudioEngine]);

  // Master Play / Pause Toggle
  const toggleMasterPlay = useCallback(() => {
    const ctx = initAudioEngine();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    setIsPlaying((prev) => !prev);
  }, [initAudioEngine]);

  // Set single sound volume
  const setSoundVolume = useCallback((soundId, vol) => {
    const numVol = Math.max(0, Math.min(100, Number(vol)));
    setVolumes((prev) => ({
      ...prev,
      [soundId]: numVol,
    }));
    setActivePreset(null);

    // Auto switch atmospheric scene if mapped
    if (numVol > 0 && SOUND_TO_SCENE_MAP[soundId]) {
      setActiveScene(SOUND_TO_SCENE_MAP[soundId]);
    }
  }, []);

  // Toggle single sound on/off
  const toggleSound = useCallback((soundId) => {
    setVolumes((prev) => {
      const current = prev[soundId] || 0;
      const next = current > 0 ? 0 : 50;
      if (next > 0 && !isPlaying) {
        setIsPlaying(true);
        const ctx = initAudioEngine();
        if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
      }
      if (next > 0 && SOUND_TO_SCENE_MAP[soundId]) {
        setActiveScene(SOUND_TO_SCENE_MAP[soundId]);
      }
      return {
        ...prev,
        [soundId]: next,
      };
    });
  }, [isPlaying, initAudioEngine]);

  // Apply a curated or custom soundscape preset
  const applyPreset = useCallback((preset) => {
    if (!preset) return;
    setActivePreset(preset.id);
    const newVolumes = {};
    SOUND_DEFINITIONS.forEach((s) => {
      newVolumes[s.id] = preset.mix[s.id] || 0;
    });
    setVolumes(newVolumes);

    if (preset.scene) {
      setActiveScene(preset.scene);
    }

    if (!isPlaying) {
      setIsPlaying(true);
      const ctx = initAudioEngine();
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    }
  }, [isPlaying, initAudioEngine]);

  // Shuffle: a surprise mix of 2-3 harmonious sounds
  const shuffleMix = useCallback(() => {
    const eligible = SOUND_DEFINITIONS.filter((s) => s.id !== 'scifi');
    const pick1 = eligible[Math.floor(Math.random() * eligible.length)];
    const pick2 = eligible[Math.floor(Math.random() * eligible.length)];
    const pick3 = Math.random() > 0.4 ? eligible[Math.floor(Math.random() * eligible.length)] : null;

    const newVolumes = {};
    SOUND_DEFINITIONS.forEach((s) => {
      newVolumes[s.id] = 0;
    });

    newVolumes[pick1.id] = 50 + Math.floor(Math.random() * 25);
    newVolumes[pick2.id] = 30 + Math.floor(Math.random() * 25);
    if (pick3 && pick3.id !== pick1.id && pick3.id !== pick2.id) {
      newVolumes[pick3.id] = 25 + Math.floor(Math.random() * 20);
    }

    setVolumes(newVolumes);
    setActivePreset(null);

    const primaryScene = SOUND_TO_SCENE_MAP[pick1.id] || SOUND_TO_SCENE_MAP[pick2.id] || 'forest';
    setActiveScene(primaryScene);

    if (!isPlaying) {
      setIsPlaying(true);
      const ctx = initAudioEngine();
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    }
  }, [isPlaying, initAudioEngine]);

  // Clear all sound layers
  const clearAllSounds = useCallback(() => {
    setVolumes((prev) => {
      const reset = {};
      Object.keys(prev).forEach((k) => {
        reset[k] = 0;
      });
      return reset;
    });
    setActivePreset(null);
  }, []);

  // Sync Master Volume
  useEffect(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const gain = masterGainRef.current;
    const target = isMuted ? 0 : masterVolume / 100;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.05);
  }, [masterVolume, isMuted]);

  // Sync Individual Sound Nodes with Volumes
  useEffect(() => {
    if (!isPlaying) {
      Object.keys(soundNodesRef.current).forEach((soundId) => {
        const nodeObj = soundNodesRef.current[soundId];
        if (nodeObj && nodeObj.stopFn) {
          try { nodeObj.stopFn(); } catch {}
        }
      });
      soundNodesRef.current = {};
      return;
    }

    const ctx = initAudioEngine();
    if (!ctx || !masterGainRef.current) return;

    SOUND_DEFINITIONS.forEach((sound) => {
      const vol = volumes[sound.id] || 0;
      const targetGain = vol / 100;

      let nodeObj = soundNodesRef.current[sound.id];

      if (targetGain > 0) {
        if (!nodeObj) {
          nodeObj = createSoundSource(ctx, masterGainRef.current, sound.id);
          soundNodesRef.current[sound.id] = nodeObj;
        }
        if (nodeObj && nodeObj.gainNode) {
          nodeObj.gainNode.gain.cancelScheduledValues(ctx.currentTime);
          nodeObj.gainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.1);
        }
      } else if (nodeObj) {
        if (nodeObj.gainNode) {
          nodeObj.gainNode.gain.cancelScheduledValues(ctx.currentTime);
          nodeObj.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        }
        setTimeout(() => {
          if ((volumes[sound.id] || 0) === 0 && soundNodesRef.current[sound.id]) {
            try { soundNodesRef.current[sound.id].stopFn(); } catch {}
            delete soundNodesRef.current[sound.id];
          }
        }, 150);
      }
    });
  }, [isPlaying, volumes, initAudioEngine]);

  // Analog Vinyl Warmth Effect Node
  useEffect(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    if (isVinylWarmth && !vinylNodeRef.current) {
      try {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowshelf';
        filter.frequency.setValueAtTime(280, ctx.currentTime);
        filter.gain.setValueAtTime(4.5, ctx.currentTime);

        const highCut = ctx.createBiquadFilter();
        highCut.type = 'highshelf';
        highCut.frequency.setValueAtTime(8000, ctx.currentTime);
        highCut.gain.setValueAtTime(-2.5, ctx.currentTime);

        filter.connect(highCut);
        vinylNodeRef.current = { filter, highCut };
      } catch {}
    }
  }, [isVinylWarmth]);

  // Pomodoro Timer Engine
  useEffect(() => {
    if (timerStatus !== 'running') return;

    const interval = setInterval(() => {
      if (timerMode === 'stopwatch') {
        setStopwatchSeconds((prev) => prev + 1);
        return;
      }

      setTimeRemaining((prev) => {
        if (prev <= 1) {
          playChime();
          const modeConfig = TIMER_MODES[timerMode] || TIMER_MODES.pomodoro;

          if (timerPhase === 'focus') {
            logCompletedSession(currentTaskRef.current, modeConfig.focusMinutes, modeConfig.label);
            setCompletedSessions((s) => s + 1);
            setTimerPhase('break');
            return modeConfig.breakMinutes * 60;
          } else {
            setTimerPhase('focus');
            return modeConfig.focusMinutes * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStatus, timerMode, timerPhase, playChime, logCompletedSession]);

  // Timer Control Callbacks
  const startTimer = useCallback(() => {
    setTimerStatus('running');
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerStatus('paused');
  }, []);

  const resetTimer = useCallback(() => {
    setTimerStatus('idle');
    setTimerPhase('focus');
    setStopwatchSeconds(0);
    const modeConfig = TIMER_MODES[timerMode] || TIMER_MODES.pomodoro;
    setTimeRemaining(modeConfig.focusMinutes * 60);
  }, [timerMode]);

  const changeTimerMode = useCallback((newMode) => {
    setTimerMode(newMode);
    setTimerStatus('idle');
    setTimerPhase('focus');
    setStopwatchSeconds(0);
    const modeConfig = TIMER_MODES[newMode] || TIMER_MODES.pomodoro;
    setTimeRemaining(modeConfig.focusMinutes * 60);
  }, []);

  // Mindful Box Breathing Cycle (4s Inhale -> 4s Hold -> 4s Exhale -> 4s Hold)
  useEffect(() => {
    if (!isBreathingMode) return;

    const interval = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          setBreathingPhase((currentPhase) => {
            switch (currentPhase) {
              case 'inhale': return 'hold-in';
              case 'hold-in': return 'exhale';
              case 'exhale': return 'hold-out';
              case 'hold-out': return 'inhale';
              default: return 'inhale';
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingMode]);

  // Browser Tab Title Synchronization
  useEffect(() => {
    if (timerStatus === 'running') {
      const formatTime = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) {
          return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      const timeStr = timerMode === 'stopwatch'
        ? formatTime(stopwatchSeconds)
        : formatTime(timeRemaining);
      const phaseStr = timerPhase === 'focus' ? 'Focus' : 'Break';
      document.title = `(${timeStr}) ${phaseStr} · Focus Station`;
    } else {
      document.title = 'Focus Station · Hasan';
    }
  }, [timerStatus, timeRemaining, stopwatchSeconds, timerMode, timerPhase]);

  const activeSoundsCount = Object.values(volumes).filter((v) => v > 0).length;

  const value = {
    // Soundboard
    isPlaying,
    toggleMasterPlay,
    masterVolume,
    setMasterVolume,
    isMuted,
    setIsMuted,
    volumes,
    setSoundVolume,
    toggleSound,
    activePreset,
    applyPreset,
    clearAllSounds,
    activeSoundsCount,
    analyserRef,
    shuffleMix,
    favorites,
    toggleFavorite,
    sleepTimerMinutes,
    sleepTimerRemaining,
    setSleepTimer,
    getShareableMixUrl,
    loadMixString,

    // Scenes & Atmosphere
    activeScene,
    changeScene,

    // Quotes
    currentQuoteIndex,
    nextQuote,
    prevQuote,

    // YouTube Integration
    currentYtTrack,
    isYtPlaying,
    ytVolume,
    setYtVolume,
    isYtFolded,
    toggleYtFold,
    customYtLinks,
    playYtTrack,
    toggleYtPlay,
    nextYtTrack,
    prevYtTrack,
    addCustomYtLink,
    removeCustomYtLink,

    // Timer
    timerMode,
    changeTimerMode,
    timerStatus,
    timerPhase,
    timeRemaining,
    stopwatchSeconds,
    startTimer,
    pauseTimer,
    resetTimer,
    completedSessions,
    currentTask,
    setCurrentTask,
    sessionHistory,
    clearSessionHistory,

    // Brainwave & Synth
    brainwaveMode,
    changeBrainwaveMode,
    isVinylWarmth,
    setIsVinylWarmth,

    // Custom Presets
    userPresets,
    saveUserPreset,
    deleteUserPreset,

    // Breathing
    isBreathingMode,
    setIsBreathingMode,
    breathingPhase,
    breathingSeconds,

    // Themes & Zen
    ambientTheme,
    changeAmbientTheme,
    isZenMode,
    setIsZenMode,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};

export const useFocus = () => {
  const ctx = useContext(FocusContext);
  if (!ctx) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return ctx;
};
