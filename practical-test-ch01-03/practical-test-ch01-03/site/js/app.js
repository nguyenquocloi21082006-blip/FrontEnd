// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  const formatSeats = (event) => {
  const remaining = event.capacity - event.registeredCount;
  return remaining > 0 ? `Còn ${remaining}/${event.capacity} chỗ` : 'Hết chỗ';
};

const eventList = document.querySelector('#event-list');

const createEventCard = (event) => {
  const card = document.createElement('article');
  card.className = 'event-card';

  const img = document.createElement('img');
  img.setAttribute('src', 'img/event.svg');
  img.setAttribute('alt', `Hình minh hoạ $4{event.name}`);

  const heading = document.createElement('h2');
  const link = document.createElement('a');
  link.setAttribute('href', `event-detail.html?id=${encodeURIComponent(event.id)}`);
  link.textContent = event.name;
  heading.append(link);

  const timeP = document.createElement('p');
  const time = document.createElement('time');
  time.setAttribute('datetime', event.startTime);
  time.textContent = formatDateTime(event.startTime);
  timeP.append(time);

  const locationP = document.createElement('p');
  locationP.textContent = event.location;

  const seatsP = document.createElement('p');
  const seatsLabel = document.createElement('span');
  seatsLabel.textContent = formatSeats(event);
  if (event.registeredCount >= event.capacity) {
    seatsLabel.classList.add('badge-full');
  }
  seatsP.append(seatsLabel);

  card.append(img, heading, timeP, locationP, seatsP);
  return card;
};

const renderEvents = (events) => {
  eventList.replaceChildren(...events.map(createEventCard));
};

const statusEl = document.querySelector('#status');
const form = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword');

const loadEvents = async (keyword = '') => {
  const params = new URLSearchParams({ pageSize: '50' });
  const q = keyword.trim();
  if (q !== '') {
    params.set('q', q);
  }

  statusEl.textContent = 'Đang tải…';

  try {
    const response = await fetch(`${API_URL}/api/events?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    renderEvents(data.items);
    statusEl.textContent = data.items.length === 0
      ? 'Không có sự kiện nào khớp từ khoá.'
      : `Tìm thấy ${data.items.length} sự kiện`;
  } catch (error) {
    eventList.replaceChildren();
    statusEl.textContent = 'Không tải được dữ liệu, vui lòng thử lại.';
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadEvents(keywordInput.value);
});

loadEvents();
