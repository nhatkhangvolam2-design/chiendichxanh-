import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK on server-side as required by guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

import fs from 'fs';

const STORE_PATH = path.resolve(__dirname, 'data', 'store.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(STORE_PATH))) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
}

// Fallback defaults if store.json is ever absent
const defaultInitialData = {
  participants: [] as any[],
  campaignStats: {
    volunteerCountMode: 'auto',
    customVolunteerCount: 0,
    wasteCollected: '0 kg',
    roadCleaned: '0 km',
    campaignsCompleted: '0 buổi',
  },
  announcements: [
    {
      id: 'ann-001',
      title: 'Thông báo: Ra quân Chiến dịch "Chủ Nhật Xanh" Quanh Khu Vực Trường',
      type: 'schedule',
      date: 'Chủ Nhật, ngày 02 tháng 11',
      time: '06:30 - 10:30 Sáng',
      gatheringLocation: 'Cổng chính Trường học (Khu vực sân khấu ngoài trời)',
      targetArea: 'Trục đường chính trước cổng trường, tuyến phố đi bộ và khu vực công viên đối diện',
      equipmentPrepared: [
        'Găng tay bảo hộ sợi dệt & cao su tái sử dụng',
        'Kẹp gắp rác inox dài 60cm',
        'Túi rác sinh học tự hủy 3 màu phân loại',
        'Cồn sát khuẩn, băng gạc y tế & bình nước mát',
      ],
      reminders: [
        'Mặc trang phục áo xanh thanh niên hoặc áo đồng phục thể dục của trường',
        'Đi giày thể thao hoặc giày bít mũi để đảm bảo an toàn khi di chuyển',
        'Tự trang bị bình nước cá nhân để hạn chế tối đa rác thải nhựa phát sinh',
        'Tuyệt đối không dùng tay không nhặt mảnh thủy tinh vỡ hoặc vật sắc nhọn',
      ],
      content: 'Ban Tổ Chức và Đoàn Trường trân trọng thông báo đến toàn thể học sinh, thầy cô và quý phụ huynh về lịch trình chi tiết buổi ra quân đợt mới. Buổi dọn rác nhằm mục tiêu thu gom toàn bộ túi nilon, chai nhựa, cốc trà sữa và lá cây tồn đọng xung quanh tường rào trường học.',
      scheduleTimeline: [
        { time: '06:30 - 07:00', activity: 'Tập trung tại cổng trường, điểm danh theo lớp và phát dụng cụ gắp rác, găng tay', leader: 'Thầy Bí thư Đoàn Trường & Đội trưởng Hậu cần' },
        { time: '07:00 - 07:15', activity: 'Khởi động, phổ biến quy tắc an toàn và phân công 4 phân đội theo sơ đồ khu vực', leader: 'Ban Tổ Chức' },
        { time: '07:15 - 09:30', activity: 'Triển khai thu gom rác dọc tuyến đường, vỉa hè và bãi cỏ xung quanh trường', leader: 'Các Trưởng nhóm phân đội' },
        { time: '09:30 - 10:00', activity: 'Tập kết rác tại điểm trạm trung chuyển, phân loại rác tái chế và cân đo khối lượng', leader: 'Tổ Phân Loại Rác Tái Chế' },
        { time: '10:00 - 10:30', activity: 'Tổng kết kết quả, chụp ảnh lưu niệm và trao chứng nhận tình nguyện xanh', leader: 'Ban Giám Hiệu & Đại diện Học sinh' },
      ],
      author: 'Đoàn Trường & Ban Điều Hành Chiến Dịch',
      pinned: true,
      createdAt: '2026-10-26',
    },
    {
      id: 'ann-002',
      title: 'Phát động phong trào "Mỗi Tuần Một Con Đường Không Rác"',
      type: 'announcement',
      date: 'Thường kỳ Thứ Bảy hàng tuần',
      time: '15:30 - 17:00 Chiều',
      gatheringLocation: 'Cổng sau nhà thi đấu thể thao',
      targetArea: 'Đoạn ngõ nối từ cổng sau trường ra khu dân cư và trạm xe buýt',
      equipmentPrepared: ['Chổi tre', 'Xẻng hốt rác', 'Thùng phân loại', 'Bao tải dứa'],
      reminders: ['Các chi đoàn lớp luân phiên phụ trách theo lịch phân công'],
      content: 'Nhằm duy trì thói quen giữ gìn vệ sinh môi trường lâu dài, Đoàn trường phát động phong trào duy trì con đường xanh sạch đẹp mỗi chiều thứ Bảy. Hoan nghênh các cá nhân tự nguyện tham gia.',
      author: 'Ban Môi Trường Học Đường',
      pinned: false,
      createdAt: '2026-10-24',
    },
  ],
  activityPosts: [] as any[],
};

// Safe helper to read from disk store
function getStore(): typeof defaultInitialData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      const safeParticipants = Array.isArray(parsed.participants)
        ? parsed.participants.filter((p: any) => !p.id.startsWith('vol-00'))
        : [];

      const safeStats = parsed.campaignStats || { ...defaultInitialData.campaignStats };
      if (safeStats.wasteCollected === '340+ kg') safeStats.wasteCollected = '0 kg';
      if (safeStats.roadCleaned === '2.5 km') safeStats.roadCleaned = '0 km';
      if (safeStats.campaignsCompleted === '06 buổi') safeStats.campaignsCompleted = '0 buổi';

      return {
        participants: safeParticipants,
        campaignStats: safeStats,
        announcements: Array.isArray(parsed.announcements) ? parsed.announcements : defaultInitialData.announcements,
        activityPosts: Array.isArray(parsed.activityPosts) ? parsed.activityPosts : [],
      };
    }
  } catch (err) {
    console.error('Failed to read store.json, using defaults:', err);
  }
  // Initialize file if not found
  saveStore(defaultInitialData);
  return defaultInitialData;
}

// Safe helper to write to disk store
function saveStore(data: any) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write store.json:', err);
  }
}

// --- CAMPAIGN STATS ENDPOINTS ---
app.get('/api/stats', (req: Request, res: Response) => {
  const store = getStore();
  const stats = store.campaignStats || defaultInitialData.campaignStats;
  const count = store.participants.length;

  res.json({
    ...stats,
    actualVolunteerCount: count,
    displayVolunteerCount:
      stats.volunteerCountMode === 'custom'
        ? stats.customVolunteerCount
        : count,
  });
});

app.put('/api/stats', (req: Request, res: Response) => {
  const store = getStore();
  const { volunteerCountMode, customVolunteerCount, wasteCollected, roadCleaned, campaignsCompleted } = req.body;

  if (!store.campaignStats) {
    store.campaignStats = { ...defaultInitialData.campaignStats };
  }

  if (volunteerCountMode !== undefined) {
    store.campaignStats.volunteerCountMode = volunteerCountMode;
  }
  if (customVolunteerCount !== undefined) {
    store.campaignStats.customVolunteerCount = Number(customVolunteerCount) || 0;
  }
  if (wasteCollected !== undefined) {
    store.campaignStats.wasteCollected = String(wasteCollected).trim();
  }
  if (roadCleaned !== undefined) {
    store.campaignStats.roadCleaned = String(roadCleaned).trim();
  }
  if (campaignsCompleted !== undefined) {
    store.campaignStats.campaignsCompleted = String(campaignsCompleted).trim();
  }

  saveStore(store);

  res.json({
    success: true,
    stats: store.campaignStats,
    displayVolunteerCount:
      store.campaignStats.volunteerCountMode === 'custom'
        ? store.campaignStats.customVolunteerCount
        : store.participants.length,
  });
});

// --- PARTICIPANTS ENDPOINTS ---
app.get('/api/participants', (req: Request, res: Response) => {
  const store = getStore();
  res.json({
    total: store.participants.length,
    participants: store.participants,
  });
});

app.post('/api/participants', (req: Request, res: Response) => {
  const { fullName, age, className, phone, rolePreference, message } = req.body;
  if (!fullName || !age || !className) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ họ tên, tuổi và lớp học.' });
  }

  const store = getStore();
  const newParticipant = {
    id: 'vol-' + Date.now(),
    fullName: String(fullName).trim(),
    age: Number(age),
    className: String(className).trim(),
    phone: phone ? String(phone).trim() : '',
    rolePreference: rolePreference || 'cleanup',
    message: message ? String(message).trim() : '',
    registeredAt: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
    checkInStatus: false,
  };

  store.participants.unshift(newParticipant);

  // If in custom mode, also bump the custom counter so it keeps pace with real-time registrations
  if (store.campaignStats) {
    if (store.campaignStats.volunteerCountMode === 'custom') {
      store.campaignStats.customVolunteerCount = (Number(store.campaignStats.customVolunteerCount) || 0) + 1;
    } else {
      store.campaignStats.customVolunteerCount = store.participants.length;
    }
  }

  saveStore(store);

  res.status(201).json({
    success: true,
    message: 'Đăng ký tham gia thành công!',
    participant: newParticipant,
    total: store.participants.length,
    participants: store.participants,
  });
});

app.delete('/api/participants/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const store = getStore();
  const initialLength = store.participants.length;
  store.participants = store.participants.filter((p: any) => p.id !== id);

  if (store.campaignStats) {
    if (store.campaignStats.volunteerCountMode === 'custom' && store.campaignStats.customVolunteerCount > 0) {
      store.campaignStats.customVolunteerCount = Math.max(0, Number(store.campaignStats.customVolunteerCount) - 1);
    } else {
      store.campaignStats.customVolunteerCount = store.participants.length;
    }
  }

  saveStore(store);

  res.json({
    success: true,
    message: 'Đã loại bỏ thành viên thành công.',
    deletedCount: initialLength - store.participants.length,
    total: store.participants.length,
    participants: store.participants,
  });
});

// --- ANNOUNCEMENTS ENDPOINTS ---
app.get('/api/announcements', (req: Request, res: Response) => {
  const store = getStore();
  res.json(store.announcements);
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const { title, type, date, time, gatheringLocation, targetArea, equipmentPrepared, reminders, content, scheduleTimeline, author } = req.body;
  if (!title || !date || !gatheringLocation) {
    return res.status(400).json({ error: 'Vui lòng cung cấp tiêu đề, ngày diễn ra và địa điểm tập kết.' });
  }

  const store = getStore();
  const newAnn = {
    id: 'ann-' + Date.now(),
    title: String(title).trim(),
    type: type || 'schedule',
    date: String(date).trim(),
    time: time || '07:00 - 10:00 Sáng',
    gatheringLocation: String(gatheringLocation).trim(),
    targetArea: targetArea || 'Khu vực quanh cổng và tường rào trường học',
    equipmentPrepared: Array.isArray(equipmentPrepared) ? equipmentPrepared : ['Găng tay', 'Túi rác', 'Kẹp gắp'],
    reminders: Array.isArray(reminders) ? reminders : ['Mặc đồng phục thể dục hoặc áo xanh tình nguyện'],
    content: content || '',
    scheduleTimeline: Array.isArray(scheduleTimeline) ? scheduleTimeline : [],
    author: author || 'Ban Tổ Chức Chiến Dịch',
    pinned: req.body.pinned || false,
    createdAt: new Date().toISOString().split('T')[0],
  };

  store.announcements.unshift(newAnn);
  saveStore(store);
  res.status(201).json(newAnn);
});

app.put('/api/announcements/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const store = getStore();
  const index = store.announcements.findIndex((a: any) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy thông báo.' });
  }
  store.announcements[index] = { ...store.announcements[index], ...req.body };
  saveStore(store);
  res.json(store.announcements[index]);
});

app.delete('/api/announcements/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const store = getStore();
  store.announcements = store.announcements.filter((a: any) => a.id !== id);
  saveStore(store);
  res.json({ success: true, message: 'Đã xóa thông báo thành công' });
});

// --- ACTIVITY POSTS ENDPOINTS ---
app.get('/api/posts', (req: Request, res: Response) => {
  const store = getStore();
  res.json(store.activityPosts);
});

app.post('/api/posts', (req: Request, res: Response) => {
  const { title, date, summary, content, imageUrl, metrics, author, tags } = req.body;
  if (!title || !summary || !content) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tiêu đề, tóm tắt và nội dung bài viết.' });
  }

  const store = getStore();
  const newPost = {
    id: 'post-' + Date.now(),
    title: String(title).trim(),
    date: date || new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
    summary: String(summary).trim(),
    content: String(content).trim(),
    imageUrl: imageUrl || '',
    metrics: metrics || {
      wasteCollectedKg: 65,
      participantsCount: store.participants.length,
      areaCleanedMeters: 400,
      recycledKg: 20,
    },
    author: author || 'Ban Biên Tập Hoạt Động Xanh',
    tags: Array.isArray(tags) ? tags : ['Tình Nguyện', 'Trường Học Xanh'],
  };

  store.activityPosts.unshift(newPost);
  saveStore(store);
  res.status(201).json(newPost);
});

app.delete('/api/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const store = getStore();
  store.activityPosts = store.activityPosts.filter((p: any) => p.id !== id);
  saveStore(store);
  res.json({ success: true, message: 'Đã xóa bài viết thành công' });
});

// --- GEMINI AI ASSISTANT ENDPOINTS ---

// 1. AI Announcement Drafter (General Task: gemini-3.8-flash)
app.post('/api/gemini/generate-announcement', async (req: Request, res: Response) => {
  try {
    const { schoolName, eventDate, targetArea, goals } = req.body;

    const prompt = `Bạn là Trưởng Ban Tổ Chức chiến dịch tình nguyện dọn rác học sinh - sinh viên tại Việt Nam.
Hãy viết một bản thông báo chính thức và lịch trình chi tiết cho đợt ra quân dọn rác mới:
- Trường: ${schoolName || 'Trường THPT'}
- Thời gian tổ chức: ${eventDate || 'Chủ Nhật tuần này lúc 07:00'}
- Khu vực dọn dẹp quanh trường: ${targetArea || 'Trục đường cổng chính, vỉa hè và hàng rào cây xanh quanh trường'}
- Mục tiêu: ${goals || 'Thu gom rác thải nhựa, dọn sạch vỉa hè, tạo cảnh quan xanh sạch đẹp'}

Yêu cầu định dạng đầu ra là JSON thuần túy (không kèm markdown ngoài block) gồm các trường:
{
  "title": "Tiêu đề thông báo thu hút, hào hứng",
  "time": "06:45 - 10:30 Sáng",
  "gatheringLocation": "Địa điểm tập kết cụ thể",
  "targetArea": "Khu vực phân công cụ thể",
  "equipmentPrepared": ["Dụng cụ 1", "Dụng cụ 2", "Dụng cụ 3", "Dụng cụ 4"],
  "reminders": ["Lưu ý 1", "Lưu ý 2", "Lưu ý 3", "Lưu ý 4"],
  "content": "Lời kêu gọi và mô tả chi tiết khoảng 2 đoạn văn",
  "scheduleTimeline": [
    {"time": "06:45 - 07:00", "activity": "Hoạt động 1", "leader": "Người phụ trách"},
    {"time": "07:00 - 07:15", "activity": "Hoạt động 2", "leader": "Người phụ trách"},
    {"time": "07:15 - 09:30", "activity": "Hoạt động 3", "leader": "Người phụ trách"},
    {"time": "09:30 - 10:15", "activity": "Hoạt động 4", "leader": "Người phụ trách"},
    {"time": "10:15 - 10:30", "activity": "Hoạt động 5", "leader": "Người phụ trách"}
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json({ success: true, draft: parsed });
  } catch (error: any) {
    console.error('Gemini generate-announcement error:', error);
    res.status(500).json({ error: error.message || 'Không thể tạo thông báo bằng AI.' });
  }
});

// 2. High Thinking Mode: Strategic Operational Campaign Planner & Safety Analysis
// Uses gemini-4-argon with thinkingLevel: HIGH (falls back to gemini-3.8-flash with HIGH thinking if argon encounters quota/billing)
app.post('/api/gemini/strategic-plan', async (req: Request, res: Response) => {
  try {
    const { schoolName, estimatedVolunteers, specialRisks, targetFocus } = req.body;

    const userPrompt = `Với vai trò là chuyên gia cố vấn chiến lược môi trường học đường, hãy phân tích sâu và lập KẾ HOẠCH TÁC CHIẾN TOÀN DIỆN cho chiến dịch dọn rác tình nguyện tại ${schoolName || 'khuôn viên và các tuyến đường quanh trường học'}:
- Dự kiến số lượng tình nguyện viên: ${estimatedVolunteers || '80-150 học sinh'}
- Trọng tâm dọn dẹp: ${targetFocus || 'Rác thải nhựa, vỉa hè xung quanh trường, gốc cây, bãi rác tự phát lân cận'}
- Các yếu tố rủi ro cần xử lý: ${specialRisks || 'Kim tiêm sắc nhọn, mảnh thủy tinh, mật độ giao thông giờ cao điểm, nắng nóng'}

Hãy thực hiện suy nghĩ chuyên sâu (deep reasoning) để xây dựng:
1. Sơ đồ phân chia 4 phân đội tác chiến (Đội Tiên phong gắp rác thô, Đội Phân loại tại nguồn, Đội Vận chuyển trung chuyển, Đội Tuyên truyền & Tiếp sức y tế).
2. Quy trình xử lý vật sắc nhọn/rác nguy hại chuẩn an toàn quốc gia cho học sinh.
3. Kế hoạch an toàn giao thông và phân luồng vỉa hè quanh cổng trường.
4. Cơ chế tính điểm rèn luyện và vinh danh tình nguyện viên.
5. Kế hoạch kết nối cơ sở thu mua tái chế và tái đầu tư vào quỹ cây xanh trường học.

Trả về kết quả bằng tiếng Việt, trình bày mạch lạc, có tính thực tiễn cao cho học sinh và thầy cô phụ trách.`;

    let generatedText = '';

    try {
      // First attempt with gemini-4-argon with ThinkingLevel.HIGH as requested
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: userPrompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });
      generatedText = response.text || '';
    } catch (argonErr: any) {
      console.warn('Fallback from gemini-4-argon to gemini-3.8-flash for strategic plan:', argonErr.message);
      // Fallback to gemini-3.8-flash with ThinkingLevel.HIGH
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });
      generatedText = fallbackResponse.text || '';
    }

    res.json({ success: true, plan: generatedText });
  } catch (error: any) {
    console.error('Gemini strategic-plan error:', error);
    res.status(500).json({ error: error.message || 'Không thể tạo kế hoạch chiến lược bằng AI.' });
  }
});

// 3. AI Eco Sorting & Waste Guidance for Volunteers
app.post('/api/gemini/eco-advisor', async (req: Request, res: Response) => {
  try {
    const { question, itemDescription } = req.body;
    const prompt = `Bạn là Trợ lý Sinh thái Xanh dành cho học sinh tình nguyện viên dọn rác quanh trường học.
Người dùng hỏi về: "${question || itemDescription || 'Phân loại rác'}"

Hãy trả lời ngắn gọn, thân thiện, dễ hiểu cho học sinh cấp 2, cấp 3:
1. Rác này thuộc nhóm nào: Rác tái chế (nhựa/lon/giấy), Rác hữu cơ, hay Rác nguy hại/vô cơ?
2. Cách xử lý an toàn (cần găng tay, kẹp gắp ra sao)?
3. Thời gian phân hủy trong tự nhiên là bao lâu?
4. Một lời khuyên thực tế để giảm loại rác này trong trường học.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error('Gemini eco-advisor error:', error);
    res.status(500).json({ error: error.message || 'Không thể kết nối trợ lý sinh thái.' });
  }
});

// 4. AI Slogan & Social Media Call to Action (Fast Task: gemini-3.8-flash)
app.post('/api/gemini/slogan', async (req: Request, res: Response) => {
  try {
    const { className, theme } = req.body;
    const prompt = `Tạo 5 khẩu hiệu (slogan) và 2 bài đăng ngắn (caption Facebook/Zalo) kêu gọi các bạn học sinh lớp ${className || 'toàn trường'} cùng tham gia nhặt rác bảo vệ môi trường quanh trường học vào cuối tuần.
Văn phong trẻ trung, hào hứng, nhiệt huyết của tuổi học trò, có hashtag phù hợp.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ success: true, slogans: response.text });
  } catch (error: any) {
    console.error('Gemini slogan error:', error);
    res.status(500).json({ error: error.message || 'Không thể tạo slogan.' });
  }
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Green School Cleanup Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
