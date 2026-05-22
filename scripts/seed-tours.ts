import { db } from '../lib/db';

const tours = [
  {
    slug: 'ras-mohammed-snorkeling',
    title: 'Ras Mohammed Snorkeling Trip',
    shortDesc: 'Explore the stunning coral reefs and marine life of Ras Mohammed National Park.',
    description: 'Discover the underwater paradise of Ras Mohammed National Park, one of the most beautiful marine reserves in the world. This full-day snorkeling trip takes you to the best spots in the Red Sea, where you can swim alongside colorful fish, sea turtles, and vibrant coral formations. The boat trip includes two snorkeling stops, a delicious lunch on board, and plenty of time to relax on the pristine beaches.',
    highlights: [
      'Visit 2 premium snorkeling spots',
      'See sea turtles, dolphins, and tropical fish',
      'Explore vibrant coral reefs',
      'Lunch and refreshments included',
      'Professional snorkeling guide',
    ],
    included: [
      'Hotel pickup and drop-off',
      'Boat trip with snorkeling equipment',
      'Lunch and soft drinks',
      'Professional guide',
      'National park entrance fee',
    ],
    notIncluded: [
      'Personal expenses',
      'Underwater camera rental',
      'Gratuities (optional)',
    ],
    itinerary: [
      { day: 1, title: 'Morning Pickup & Boat Departure', description: 'Hotel pickup at 7:00 AM, transfer to the marina, and departure to Ras Mohammed National Park. First snorkeling stop at Shark Reef.' },
      { day: 1, title: 'Second Snorkeling Stop', description: 'After lunch, head to Yolanda Reef for the second snorkeling session. Relax on the beach before returning to the marina around 4:00 PM.' },
    ],
    translations: {
      ru: {
        title: 'Снорклинг в Рас-Мохаммеде',
        shortDesc: 'Исследуйте потрясающие коралловые рифы и морскую жизнь национального парка Рас-Мохаммед.',
        description: 'Откройте для себя подводный рай национального парка Рас-Мохаммед, одного из самых красивых морских заповедников в мире. Эта однодневная экскурсия на снорклинг доставит вас в лучшие места Красного моря, где вы сможете плавать рядом с разноцветными рыбами, морскими черепахами и яркими коралловыми образованиями. Морская прогулка включает две остановки для снорклинга, вкусный обед на борту и много времени для отдыха на нетронутых пляжах.',
        highlights: [
          'Посещение 2 лучших мест для снорклинга',
          'Увидеть морских черепах, дельфинов и тропических рыб',
          'Исследование ярких коралловых рифов',
          'Обед и прохладительные напитки включены',
          'Профессиональный гид по снорклингу',
        ],
        included: [
          'Трансфер из отеля и обратно',
          'Морская прогулка со снаряжением для снорклинга',
          'Обед и безалкогольные напитки',
          'Профессиональный гид',
          'Входной билет в национальный парк',
        ],
        notIncluded: [
          'Личные расходы',
          'Аренда подводной камеры',
          'Чаевые (по желанию)',
        ],
        itinerary: [
          { day: 1, title: 'Утренний трансфер и отправление', description: 'Трансфер из отеля в 7:00, трансфер в марину и отправление в национальный парк Рас-Мохаммед. Первая остановка для снорклинга у Рифа Акул.' },
          { day: 1, title: 'Вторая остановка для снорклинга', description: 'После обеда отправляйтесь к рифу Йоланда для второго сеанса снорклинга. Отдых на пляже перед возвращением в марину около 16:00.' },
        ],
      },
    },
    price: 45,
    childPrice: 30,
    discountPrice: 35,
    duration: '8 hours',
    location: 'Sharm El-Sheikh',
    category: 'Snorkeling',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    ],
    maxCapacity: 20,
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    hasFreeCancellation: true,
  },
  {
    slug: 'blue-hole-diving',
    title: 'Blue Hole Diving Experience',
    shortDesc: 'Dive into the famous Blue Hole, one of the most iconic dive sites in the world.',
    description: 'Experience the thrill of diving at the legendary Blue Hole in Dahab. This world-famous dive site offers crystal-clear waters, dramatic underwater arches, and an abundance of marine life. Whether you are a certified diver or a beginner, our experienced instructors will ensure a safe and unforgettable diving adventure. The trip includes two dives, all equipment, and transportation from Sharm El-Sheikh.',
    highlights: [
      'Dive at the legendary Blue Hole',
      'Two guided dives with certified instructors',
      'See the famous underwater Arch',
      'All diving equipment included',
      'Transportation from Sharm El-Sheikh',
    ],
    included: [
      'Hotel pickup and drop-off',
      'Two guided dives',
      'Full diving equipment',
      'Certified dive instructor',
      'Lunch and refreshments',
    ],
    notIncluded: [
      'Diving certification course',
      'Underwater photography',
      'Personal dive insurance',
    ],
    itinerary: [
      { day: 1, title: 'Departure & First Dive', description: 'Early morning pickup, drive to Dahab (1.5 hours), safety briefing, and first dive at the Blue Hole.' },
      { day: 1, title: 'Second Dive & Return', description: 'After lunch, enjoy a second dive at a nearby reef. Return to Sharm El-Sheikh in the late afternoon.' },
    ],
    translations: {
      ru: {
        title: 'Дайвинг в Голубой дыре',
        shortDesc: 'Погрузитесь в знаменитую Голубую дыру — одно из самых iconic мест для дайвинга в мире.',
        description: 'Почувствуйте адреналин дайвинга в легендарной Голубой дыре в Дахабе. Это всемирно известное место для дайвинга предлагает кристально чистую воду, драматические подводные арки и обилие морской жизни. Независимо от того, являетесь ли вы сертифицированным дайвером или новичком, наши опытные инструкторы обеспечат безопасное и незабываемое приключение. Поездка включает два погружения, всё снаряжение и трансфер из Шарм-эль-Шейха.',
        highlights: [
          'Погружение в легендарной Голубой дыре',
          'Два погружения с сертифицированными инструкторами',
          'Увидеть знаменитую подводную Арку',
          'Всё снаряжение для дайвинга включено',
          'Трансфер из Шарм-эль-Шейха',
        ],
        included: [
          'Трансфер из отеля и обратно',
          'Два погружения с гидом',
          'Полное снаряжение для дайвинга',
          'Сертифицированный инструктор',
          'Обед и прохладительные напитки',
        ],
        notIncluded: [
          'Курс сертификации дайвера',
          'Подводная фотосъёмка',
          'Личная страховка дайвера',
        ],
        itinerary: [
          { day: 1, title: 'Отправление и первое погружение', description: 'Ранний утренний трансфер, поездка в Дахаб (1,5 часа), инструктаж по безопасности и первое погружение в Голубой дыре.' },
          { day: 1, title: 'Второе погружение и возвращение', description: 'После обеда наслаждайтесь вторым погружением у ближайшего рифа. Возвращение в Шарм-эль-Шейх поздно днём.' },
        ],
      },
    },
    price: 85,
    childPrice: 60,
    duration: '10 hours',
    location: 'Dahab',
    category: 'Diving',
    images: [
      'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800',
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    ],
    maxCapacity: 12,
    isActive: true,
    isFeatured: false,
    isBestseller: false,
    hasFreeCancellation: false,
  },
  {
    slug: 'desert-safari-bedouin-dinner',
    title: 'Desert Safari & Bedouin Dinner',
    shortDesc: 'An unforgettable evening in the Sinai desert with quad biking, camel rides, and traditional dinner.',
    description: 'Escape the city and immerse yourself in the beauty of the Sinai desert. This exciting evening adventure includes an exhilarating quad bike ride through the desert dunes, a magical camel ride under the stars, and a delicious traditional Bedouin dinner. Enjoy live entertainment including Tanoura dance and stargazing in one of the clearest skies in the world. A perfect experience for families and couples.',
    highlights: [
      'Quad biking through desert dunes',
      'Camel ride under the stars',
      'Traditional Bedouin dinner',
      'Live Tanoura dance show',
      'Stargazing in the clear desert sky',
    ],
    included: [
      'Hotel pickup and drop-off',
      'Quad bike (1 hour)',
      'Camel ride',
      'Bedouin dinner and drinks',
      'Entertainment show',
    ],
    notIncluded: [
      'Alcoholic beverages',
      'Quad bike insurance',
      'Personal expenses',
    ],
    itinerary: [
      { day: 1, title: 'Desert Adventure Begins', description: 'Hotel pickup at 3:00 PM, transfer to the desert camp. Quad biking session through the dunes followed by a scenic camel ride.' },
      { day: 1, title: 'Bedouin Evening', description: 'Enjoy a traditional Bedouin dinner, watch the Tanoura dance performance, and stargaze in the peaceful desert night.' },
    ],
    translations: {
      ru: {
        title: 'Сафари в пустыне и ужин у бедуинов',
        shortDesc: 'Незабываемый вечер в Синайской пустыне с квадроциклами, верблюдами и традиционным ужином.',
        description: 'Сбегите из города и погрузитесь в красоту Синайской пустыни. Это захватывающее вечернее приключение включает в себя захватывающую поездку на квадроциклах по пустынным дюнам, волшебную прогулку на верблюдах под звёздами и вкусный традиционный бедуинский ужин. Наслаждайтесь живыми выступлениями, включая танец Танура и наблюдение за звёздами в одном из самых чистых небес в мире. Идеальный опыт для семей и пар.',
        highlights: [
          'Поездка на квадроциклах по пустынным дюнам',
          'Прогулка на верблюдах под звёздами',
          'Традиционный бедуинский ужин',
          'Живое шоу танца Танура',
          'Наблюдение за звёздами в чистом небе пустыни',
        ],
        included: [
          'Трансфер из отеля и обратно',
          'Квадроцикл (1 час)',
          'Прогулка на верблюде',
          'Бедуинский ужин и напитки',
          'Развлекательное шоу',
        ],
        notIncluded: [
          'Алкогольные напитки',
          'Страховка квадроцикла',
          'Личные расходы',
        ],
        itinerary: [
          { day: 1, title: 'Начало приключения в пустыне', description: 'Трансфер из отеля в 15:00, трансфер в пустынный лагерь. Поездка на квадроциклах по дюнам, за которой следует живописная прогулка на верблюдах.' },
          { day: 1, title: 'Бедуинский вечер', description: 'Наслаждайтесь традиционным бедуинским ужином, смотрите выступление танца Танура и наблюдайте за звёздами в тихой пустынной ночи.' },
        ],
      },
    },
    price: 55,
    childPrice: 35,
    discountPrice: 45,
    duration: '6 hours',
    location: 'Sinai Desert',
    category: 'Adventure',
    images: [
      'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
      'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800',
    ],
    maxCapacity: 30,
    isActive: true,
    isFeatured: true,
    isBestseller: false,
    hasFreeCancellation: true,
  },
  {
    slug: 'tiran-island-boat-trip',
    title: 'Tiran Island Boat Trip',
    shortDesc: 'A full-day boat trip to the pristine Tiran Island with snorkeling and beach relaxation.',
    description: 'Set sail to the untouched beauty of Tiran Island, located at the entrance of the Gulf of Aqaba. This full-day boat trip offers crystal-clear waters, pristine coral reefs, and white sandy beaches. Snorkel at four different spots, enjoy a freshly prepared lunch on board, and relax on the island\'s secluded beaches. The trip is perfect for families, couples, and solo travelers looking for a peaceful escape.',
    highlights: [
      'Four snorkeling stops at pristine reefs',
      'Relax on untouched white sand beaches',
      'Fresh lunch and drinks on board',
      'Glass-bottom boat option',
      'Peaceful and uncrowded experience',
    ],
    included: [
      'Hotel pickup and drop-off',
      'Full-day boat trip',
      'Snorkeling equipment',
      'Lunch and soft drinks',
      'Professional guide',
    ],
    notIncluded: [
      'Glass-bottom boat fee',
      'Water sports activities',
      'Personal expenses',
    ],
    itinerary: [
      { day: 1, title: 'Morning Departure & Snorkeling', description: 'Hotel pickup at 8:00 AM, departure to Tiran Island. First two snorkeling stops at Jackson Reef and Gordon Reef.' },
      { day: 1, title: 'Beach Time & Return', description: 'After lunch, relax on the island beach. Two more snorkeling stops on the way back. Return to the marina around 5:00 PM.' },
    ],
    translations: {
      ru: {
        title: 'Морская прогулка на остров Тиран',
        shortDesc: 'Однодневная морская прогулка на нетронутый остров Тиран со снорклингом и отдыхом на пляже.',
        description: 'Отправляйтесь к нетронутой красоте острова Тиран, расположенного у входа в залив Акаба. Эта однодневная морская прогулка предлагает кристально чистую воду, нетронутые коралловые рифы и белые песчаные пляжи. Занимайтесь снорклингом в четырёх разных местах, наслаждайтесь свежеприготовленным обедом на борту и отдыхайте на уединённых пляжах острова. Поездка идеально подходит для семей, пар и одиночных путешественников, ищущих спокойный отдых.',
        highlights: [
          'Четыре остановки для снорклинга у нетронутых рифов',
          'Отдых на нетронутых пляжах с белым песком',
          'Свежий обед и напитки на борту',
          'Возможность лодки со стеклянным дном',
          'Спокойный и многолюдный опыт',
        ],
        included: [
          'Трансфер из отеля и обратно',
          'Однодневная морская прогулка',
          'Снаряжение для снорклинга',
          'Обед и безалкогольные напитки',
          'Профессиональный гид',
        ],
        notIncluded: [
          'Плата за лодку со стеклянным дном',
          'Водные виды спорта',
          'Личные расходы',
        ],
        itinerary: [
          { day: 1, title: 'Утреннее отправление и снорклинг', description: 'Трансфер из отеля в 8:00, отправление на остров Тиран. Первые две остановки для снорклинга у рифа Джексон и рифа Гордон.' },
          { day: 1, title: 'Время на пляже и возвращение', description: 'После обеда отдых на пляже острова. Ещё две остановки для снорклинга на обратном пути. Возвращение в марину около 17:00.' },
        ],
      },
    },
    price: 40,
    childPrice: 25,
    duration: '9 hours',
    location: 'Sharm El-Sheikh',
    category: 'Boat Trip',
    images: [
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    ],
    maxCapacity: 25,
    isActive: true,
    isFeatured: false,
    isBestseller: false,
    hasFreeCancellation: true,
  },
  {
    slug: 'cairo-pyramids-day-tour',
    title: 'Cairo Pyramids Day Tour',
    shortDesc: 'Full-day tour to the Great Pyramids of Giza, Egyptian Museum, and Khan El-Khalili bazaar.',
    description: 'Experience the wonders of ancient Egypt on this unforgettable full-day tour from Sharm El-Sheikh to Cairo. Visit the iconic Pyramids of Giza and the Great Sphinx, explore the treasures of the Egyptian Museum, and wander through the bustling Khan El-Khalili bazaar. The tour includes a delicious Egyptian lunch, all entrance fees, and comfortable air-conditioned transportation. A once-in-a-lifetime experience that brings history to life.',
    highlights: [
      'Visit the Great Pyramids of Giza',
      'See the Great Sphinx up close',
      'Explore the Egyptian Museum',
      'Shop at Khan El-Khalili bazaar',
      'Domestic flights included',
    ],
    included: [
      'Domestic flights (Sharm - Cairo - Sharm)',
      'Air-conditioned bus transportation',
      'Pyramids and Museum entrance fees',
      'Egyptian lunch',
      'Professional Egyptologist guide',
    ],
    notIncluded: [
      'Entry inside the pyramids (optional)',
      'Camel ride at the pyramids',
      'Personal expenses and souvenirs',
    ],
    itinerary: [
      { day: 1, title: 'Early Morning Flight to Cairo', description: 'Hotel pickup at 4:00 AM, transfer to the airport, and domestic flight to Cairo. Meet your Egyptologist guide and head to the Giza Plateau.' },
      { day: 1, title: 'Pyramids, Museum & Bazaar', description: 'Visit the Pyramids of Giza and the Sphinx. Enjoy lunch at a local restaurant. Explore the Egyptian Museum and finish with shopping at Khan El-Khalili bazaar before the evening flight back.' },
    ],
    translations: {
      ru: {
        title: 'Однодневная экскурсия в пирамиды Каира',
        shortDesc: 'Однодневная экскурсия к Великим пирамидам Гизы, Египетскому музею и базару Хан-эль-Халили.',
        description: 'Почувствуйте чудеса древнего Египта в этой незабываемой однодневной экскурсии из Шарм-эль-Шейха в Каир. Посетите культовые пирамиды Гизы и Великого Сфинкса, исследуйте сокровища Египетского музея и прогуляйтесь по оживлённому базару Хан-эль-Халили. Экскурсия включает вкусный египетский обед, все входные билеты и комфортный транспорт с кондиционером. Опыт раз в жизни, который оживляет историю.',
        highlights: [
          'Посещение Великих пирамид Гизы',
          'Увидеть Великого Сфинкса вблизи',
          'Исследование Египетского музея',
          'Шоппинг на базаре Хан-эль-Халили',
          'Внутренние рейсы включены',
        ],
        included: [
          'Внутренние рейсы (Шарм - Каир - Шарм)',
          'Транспорт на автобусе с кондиционером',
          'Входные билеты в пирамиды и музей',
          'Египетский обед',
          'Профессиональный гид-египтолог',
        ],
        notIncluded: [
          'Вход внутрь пирамид (по желанию)',
          'Прогулка на верблюде у пирамид',
          'Личные расходы и сувениры',
        ],
        itinerary: [
          { day: 1, title: 'Ранний утренний рейс в Каир', description: 'Трансфер из отеля в 4:00, трансфер в аэропорт и внутренний рейс в Каир. Встреча с гидом-египтологом и поездка на плато Гиза.' },
          { day: 1, title: 'Пирамиды, музей и базар', description: 'Посетите пирамиды Гизы и Сфинкса. Наслаждайтесь обедом в местном ресторане. Исследуйте Египетский музей и завершите шоппингом на базаре Хан-эль-Халили перед вечерним рейсом обратно.' },
        ],
      },
    },
    price: 180,
    childPrice: 120,
    discountPrice: 150,
    duration: '14 hours',
    location: 'Cairo',
    category: 'Cultural',
    images: [
      'https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=800',
      'https://images.unsplash.com/photo-1572252009286-268acec5045a?w=800',
      'https://images.unsplash.com/photo-1568322503251-71dae0fd6502?w=800',
    ],
    maxCapacity: 15,
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    hasFreeCancellation: false,
  },
];

async function main() {
  console.log('🌍 Seeding test tours...');

  let created = 0;
  let skipped = 0;

  for (const tour of tours) {
    const existing = await db.tour.findUnique({ where: { slug: tour.slug } });
    if (existing) {
      console.log(`⏭️  Skipped: ${tour.title} (already exists)`);
      skipped++;
      continue;
    }

    await db.tour.create({ data: tour });
    console.log(`✅ Created: ${tour.title}`);
    created++;
  }

  console.log(`\n📊 Done! ${created} created, ${skipped} skipped.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding tours:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
