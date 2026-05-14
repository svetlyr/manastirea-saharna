import type { Locale } from "@i18n";

export type NewsImageClass = "post-image-portrait" | "post-image-icons" | "post-image-clergy";

export type NewsItem = {
  id: string;
  imageClass: NewsImageClass;
  translations: Record<
    Locale,
    {
      title: string;
      date: string;
      excerpt: string;
      body: string[];
    }
  >;
};

export const newsItems: NewsItem[] = [
  {
    id: "service-schedule-current-week",
    imageClass: "post-image-portrait",
    translations: {
      ro: {
        title: "Programul slujbelor pentru săptămâna curentă",
        date: "6 mai 2026",
        excerpt:
          "Credincioșii sunt invitați să participe la Sfânta Liturghie, vecernie și celelalte rânduieli săvârșite la mănăstire.",
        body: [
          "În această săptămână, obștea Mănăstirii Saharna va săvârși slujbele după programul obișnuit, cu Sfânta Liturghie în zilele rânduite și vecernie seara.",
          "Pelerinii sunt rugați să ajungă din timp, pentru ca intrarea în biserică și participarea la rugăciune să se facă în liniște.",
          "Pentru pomeniri, numele pot fi transmise și prin formularul online disponibil pe site.",
        ],
      },
      en: {
        title: "Service schedule for the current week",
        date: "May 6, 2026",
        excerpt:
          "The faithful are invited to attend the Divine Liturgy, Vespers, and the other services celebrated at the monastery.",
        body: [
          "This week, the brotherhood of Saharna Monastery will celebrate the services according to the regular schedule, including the Divine Liturgy on the appointed days and Vespers in the evening.",
          "Pilgrims are asked to arrive early so that entering the church and joining the prayer can take place calmly.",
          "Commemoration names may also be submitted through the online form available on the website.",
        ],
      },
      ru: {
        title: "Расписание богослужений на текущую неделю",
        date: "6 мая 2026 г.",
        excerpt:
          "Верующие приглашаются на Божественную литургию, вечерню и другие богослужения, совершаемые в монастыре.",
        body: [
          "На этой неделе братия монастыря Сахарна совершит богослужения по обычному расписанию, включая Божественную литургию в установленные дни и вечерню вечером.",
          "Паломников просят приходить заранее, чтобы вход в храм и участие в молитве проходили спокойно.",
          "Имена для поминовения также можно передать через онлайн-форму на сайте.",
        ],
      },
    },
  },
  {
    id: "paschal-message-egumen-saharna",
    imageClass: "post-image-icons",
    translations: {
      ro: {
        title: "Mesaj pascal din partea Egumenului Sfintei Mănăstiri Saharna",
        date: "4 mai 2026",
        excerpt:
          "Arhimandritul Adrian Baciu adresează credincioșilor și pelerinilor un mesaj de lumină, pace și binecuvântare la sărbătoarea Învierii Domnului.",
        body: [
          "Iubiți fii și fiice duhovnicești, dragi pelerini ai sfintei noastre mănăstiri, Hristos a înviat!",
          "Sărbătoarea Învierii Domnului ne cheamă astăzi pe toți să lăsăm la o parte grijile trecătoare și să ne deschidem inimile către Lumina care nu apune niciodată. Dincolo de suferință și moarte, Hristos a biruit, dăruindu-ne tuturor nădejdea vieții veșnice și bucuria regăsirii în iubirea Tatălui.",
          "Mănăstirea noastră, loc de rugăciune și liniște, vă primește cu dragoste în aceste zile sfinte. Ne rugăm ca Lumina Învierii să vă pătrundă în case, să vă tămăduiască sufletele și să vă aducă pacea de care avem atâta nevoie. Să păstrăm în inimi ecoul cântării pascale și să fim, la rândul nostru, lumină pentru cei din jurul nostru.",
          "Vă dorim sărbători binecuvântate, sănătate deplină și tărie în credință!",
          "Cu părintească dragoste și binecuvântare, Arhimandritul Adrian Baciu, egumenul Sfintei Mănăstiri Saharna.",
        ],
      },
      en: {
        title: "Paschal Message from the Abbot of the Holy Saharna Monastery",
        date: "May 4, 2026",
        excerpt:
          "Archimandrite Adrian Baciu addresses the faithful and pilgrims with a message of light, peace, and blessing for the Feast of the Lord's Resurrection.",
        body: [
          "Beloved spiritual sons and daughters, dear pilgrims of our holy monastery, Christ is risen!",
          "The Feast of the Lord's Resurrection calls all of us today to set aside passing worries and open our hearts to the Light that never sets. Beyond suffering and death, Christ has conquered, granting us all the hope of eternal life and the joy of being found again in the Father's love.",
          "Our monastery, a place of prayer and quiet, receives you with love in these holy days. We pray that the Light of the Resurrection may enter your homes, heal your souls, and bring you the peace we need so deeply. Let us keep the echo of the Paschal hymn in our hearts and, in turn, become light for those around us.",
          "We wish you blessed feast days, full health, and strength in faith!",
          "With fatherly love and blessing, Archimandrite Adrian Baciu, Abbot of the Holy Saharna Monastery.",
        ],
      },
      ru: {
        title: "Пасхальное послание настоятеля Святой обители Сахарна",
        date: "4 мая 2026 г.",
        excerpt:
          "Архимандрит Адриан Бачиу обращается к верующим и паломникам со словами света, мира и благословения в праздник Воскресения Господня.",
        body: [
          "Возлюбленные духовные сыновья и дочери, дорогие паломники нашей святой обители, Христос воскресе!",
          "Праздник Воскресения Господня призывает сегодня всех нас оставить временные заботы и открыть сердца Свету, который никогда не заходит. За пределами страдания и смерти Христос победил, даруя всем нам надежду вечной жизни и радость вновь обрести себя в любви Отца.",
          "Наша обитель, место молитвы и тишины, с любовью принимает вас в эти святые дни. Мы молимся, чтобы Свет Воскресения вошел в ваши дома, исцелил ваши души и принес мир, в котором мы так нуждаемся. Сохраним в сердцах отзвук пасхального песнопения и сами станем светом для тех, кто рядом с нами.",
          "Желаем вам благословенных праздников, крепкого здоровья и твердости в вере!",
          "С отеческой любовью и благословением, архимандрит Адриан Бачиу, настоятель Святой обители Сахарна.",
        ],
      },
    },
  },
  {
    id: "monastic-complex-care-work",
    imageClass: "post-image-clergy",
    translations: {
      ro: {
        title: "Lucrări de îngrijire în complexul monahal",
        date: "4 mai 2026",
        excerpt: "Obștea continuă lucrările de întreținere a spațiilor de rugăciune și de primire pentru credincioși.",
        body: [
          "Iubiți fii și fiice duhovnicești, dragi pelerini ai sfintei noastre mănăstiri, Hristos a înviat!.",
          "Aceste lucrări ajută la păstrarea ordinii pentru credincioșii care vin la slujbe și pentru pelerinii care vizitează mănăstirea.",
          "Obștea mulțumește tuturor celor care sprijină mănăstirea prin muncă, rugăciune și ajutor concret.",
        ],
      },
      en: {
        title: "Care work across the monastic complex",
        date: "May 4, 2026",
        excerpt:
          "The brotherhood continues maintenance work on the prayer spaces and reception areas for the faithful.",
        body: [
          "Maintenance work continues across the monastic complex, including the paths, reception areas, and spaces near the church.",
          "This work helps preserve order for the faithful who come to services and for pilgrims visiting the monastery.",
          "The brotherhood thanks everyone who supports the monastery through work, prayer, and practical help.",
        ],
      },
      ru: {
        title: "Работы по уходу за монастырским комплексом",
        date: "4 мая 2026 г.",
        excerpt: "Братия продолжает работы по содержанию молитвенных помещений и мест приема верующих.",
        body: [
          "На территории монастырского комплекса продолжаются работы по уходу за дорожками, местами приема и пространствами рядом с храмом.",
          "Эти работы помогают сохранять порядок для верующих, приходящих на богослужения, и для паломников, посещающих монастырь.",
          "Братия благодарит всех, кто поддерживает монастырь трудом, молитвой и конкретной помощью.",
        ],
      },
    },
  },
];

export function getNewsItems(locale: Locale) {
  return newsItems.map((item) => ({
    ...item,
    ...item.translations[locale],
  }));
}

export function getNewsItem(id: string | undefined, locale: Locale) {
  const item = newsItems.find((newsItem) => newsItem.id === id);

  return item ? { ...item, ...item.translations[locale] } : undefined;
}
