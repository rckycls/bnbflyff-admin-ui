const MAIN_EQUIPMENT = [
  { slot: 10, title: "Primary Weapon" },
  { slot: 9, title: "Secondary Weapon / Shield" },
  { slot: 2, title: "Suit" },
  { slot: 4, title: "Gauntlet" },
  { slot: 5, title: "Boots" },
  { slot: 6, title: "Helmet" },
];

const COSTUME = [
  { slot: 27, title: "Cloth" },
  { slot: 28, title: "Gloves" },
  { slot: 29, title: "Shoes" },
  { slot: 26, title: "Hat" },
  { slot: 8, title: "Cloak" },
  { slot: 12, title: "Mask / Glasses" },
];

const ACCESSORIES = [
  { slot: 19, title: "Necklace" },
  { slot: 20, title: "Ring" },
  { slot: 21, title: "Ring" },
  { slot: 22, title: "Earring" },
  { slot: 23, title: "Earring" },
];

const getInventoryItems = (
  bag: "MAIN_EQUIPMENT" | "COSTUME" | "ACCESSORIES"
) => {
  switch (bag) {
    case "MAIN_EQUIPMENT":
      return MAIN_EQUIPMENT;
    case "COSTUME":
      return COSTUME;
    case "ACCESSORIES":
      return ACCESSORIES;
    default:
      return [];
  }
};

export default getInventoryItems;
