import { getPayload } from "payload";
import path from "path";
import { fileURLToPath } from "url";

import config from "../payload.config";

type Locale = "ro" | "en" | "ru";

type SeedPost = {
    slug: string;
    image: string;
    publishedAt: string;
    translations: Record<
        Locale,
        {
            title: string;
            excerpt: string;
            content: string[];
            imageAlt: string;
        }
    >;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const seedPosts: SeedPost[] = [
    {
        slug: "service-schedule-current-week",
        image: "service-schedule.svg",
        publishedAt: "2026-05-06T09:00:00.000Z",
        translations: {
            ro: {
                title: "Programul slujbelor pentru săptămâna curentă",
                excerpt:
                    "Credincioșii sunt invitați să participe la Sfânta Liturghie, vecernie și celelalte rânduieli săvârșite la mănăstire.",
                content: [
                    "În această săptămână, obștea Mănăstirii Saharna va săvârși slujbele după programul obișnuit, cu Sfânta Liturghie în zilele rânduite și vecernie seara.",
                    "Pelerinii sunt rugați să ajungă din timp, pentru ca intrarea în biserică și participarea la rugăciune să se facă în liniște.",
                    "Pentru pomeniri, numele pot fi transmise și prin formularul online disponibil pe site.",
                ],
                imageAlt: "Ilustrație cu biserica mănăstirii Saharna",
            },
            en: {
                title: "Service schedule for the current week",
                excerpt:
                    "The faithful are invited to attend the Divine Liturgy, Vespers, and the other services celebrated at the monastery.",
                content: [
                    "This week, the brotherhood of Saharna Monastery will celebrate the services according to the regular schedule, including the Divine Liturgy on the appointed days and Vespers in the evening.",
                    "Pilgrims are asked to arrive early so that entering the church and joining the prayer can take place calmly.",
                    "Commemoration names may also be submitted through the online form available on the website.",
                ],
                imageAlt: "Illustration of Saharna monastery church",
            },
            ru: {
                title: "Расписание богослужений на текущую неделю",
                excerpt:
                    "Верующие приглашаются на Божественную литургию, вечерню и другие богослужения, совершаемые в монастыре.",
                content: [
                    "На этой неделе братия монастыря Сахарна совершит богослужения по обычному расписанию, включая Божественную литургию в установленные дни и вечерню вечером.",
                    "Паломников просят приходить заранее, чтобы вход в храм и участие в молитве проходили спокойно.",
                    "Имена для поминовения также можно передать через онлайн-форму на сайте.",
                ],
                imageAlt: "Иллюстрация храма монастыря Сахарна",
            },
        },
    },
    {
        slug: "paschal-message-egumen-saharna",
        image: "paschal-message.svg",
        publishedAt: "2026-05-04T09:00:00.000Z",
        translations: {
            ro: {
                title: "Mesaj pascal din partea Egumenului Sfintei Mănăstiri Saharna",
                excerpt:
                    "Arhimandritul Adrian Baciu adresează credincioșilor și pelerinilor un mesaj de lumină, pace și binecuvântare la sărbătoarea Învierii Domnului.",
                content: [
                    "Iubiți fii și fiice duhovnicești, dragi pelerini ai sfintei noastre mănăstiri, Hristos a înviat!",
                    "Sărbătoarea Învierii Domnului ne cheamă astăzi pe toți să lăsăm la o parte grijile trecătoare și să ne deschidem inimile către Lumina care nu apune niciodată. Dincolo de suferință și moarte, Hristos a biruit, dăruindu-ne tuturor nădejdea vieții veșnice și bucuria regăsirii în iubirea Tatălui.",
                    "Mănăstirea noastră, loc de rugăciune și liniște, vă primește cu dragoste în aceste zile sfinte. Ne rugăm ca Lumina Învierii să vă pătrundă în case, să vă tămăduiască sufletele și să vă aducă pacea de care avem atâta nevoie. Să păstrăm în inimi ecoul cântării pascale și să fim, la rândul nostru, lumină pentru cei din jurul nostru.",
                    "Vă dorim sărbători binecuvântate, sănătate deplină și tărie în credință!",
                    "Cu părintească dragoste și binecuvântare, Arhimandritul Adrian Baciu, egumenul Sfintei Mănăstiri Saharna.",
                ],
                imageAlt: "Ilustrație cu cruce și lumină pascală",
            },
            en: {
                title: "Paschal Message from the Abbot of the Holy Saharna Monastery",
                excerpt:
                    "Archimandrite Adrian Baciu addresses the faithful and pilgrims with a message of light, peace, and blessing for the Feast of the Lord's Resurrection.",
                content: [
                    "Beloved spiritual sons and daughters, dear pilgrims of our holy monastery, Christ is risen!",
                    "The Feast of the Lord's Resurrection calls all of us today to set aside passing worries and open our hearts to the Light that never sets. Beyond suffering and death, Christ has conquered, granting us all the hope of eternal life and the joy of being found again in the Father's love.",
                    "Our monastery, a place of prayer and quiet, receives you with love in these holy days. We pray that the Light of the Resurrection may enter your homes, heal your souls, and bring you the peace we need so deeply. Let us keep the echo of the Paschal hymn in our hearts and, in turn, become light for those around us.",
                    "We wish you blessed feast days, full health, and strength in faith!",
                    "With fatherly love and blessing, Archimandrite Adrian Baciu, Abbot of the Holy Saharna Monastery.",
                ],
                imageAlt: "Illustration with a cross and Paschal light",
            },
            ru: {
                title: "Пасхальное послание настоятеля Святой обители Сахарна",
                excerpt:
                    "Архимандрит Адриан Бачиу обращается к верующим и паломникам со словами света, мира и благословения в праздник Воскресения Господня.",
                content: [
                    "Возлюбленные духовные сыновья и дочери, дорогие паломники нашей святой обители, Христос воскресе!",
                    "Праздник Воскресения Господня призывает сегодня всех нас оставить временные заботы и открыть сердца Свету, который никогда не заходит. За пределами страдания и смерти Христос победил, даруя всем нам надежду вечной жизни и радость вновь обрести себя в любви Отца.",
                    "Наша обитель, место молитвы и тишины, с любовью принимает вас в эти святые дни. Мы молимся, чтобы Свет Воскресения вошел в ваши дома, исцелил ваши души и принес мир, в котором мы так нуждаемся. Сохраним в сердцах отзвук пасхального песнопения и сами станем светом для тех, кто рядом с нами.",
                    "Желаем вам благословенных праздников, крепкого здоровья и твердости в вере!",
                    "С отеческой любовью и благословением, архимандрит Адриан Бачиу, настоятель Святой обители Сахарна.",
                ],
                imageAlt: "Иллюстрация с крестом и пасхальным светом",
            },
        },
    },
    {
        slug: "monastic-complex-care-work",
        image: "monastic-care.svg",
        publishedAt: "2026-05-04T08:00:00.000Z",
        translations: {
            ro: {
                title: "Lucrări de îngrijire în complexul monahal",
                excerpt:
                    "Obștea continuă lucrările de întreținere a spațiilor de rugăciune și de primire pentru credincioși.",
                content: [
                    "Iubiți fii și fiice duhovnicești, dragi pelerini ai sfintei noastre mănăstiri, Hristos a înviat!.",
                    "Aceste lucrări ajută la păstrarea ordinii pentru credincioșii care vin la slujbe și pentru pelerinii care vizitează mănăstirea.",
                    "Obștea mulțumește tuturor celor care sprijină mănăstirea prin muncă, rugăciune și ajutor concret.",
                ],
                imageAlt: "Ilustrație cu alei și clădiri ale mănăstirii",
            },
            en: {
                title: "Care work across the monastic complex",
                excerpt:
                    "The brotherhood continues maintenance work on the prayer spaces and reception areas for the faithful.",
                content: [
                    "Maintenance work continues across the monastic complex, including the paths, reception areas, and spaces near the church.",
                    "This work helps preserve order for the faithful who come to services and for pilgrims visiting the monastery.",
                    "The brotherhood thanks everyone who supports the monastery through work, prayer, and practical help.",
                ],
                imageAlt: "Illustration of monastery paths and buildings",
            },
            ru: {
                title: "Работы по уходу за монастырским комплексом",
                excerpt:
                    "Братия продолжает работы по содержанию молитвенных помещений и мест приема верующих.",
                content: [
                    "На территории монастырского комплекса продолжаются работы по уходу за дорожками, местами приема и пространствами рядом с храмом.",
                    "Эти работы помогают сохранять порядок для верующих, приходящих на богослужения, и для паломников, посещающих монастырь.",
                    "Братия благодарит всех, кто поддерживает монастырь трудом, молитвой и конкретной помощью.",
                ],
                imageAlt: "Иллюстрация монастырских дорожек и зданий",
            },
        },
    },
    {
        slug: "pilgrimage-day-at-saharna",
        image: "service-schedule.svg",
        publishedAt: "2026-05-03T09:00:00.000Z",
        translations: {
            ro: {
                title: "Zi de pelerinaj la Mănăstirea Saharna",
                excerpt:
                    "Credincioșii sunt așteptați la rugăciune și închinare într-o zi dedicată pelerinilor care ajung la Saharna.",
                content: [
                    "Mănăstirea Saharna primește cu bucurie pelerinii care vin pentru rugăciune, liniște și întărire sufletească.",
                    "Vizitatorii sunt rugați să respecte programul slujbelor și să păstreze liniștea în apropierea bisericii și a locurilor de închinare.",
                    "Obștea mulțumește tuturor celor care vin cu credință și cu dragoste față de sfântul locaș.",
                ],
                imageAlt: "Ilustrație cu pelerini la Mănăstirea Saharna",
            },
            en: {
                title: "Pilgrimage day at Saharna Monastery",
                excerpt:
                    "The faithful are welcome for prayer and veneration on a day dedicated to pilgrims arriving at Saharna.",
                content: [
                    "Saharna Monastery warmly welcomes pilgrims who come for prayer, quiet, and spiritual strengthening.",
                    "Visitors are asked to respect the service schedule and preserve silence near the church and places of veneration.",
                    "The brotherhood thanks everyone who comes with faith and love for the holy monastery.",
                ],
                imageAlt: "Illustration of pilgrims at Saharna Monastery",
            },
            ru: {
                title: "День паломничества в монастыре Сахарна",
                excerpt:
                    "Верующие приглашаются на молитву и поклонение в день, посвященный паломникам, прибывающим в Сахарну.",
                content: [
                    "Монастырь Сахарна с радостью принимает паломников, приходящих для молитвы, тишины и духовного укрепления.",
                    "Посетителей просят соблюдать расписание богослужений и сохранять тишину рядом с храмом и местами поклонения.",
                    "Братия благодарит всех, кто приходит с верой и любовью к святой обители.",
                ],
                imageAlt: "Иллюстрация паломников в монастыре Сахарна",
            },
        },
    },
];

const seed = async () => {
    const payload = await getPayload({ config });
    const email = process.env.PAYLOAD_SEED_ADMIN_EMAIL;
    const password = process.env.PAYLOAD_SEED_ADMIN_PASSWORD;

    if (email && password) {
        const existingUsers = await payload.find({
            collection: "users",
            limit: 1,
            where: {
                email: {
                    equals: email,
                },
            },
        });

        if (existingUsers.totalDocs === 0) {
            await payload.create({
                collection: "users",
                data: {
                    email,
                    password,
                },
            });
        }
    }

    for (const post of seedPosts) {
        const ro = post.translations.ro;
        const existingPost = await payload.find({
            collection: "posts",
            limit: 1,
            where: {
                slug: {
                    equals: post.slug,
                },
            },
        });
        const existingMedia = await payload.find({
            collection: "media",
            limit: 1,
            where: {
                filename: {
                    equals: post.image,
                },
            },
        });
        const media =
            existingMedia.docs[0] ||
            (await payload.create({
                collection: "media",
                data: {
                    alt: ro.imageAlt,
                },
                filePath: path.resolve(dirname, "seed/media", post.image),
                locale: "ro",
            }));

        await payload.update({
            collection: "media",
            id: media.id,
            data: {
                alt: ro.imageAlt,
            },
            locale: "ro",
        });

        const data = {
            title: ro.title,
            slug: post.slug,
            excerpt: ro.excerpt,
            content: ro.content.join("\n\n"),
            mainImage: media.id,
            publishedAt: post.publishedAt,
            status: "published",
        };

        const seededPost =
            existingPost.docs[0] ?
                await payload.update({
                    collection: "posts",
                    id: existingPost.docs[0].id,
                    data,
                    locale: "ro",
                })
            :   await payload.create({
                    collection: "posts",
                    data,
                    locale: "ro",
                });

        for (const locale of ["en", "ru"] satisfies Locale[]) {
            const translation = post.translations[locale];

            await payload.update({
                collection: "posts",
                id: seededPost.id,
                data: {
                    title: translation.title,
                    excerpt: translation.excerpt,
                    content: translation.content.join("\n\n"),
                },
                locale,
            });

            await payload.update({
                collection: "media",
                id: media.id,
                data: {
                    alt: translation.imageAlt,
                },
                locale,
            });
        }
    }
};

seed()
    .then(() => {
        console.log("Payload seed completed.");
        process.exit(0);
    })
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });
