export const images: string[] = Object.values(
  import.meta.glob("../../imagesForMainPage/*.{png,jpg,jpeg}", { eager: true })
).map((mod: any) => mod.default);