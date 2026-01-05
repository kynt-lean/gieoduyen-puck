import { Config, Data } from "@measured/puck";
import { CountdownProps } from "./blocks/Countdown";
import { OurStoryProps } from "./blocks/OurStory";
import { WeddingHeroProps } from "./blocks/WeddingHero";

import { RootProps } from "./root";

export type { RootProps } from "./root";

export type Components = {
  WeddingHero: WeddingHeroProps;
  OurStory: OurStoryProps;
  Countdown: CountdownProps;
};

export type UserConfig = Config<{
  components: Components;
  root: RootProps;
  categories: ["hero", "story", "countdown"];
  fields: {
    userField: {
      type: "userField";
      option: boolean;
    };
  };
}>;

export type UserData = Data<Components, RootProps>;

