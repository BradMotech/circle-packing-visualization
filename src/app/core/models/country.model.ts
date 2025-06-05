export interface CountryInterface {
    name:string;
    population:string;
    wikipediaUrl:string;
    flag:string;
    landAreaKm2:number;
}
type Subregion = CountryInterface[];

interface Region {
    [subregion:string]: Subregion;
}

export interface WorldDataSet {
    [region:string]: Region
}

export interface RenderCirclePackingModel {
    data: any;
    element: HTMLElement;
    onSelect: (country: any) => void;
}