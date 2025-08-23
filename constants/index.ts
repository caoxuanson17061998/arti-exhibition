// Filter products
export enum Size {
  Small = "SMALL",
  Medium = "MEDIUM",
  Large = "LARGE",
}

export enum Collection {
  All = "all",
  Natural = "natural",
  Flower = "flower",
  Emotion = "emotion",
  Summer = "summer",
}

export enum Scent {
  Lavender = "lavender",
  EucalyptusMint = "eucalyptus-mint",
  GreenTea = "green-tea",
  Rose = "rose",
  Peony = "peony",
  Jasmine = "jasmine",
  Sakura = "sakura",
  Citrus = "citrus",
  Berry = "berry",
  PineappleCoconut = "pineapple-coconut",
}

export enum Color {
  Cyan = "#03A9F4",
  Green = "#4CAF50",
  Orange = "#FFA000",
  Pink = "#F8BBD0",
  Red = "#F44336",
  DarkBlue = "#0D47A1",
  White = "#fff",
  Black = "#000",
}

export enum TAB_VALUE {
  All = "Tất cả",
  Nature = "Thiên nhiên",
  Art = "Nghệ thuật",
  Emotion = "Cảm xúc",
}

export enum SORT_VALUE {
  Featured = "Nổi bật",
  Newest = "Mới nhất",
  PriceHighToLow = "Giá: Cao - Thấp",
  PriceLowToHigh = "Giá: Thấp - Cao",
}

export const SIZE_OPTIONS = [
  {label: "Vừa (200ml)", value: Size.Medium},
  {label: "Lớn (300ml)", value: Size.Large},
];

export const COLLECTION_OPTIONS = [
  {label: "Tất cả", value: Collection.All},
  {label: "Hương Tự Nhiên", value: Collection.Natural},
  {label: "Sắc Hoa Thì Thầm", value: Collection.Flower},
  {label: "Thắp Lên Cảm Xúc", value: Collection.Emotion},
  {label: "Dấu Chân Mùa Hè", value: Collection.Summer},
];

export const SCENT_OPTIONS = [
  {label: "Oải hương", value: Scent.Lavender},
  {label: "Bạch đàn & Bạc hà", value: Scent.EucalyptusMint},
  {label: "Trà xanh", value: Scent.GreenTea},
  {label: "Hoa hồng", value: Scent.Rose},
  {label: "Mẫu đơn", value: Scent.Peony},
  {label: "Nhài", value: Scent.Jasmine},
  {label: "Hoa anh đào", value: Scent.Sakura},
  {label: "Cam, Chanh, Quýt", value: Scent.Citrus},
  {label: "Dâu rừng", value: Scent.Berry},
  {label: "Dứa & Dừa", value: Scent.PineappleCoconut},
];

export const COLOR_OPTIONS = [
  {label: "Cyan", value: Color.Cyan},
  {label: "Green", value: Color.Green},
  {label: "Orange", value: Color.Orange},
  {label: "Pink", value: Color.Pink},
  {label: "Red", value: Color.Red},
  {label: "Dark Blue", value: Color.DarkBlue},
  {label: "White", value: Color.White},
  {label: "Black", value: Color.Black},
];

export const TAB_OPTIONS = [
  {key: "all", label: TAB_VALUE.All},
  {key: "nature", label: TAB_VALUE.Nature},
  {key: "art", label: TAB_VALUE.Art},
  {key: "emotion", label: TAB_VALUE.Emotion},
];

export const SORT_OPTIONS = [
  {key: "featured", label: SORT_VALUE.Featured},
  {key: "newest", label: SORT_VALUE.Newest},
  {key: "oldest", label: "Cũ nhất"},
  {key: "priceHighToLow", label: SORT_VALUE.PriceHighToLow},
  {key: "priceLowToHigh", label: SORT_VALUE.PriceLowToHigh},
];

export const COLOR_CANDLE_OPTIONS = [
  {
    label: "Nude",
    value: "dustyRose",
    img: "/img/your-design/candle-nude.jpg",
  },
  {
    label: "Xanh dương",
    value: "powderBlue",
    img: "/img/your-design/candle-blue.jpg",
  },
  {
    label: "Hồng",
    value: "blushPink",
    img: "/img/your-design/candle-pink.jpg",
  },
  {
    label: "Xanh lục",
    value: "mintGreen",
    img: "/img/your-design/candle-green.jpg",
  },
  {
    label: "Đen",
    value: "charcoalBlack",
    img: "/img/your-design/candle-black.jpg",
  },
  {
    label: "Trắng",
    value: "softWhite",
    img: "/img/your-design/candle-white.jpg",
  },
];
