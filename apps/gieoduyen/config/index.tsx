import { WeddingHero } from "./blocks/WeddingHero";
import { OurStory } from "./blocks/OurStory";
import { Countdown } from "./blocks/Countdown";

import Root from "./root";
import { UserConfig } from "./types";
import { initialData } from "./initial-data";

export const conf: UserConfig = {
  root: Root,
  categories: {
    hero: {
      title: "Hero",
      components: ["WeddingHero"],
    },
    story: {
      title: "Our Story",
      components: ["OurStory"],
    },
    countdown: {
      title: "Countdown",
      components: ["Countdown"],
    },
  },
  components: {
    WeddingHero,
    OurStory,
    Countdown,
  },
};

export const componentKey = Buffer.from(
  `${Object.keys(conf.components).join("-")}-${JSON.stringify(initialData)}`
).toString("base64");

export default conf;

