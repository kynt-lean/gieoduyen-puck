import { UserData } from "./types";

export const initialData: Record<string, UserData> = {
  "/": {
    content: [
      {
        type: "WeddingHero",
        props: {
          subtitle: "THERE IS SOMEONE FOR EVERYONE",
          title: "WELCOME TO OUR WEDDING PLANNING SERVICE",
          images: {
            concept: {
              url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400",
              label: "CONCEPT",
            },
            decoration: {
              url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400",
              label: "DECORATION",
            },
            ceremony: {
              url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
              label: "CEREMONY",
            },
          },
          padding: "128px",
          id: "WeddingHero-1",
        },
      },
      {
        type: "Countdown",
        props: {
          title: "Đếm ngược đến ngày cưới",
          targetDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          padding: "96px",
          id: "Countdown-1",
        },
      },
      {
        type: "OurStory",
        props: {
          title: "KHÁM PHÁ CÂU CHUYỆN CỦA CHÚNG TÔI",
          milestones: [
            {
              number: "01",
              title: "CHÚNG TỚ VỪA QUEN",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400",
                  alt: "First meeting",
                },
                {
                  url: "https://images.unsplash.com/photo-1518568814500-bf0f8e125f46?w=400",
                  alt: "First date",
                },
              ],
            },
            {
              number: "02",
              title: "NĂM TAY NÈ",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1518568814500-bf0f8e125f46?w=400",
                  alt: "Holding hands",
                },
              ],
            },
            {
              number: "03",
              title: "YEAH YEAH! ĐƯỢC CẦU HÔN NÈ!",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
                  alt: "Proposal",
                },
              ],
            },
            {
              number: "04",
              title: "HÔM NAY CHÚNG TỎ CƯỜI",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400",
                  alt: "Wedding day",
                },
              ],
            },
          ],
          padding: "96px",
          id: "OurStory-1",
        },
      },
    ],
    root: { props: { title: "Gieo Duyên - Wedding / Invitation / Event" } },
    zones: {},
  },
};

