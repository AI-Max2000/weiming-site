// Public marketing content only. Set gameUrl after verifying the final game entry.
export const siteConfig = { gameUrl: '' };

export const questions = [
  { text:'电梯是坏的吗？', answer:'否', kind:'no', explanation:'电梯一直可以正常运行。' },
  { text:'这和他的身高有关吗？', answer:'是', kind:'yes', clue:'身高', explanation:'你找到了一个关键线索：他的身高。' },
  { text:'下雨时，他多带了一件东西吗？', answer:'是', kind:'yes', clue:'雨具', explanation:'是的，那件东西平时不会随身携带。' },
  { text:'晴天有人同行，也能到十楼吗？', answer:'是', kind:'yes', clue:'同行者', explanation:'如果有人愿意帮忙，他也能直接回家。' },
  { text:'他住在几号房很重要吗？', answer:'不重要', kind:'neutral', explanation:'房间号码不影响这个故事的真相。' }
];

export const themes = [
  { id:'logic', name:'悬疑推理', english:'THE UNEXPECTED', line:'最合理的解释，往往最出乎意料。', image:'selection-logic.webp', color:'#91afd2', description:'一个矛盾的细节，就能推翻整个猜想。顺着时间、人物和动机，找到故事里被藏起来的那一环。', audience:'喜欢逻辑、反转和细节的人', feeling:'从“不可能”到“原来如此”', advice:'先确认发生了什么，再追问为什么。' },
  { id:'eerie', name:'惊悚微恐', english:'AFTER DARK', line:'不敢细想的地方，恰好藏着答案。', image:'selection-eerie.webp', color:'#abb787', description:'诡异的声音、反常的举动、说不清的不安。越是熟悉的场景，越可能藏着让人背后一凉的故事。', audience:'喜欢诡异氛围与悬念的人', feeling:'每多知道一点，就多一分不安', advice:'和朋友一起，把那些不敢问的细节问清楚。' },
  { id:'heart', name:'情感故事', english:'BETWEEN THE LINES', line:'有些真相，值得慢一点揭开。', image:'selection-heart.webp', color:'#d0a6a0', description:'看似平常的选择背后，也许藏着一句没说出口的话。拨开误解，读懂人物真正想守护的东西。', audience:'在意人物、关系和动机的人', feeling:'答案揭晓时，重新理解每一句话', advice:'别只问他做了什么，也问他为什么这样做。' },
  { id:'joy', name:'欢乐脑洞', english:'THINK SIDEWAYS', line:'放下常识，换个方向笑出声。', image:'selection-joy.webp', color:'#dac585', description:'一本正经的开场，意想不到的走向。当常规解释都走不通，换个脑回路，也许就能打开答案。', audience:'想轻松开局、一起放飞脑洞的人', feeling:'原来还能这样！', advice:'大胆提出猜想，有时最离谱的那个刚好接近真相。' }
];
