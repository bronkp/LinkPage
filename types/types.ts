export type LinkType = {
    name:string,
    link:string
}
export type SpecialType = {
    type:string,
    link:string
}

export type TreeType = {
    name:string,
    links:LinkType[],
    special_links:SpecialType[],
    url:string,
    pfp:string,
    theme:string,

}
export type Cord ={
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export type ColorPallet = {
    base:string;
    text:string;
    link:string;
    runner:string;
    headerBack:string;
    linkStyle:string;
    demo:string;
}