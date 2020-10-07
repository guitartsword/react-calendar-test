export interface RentItem {
    _id: string
    name: string
}

export interface Process {
    startDate: Date;
    endDate: Date;
    _id: string;
    rent_item: string;
}