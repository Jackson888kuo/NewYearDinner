import { FullMenu } from './types';

// Hardcoded menu derived from the provided image
export const INITIAL_MENU: FullMenu = {
  soup: {
    title: "湯 (任選一項) Choice of Soup",
    required: true,
    multiSelect: false,
    items: [
      { id: "s1", name: "法式起司焗洋蔥湯 French Onion Soup au Gratin" },
      { id: "s2", name: "龍蝦濃湯 Lobster Bisque" },
      { id: "s3", name: "奶油蘑菇湯 Cream of Wild Mushroom Soup" },
    ],
  },
  aLaCarte: {
    title: "饕客加選 A La Carte",
    required: false,
    multiSelect: true,
    items: [
      { id: "al1", name: "香煎鴨肝 Seared Duck Foie Gras", price: 1080 },
      { id: "al2", name: "九孔鮑魚佐松露奶油醬 Baby Abalone with Truffle Butter Sauce", price: 980 },
      { id: "al3", name: "海膽牛肉捲 (2捲) Uni Beef Rolls (2 Rolls)", price: 980 },
    ],
  },
  appetizer: {
    title: "開胃前菜 (任選一項) Choice of Appetizer",
    required: true,
    multiSelect: false,
    items: [
      { id: "ap1", name: "太平洋明蝦佐蜂蜜芥末醬 Pacific King Prawn with Honey Mustard Sauce" },
      { id: "ap2", name: "屏東甘鯛、東港烏魚子佐白酒蛤蜊醬 Pingtung Tilefish and Donggang Mullet Roe" },
    ],
  },
  main: {
    title: "主餐 (任選一項) Choice of Main Course",
    required: true,
    multiSelect: false,
    items: [
      // Surf and Turf
      { id: "m1", name: "豪華海陸: 美國頂級老饕肋眼 Surf & Turf: U.S. Prime Rib Eye Cap", price: 6200 },
      { id: "m2", name: "豪華海陸: 美國頂級菲力 Surf & Turf: U.S. Prime Filet Mignon Steak", price: 4900 },
      { id: "m3", name: "豪華海陸: 美國頂級肋眼 Surf & Turf: U.S. Prime Rib Eye Steak", price: 4600 },
      { id: "m4", name: "豪華海陸: 美國頂級沙朗 Surf & Turf: U.S. Prime Sirloin Steak", price: 4400 },
      // US Prime
      { id: "m5", name: "老饕肋眼上選牛排 U.S. Prime Rib Eye Cap", price: 5200 },
      { id: "m6", name: "菲力牛排 U.S. Prime Filet Mignon Steak", price: 3900 },
      { id: "m7", name: "肋眼牛排 U.S. Prime Rib Eye Steak", price: 3600 },
      { id: "m8", name: "沙朗牛排 U.S. Prime Sirloin Steak", price: 3400 },
      // Wagyu
      { id: "m9", name: "黑毛和牛菲力牛排 A5 Filet Mignon Wagyu", price: 6000 },
      { id: "m10", name: "黑毛和牛肋眼牛排 A5 Rib Eye Steak Wagyu", price: 5900 },
      { id: "m11", name: "黑毛和牛沙朗牛排 A5 Sirloin Steak Wagyu", price: 5200 },
      // Specialties
      { id: "m12", name: "海鮮盤 (每日鮮魚、太平洋龍蝦半隻) Seafood Platter", price: 4200 },
      { id: "m13", name: "西班牙伊比利豚上蓋肉 Spain Iberico Bellota Pork", price: 3600 },
      { id: "m14", name: "紐西蘭高地和羊排 New Zealand Lumina Lamb Chop", price: 3400 },
    ],
  },
};